package principal.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import jakarta.mail.*;
import jakarta.mail.internet.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import principal.model.Comments;
import principal.model.Review;
import principal.model.User;
import principal.repository.CommentsRepository;
import principal.repository.ReviewRepository;
import principal.repository.UserRepository;
import principal.service.S3PublicImageService;
import software.amazon.awssdk.services.s3.S3Client;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * PrincipalController
 * REST controller that exposes endpoints for user, review and comment management,
 * authentication, file uploads to S3, and simple social features (follow/friends).
 *
 * All method-level comments were added in English to explain behaviour, inputs and
 * expected outputs. The implementation logic remains unchanged.
 */
@RestController
@RequestMapping("resenalo")
public class PrincipalController {

	@Autowired
	private CommentsRepository commentsRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	private S3PublicImageService s3PublicImageService;

	/**
	 * Generate a bcrypt hash for a plain password.
	 * @param plainPassword raw password
	 * @return bcrypt hashed password
	 */
	public static String hashPassword(String plainPassword) {
		// 10-12 suele ser un buen coste; 12 es común si el servidor lo aguanta
		int cost = 12;
		return BCrypt.hashpw(plainPassword, BCrypt.gensalt(cost));
	}

	/**
	 * Send an email using SMTP.
	 * This helper wraps JavaMail usage to send a message with optional attachments.
	 * @param mensaje body text of the email
	 * @param asunto subject of the email
	 * @param email_remitente sender email address
	 * @param email_remitente_pass sender password (used for SMTP auth)
	 * @param host_email SMTP host
	 * @param port_email SMTP port
	 * @param emails_destino list of recipient emails
	 * @param anexos optional attachment file paths
	 * @throws MessagingException if sending fails
	 * @throws IOException if reading attachments fails
	 */
	public static void envioMail(String mensaje, String asunto, String email_remitente, String email_remitente_pass,
			String host_email, String port_email, String[] emails_destino, String[] anexos)
			throws MessagingException, IOException {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", host_email);
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.port", port_email);
		Session session = Session.getDefaultInstance(props);

		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(email_remitente));
		for (String dest : emails_destino) {
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(dest));
		}
		message.setSubject(asunto, "UTF-8");

		// Cuerpo del mensaje
		MimeBodyPart textPart = new MimeBodyPart();
		textPart.setText(mensaje, "UTF-8");
		Multipart multipart = new MimeMultipart();
		multipart.addBodyPart(textPart);

		if (anexos != null) {
			for (String filePath : anexos) {
				MimeBodyPart attachmentPart = new MimeBodyPart();
				attachmentPart.attachFile(filePath);
				multipart.addBodyPart(attachmentPart);
			}
		}

		message.setContent(multipart);

		Transport transport = session.getTransport("smtp");
		transport.connect(host_email, email_remitente, email_remitente_pass);
		transport.sendMessage(message, message.getAllRecipients());
		transport.close();
	}

	/**
	 * Register a new user.
	 * Expects a JSON body with email, user, password and name. Sends an email
	 * verification code, creates the User object with defaults and saves it.
	 * Returns 409 if email or username already exist.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "user": "username",
	 *   "password": "password123",
	 *   "name": "John Doe"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if registered, 409 if email or username exists
	 */
	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestBody String body) throws IOException, MessagingException {

		JSONObject json = new JSONObject(body);
		String email = json.getString("email");
		String user = json.getString("user");
		String password = json.getString("password");
		String name = json.getString("name");
		String[] emails = { email };
		String[] anexos = {};
		// Email ya registrado
		if (userRepository.existsByEmail(email)) {
			return ResponseEntity.status(HttpStatus.CONFLICT) // 409
					.body("Este correo ya está registrado");
		}

		// Username ya usado
		if (userRepository.existsByUser(user)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Este nombre de usuario ya existe");
		}

		// Encriptar contraseña
		String pass = hashPassword(password);

		int token = ThreadLocalRandom.current().nextInt(100000, 999999);
		String message = ("Este es tu codigo de verificacion: " + token);
		envioMail(message, "Verificacion de correo", "resenalo.company@gmail.com", "wknw ylvo zfqd trxc",
				"smtp.gmail.com", "587", emails, anexos);
		// Crear el objeto de usuario
		User newUser = new User();
		newUser.setUser(user);
		newUser.setEmail(email);
		newUser.setPassword(pass);
		newUser.setVerified(false);
		newUser.setDate(new Date());
		newUser.setName(name);
		newUser.setToken(token);
		newUser.setDescription("");
		newUser.setLanguage("en");
		newUser.setTheme("light");
		newUser.setImage("https://resenalo.s3.us-east-1.amazonaws.com/public/reviews/foto_default.png");
		// Guardar el usuario en la base de datos
		userRepository.save(newUser);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	/**
	 * Authenticate a user by email and password.
	 * Validates the password against the stored bcrypt hash and marks user as verified.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "password": "password123"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if authenticated, 401 if credentials are invalid
	 */
	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody String body) {
		try {
			JSONObject json = new JSONObject(body);
			String email = json.getString("email");
			String password = json.getString("password");

			// Buscar usuario por email
			User dbUser = userRepository.findByEmail(email);

			if (dbUser == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body("{\"error\": \"Credenciales incorrectas o usuario no registrado\"}");
			}

			// Comparar la contraseña proporcionada con el hash almacenado
			boolean ok = BCrypt.checkpw(password, dbUser.getPassword());

			if (!ok) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Credenciales incorrectas\"}");
			}

			// Comprobar si el usuario ya está verificado
			if (!dbUser.isVerified()) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"El usuario ya está logueado\"}");
			}

			// Marcar al usuario como verificado
			dbUser.setVerified(true);
			userRepository.save(dbUser);

			return ResponseEntity.status(HttpStatus.OK).build();

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("{\"error\": \"Error en el servidor: " + e.getMessage() + "\"}");
		}
	}

	/**
	 * Logout endpoint: expects an email in the request body and performs
	 * logout-related persistence updates if necessary.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if logout successful, 400/404 if error
	 */
	@PostMapping("/logout")
	public ResponseEntity<Object> logout(@RequestBody String body) {
		try {
			JSONObject json = new JSONObject(body);
			String email = json.getString("email");

			// Buscar usuario por email
			User dbUser = userRepository.findByEmail(email);

			if (dbUser == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body("Credenciales incorrectas o usuario no registrado");
			}

			userRepository.save(dbUser);

			return ResponseEntity.status(HttpStatus.OK).build();

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error en el servidor: " + e.getMessage());
		}
	}

	/**
	 * Verify an email using a numeric token.
	 * Expects JSON with token and email. If token matches, marks user as verified.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "token": 123456
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if verified, 401 if token/email invalid
	 */
	@PostMapping("verifyEmail")
	public ResponseEntity<Object> verifyEMail(@RequestBody String body) {
		JSONObject json = new JSONObject(body);
		int token = json.getInt("token");
		String email = json.getString("email");
		User user = userRepository.findByEmail(email);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Credenciales incorrectas o usuario no registrado");
		}

		if (user.getToken() != token) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no valido");
		} else {
			user.setVerified(true);
			userRepository.save(user);
			return ResponseEntity.status(HttpStatus.OK).build();
		}

	}

	/**
	 * Upload a review with optional base64 image files.
	 * Parses coordinates, creates the Review entity, uploads image files to S3 and
	 * stores the public URLs in the review.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "title": "Great Place!",
	 *   "user": "username",
	 *   "valoration": 4.5,
	 *   "description": "Nice food and service.",
	 *   "type": "restaurant",
	 *   "coords": "40.4168,-3.7038",
	 *   "files": ["base64string1", "base64string2"]
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if review uploaded, 400/404 if error
	 */
	@PostMapping("/uploadReview")
	public ResponseEntity<Object> uploadReview(@RequestBody String body) throws IOException {

		JSONObject json = new JSONObject(body);

		String title = json.getString("title");
		String user = json.getString("user");
		double valoration = json.getDouble("valoration");
		String description = json.getString("description");
		String type = json.getString("type");

		String coords = json.getString("coords");
		String[] coords2 = coords.split(",");
		double latitud = Double.parseDouble(coords2[0].trim());
		double longitud = Double.parseDouble(coords2[1].trim());

		Review resena = new Review();
		resena.setTitle(title);
		resena.setUser(user);
		resena.setValoration(valoration);
		resena.setValorationInitial(valoration);
		resena.setDescription(description);
		resena.setType(type);
		resena.setLatitud(latitud);
		resena.setLongitud(longitud);
		resena.setImageUrls(new ArrayList<>());

		resena = reviewRepository.save(resena);

		if (json.has("files") && !json.isNull("files")) {
			JSONArray files = json.getJSONArray("files");

			for (int i = 0; i < files.length(); i++) {
				String base64Image = files.getString(i);
				if (base64Image == null || base64Image.isBlank())
					continue;

				byte[] imageBytes = Base64.getDecoder().decode(base64Image);

				String relative = "reviews/" + resena.getId() + "/" + UUID.randomUUID() + ".jpg";
				String key = s3PublicImageService.buildKey(relative); // -> public/....

				String publicUrl = s3PublicImageService.uploadAndGetPublicUrl(key, imageBytes, "image/jpeg");
				resena.getImageUrls().add(publicUrl);
			}

			reviewRepository.save(resena);
		}

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	/**
	 * Follow another user.
	 * Body expects 'user' (follower) and 'userFollow' (target). Updates followed/followers
	 * lists and establishes a friend relationship if both follow each other.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "user": "alice",
	 *   "userFollow": "bob"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if follow successful, 400/404 if error
	 */
	@PostMapping("addFollow")
	public ResponseEntity<String> addFollow(@RequestBody Map<String, String> body) {
	    String username = body.get("user");
	    String targetUsername = body.get("userFollow");

	    if (username == null || targetUsername == null || username.equals(targetUsername)) {
	        return ResponseEntity.badRequest().body("Datos inválidos o intento de auto-seguimiento");
	    }

	    User user = userRepository.findByUser(username);
	    User targetUser = userRepository.findByUser(targetUsername);

	    if (user == null || targetUser == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    boolean alreadyFollowing = user.getFolloweds().contains(targetUsername);

	    if (!alreadyFollowing) {
	        user.getFolloweds().add(targetUsername);
	        targetUser.getFollowers().add(username);
	        

	        if (targetUser.getFolloweds().contains(username)) {
	            if (!user.getFriends().contains(targetUsername)) {
	                user.getFriends().add(targetUsername);
	            }
	            if (!targetUser.getFriends().contains(username)) {
	                targetUser.getFriends().add(username);
	            }
	        }
	        userRepository.save(user);
	        userRepository.save(targetUser);
	        
	        return ResponseEntity.status(HttpStatus.OK).body("Seguimiento realizado");
	    }

	    return ResponseEntity.status(HttpStatus.OK).body("Seguimiento realizado");
	}
	
	/**
	 * Unfollow a user.
	 * Removes the target user from the caller's followed list and updates followers/friends accordingly.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "user": "alice",
	 *   "userFollow": "bob"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if unfollowed, 404 if user not found
	 */
	@PostMapping("deleteFollow")
	public ResponseEntity<Object> deleteFollow(@RequestBody String body) throws IOException {
		JSONObject json = new JSONObject(body);
		String us = json.getString("user");
		String usFollow = json.getString("userFollow");

		// Buscar usuario
		User user = userRepository.findByUser(us);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Buscar usuario a dejar de seguir
		User userFollow = userRepository.findByUser(usFollow);
		if (userFollow == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Quitar usuario a la lista de seguidos si está presente
		List<String> listFollow = user.getFolloweds();
		List<String> listFriends1 = user.getFriends();
		if (listFollow.contains(userFollow.getUser())) {
			listFollow.remove(userFollow.getUser());
			listFriends1.remove(userFollow.getUser());
			user.setFolloweds(listFollow);
			user.setFriends(listFriends1);
			userRepository.save(user);
		}

		List<String> listFollowers = userFollow.getFollowers();
		List<String> listFriends2 = userFollow.getFriends();
		if (listFollowers.contains(user.getUser())) {
			listFollowers.remove(user.getUser());
			listFriends2.remove(user.getUser());
			userFollow.setFollowers(listFollowers);
			userFollow.setFriends(listFriends2);
			userRepository.save(userFollow);
		}

		return ResponseEntity.status(HttpStatus.OK).build();

	}

	/**
	 * Update the title of a review.
	 * Expects JSON with idReview and newTitle.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "idReview": "reviewId123",
	 *   "newTitle": "Updated Title"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if updated, 404 if review not found
	 */
	@PutMapping("updateTitle")
	public ResponseEntity<Object> updateTitle(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String idReview = json.getString("idReview");
		String newTitle = json.getString("newTitle");

		// Buscar la reseña por ID
		Optional<Review> Oreview = reviewRepository.findById(idReview);
		if (!Oreview.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Actualizar el título
		Review review = Oreview.get();
		review.setTitle(newTitle);
		reviewRepository.save(review);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	/**
	 * Update the text of a comment.
	 * Expects JSON with idComment and newText.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "idComment": "commentId123",
	 *   "newText": "Updated comment text."
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if updated, 404 if comment not found
	 */
	@PutMapping("updateComment")
	public ResponseEntity<Object> updateComment(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String idComment = json.getString("idComment");
		String newText = json.getString("newText");

		// Buscar el comentario por ID
		Optional<Comments> Ocomment = commentsRepository.findById(idComment);
		if (!Ocomment.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Actualizar el texto del comentario
		Comments comment = Ocomment.get();
		comment.setText(newText);
		commentsRepository.save(comment);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	/**
	 * Update basic user profile fields (username, name, description).
	 * The email field is required to locate the user. Returns 406 if new username already exists.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "newUsername": "newuser",
	 *   "newName": "New Name",
	 *   "newDescription": "New description."
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if updated, 404/406 if error
	 */
	@PutMapping("updateUser")
	public ResponseEntity<Object> updateUser(@RequestBody String body) throws IOException {
		JSONObject json = new JSONObject(body);

		// Requerido para localizar al usuario
		String email = json.getString("email");

		User user = userRepository.findByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Opcionales
		boolean changed = false;

		if (json.has("newUsername") && !json.isNull("newUsername")) {
			String newUsername = json.getString("newUsername").trim();

			// Evitar username vacío
			if (newUsername.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
			}

			// Si es distinto al actual, comprobar que no exista
			if (!newUsername.equals(user.getUser())) {
				User existing = userRepository.findByUser(newUsername);
				if (existing != null) {
					return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
				}
				user.setUser(newUsername);
				changed = true;
			}
		}

		if (json.has("newName") && !json.isNull("newName")) {
			String newName = json.getString("newName");
			user.setName(newName);
			changed = true;
		}

		if (json.has("newDescription") && !json.isNull("newDescription")) {
			String newDescription = json.getString("newDescription");
			user.setDescription(newDescription);
			changed = true;
		}

		// Si no vino ningún campo a actualizar
		if (!changed) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}

		userRepository.save(user);
		return ResponseEntity.status(HttpStatus.OK).build();
	}
	
	/**
	 * Add a comment to a review and recalculate the review's average rating.
	 * Expects reviewId, user, text, and valoration in the JSON body.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "reviewId": "reviewId123",
	 *   "user": "username",
	 *   "text": "Great review!",
	 *   "valoration": 4.0
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if comment added, 404 if review not found
	 */
	@PostMapping("commentReview")
	public ResponseEntity<Object> commentReview(@RequestBody String body) throws IOException {

	    JSONObject json = new JSONObject(body);
	    String reviewId = json.getString("reviewId");
	    String user = json.getString("user");
	    String text = json.getString("text");
	    Double valoration = json.getDouble("valoration");
	    Date date = new Date();

	    Optional<Review> Oreview = reviewRepository.findById(reviewId);

	    if (Oreview.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reseña no encontrada.");
	    }

	    Comments comment = new Comments(reviewId, user, text, date, valoration);
	    commentsRepository.save(comment);

	    Review review = Oreview.get();
	    
	    List<Comments> commentsList = commentsRepository.findByReviewId(reviewId);
	    
	    double totalValoration = review.getValorationInitial();
	    int totalCount = 1;

	    for (Comments c : commentsList) {
	        totalValoration += c.getValoration();
	        totalCount++;
	    }
	    
	    review.setValoration(totalValoration / totalCount);
	    reviewRepository.save(review);

	    return ResponseEntity.status(HttpStatus.OK).build();
	}

	/**
	 * Update the user's profile photo. The request must contain email and a base64 file string.
	 * The image is decoded, uploaded to S3 and the public URL is stored on the user record.
	 * Returns the new imageUrl in the response JSON.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "file": "base64string..."
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK with new imageUrl, 400/404 if error
	 */
	@PutMapping("updatePhoto")
	public ResponseEntity<Object> updatePhoto(@RequestBody String body) throws IOException {

		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String base64Image = json.getString("file"); // base64
		if (base64Image == null || base64Image.isBlank()) {
			return ResponseEntity.badRequest().body("file vacío");
		}

		User user = userRepository.findByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Si te llega con prefijo: "data:image/jpeg;base64,...."
		if (base64Image.contains(",")) {
			base64Image = base64Image.split(",")[1];
		}

		byte[] imageBytes;
		try {
			imageBytes = Base64.getDecoder().decode(base64Image);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("base64 inválido");
		}

		// Subir a S3
		String relative = "users/" + user.getId() + "/" + UUID.randomUUID() + ".jpg";
		String key = s3PublicImageService.buildKey(relative);

		String publicUrl = s3PublicImageService.uploadAndGetPublicUrl(key, imageBytes, "image/jpeg");

		// Guardar URL en la BD (IMPORTANTE: tu campo user.image debe ser String)
		user.setImage(publicUrl);
		userRepository.save(user);

		// Devuelves la URL para que el front actualice al momento
		JSONObject response = new JSONObject();
		response.put("imageUrl", publicUrl);

		return ResponseEntity.status(HttpStatus.OK).body(response.toString());
	}

	/**
	 * Delete a review and all its associated comments.
	 * Expects idReview in the request body.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "idReview": "reviewId123"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 204 No Content if deleted, 400/404 if error
	 */
	@DeleteMapping("deleteReview")
	public ResponseEntity<Object> deleteReview(@RequestBody(required = false) String body) {
		if (body == null || body.isBlank()) {
			return ResponseEntity.badRequest().body("Body vacío");
		}

		JSONObject json = new JSONObject(body);
		if (!json.has("idReview")) {
			return ResponseEntity.badRequest().body("Falta idReview");
		}

		String idReview = json.getString("idReview");

		Optional<Review> Oreview = reviewRepository.findById(idReview);
		if (Oreview.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// 1) borrar comentarios asociados
		commentsRepository.deleteByReviewId(idReview);

		// 2) borrar la review
		reviewRepository.deleteById(idReview);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Delete a comment, then recalculate and update the parent review's average rating.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "idComment": "commentId123"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 204 No Content if deleted, 404 if comment not found
	 */
	@DeleteMapping("deleteComment")
	public ResponseEntity<Object> deleteComment(@RequestBody String body) throws IOException {

	    // 1. Extraer el ID del comentario del body
	    JSONObject json = new JSONObject(body);
	    String idComment = json.getString("idComment");

	    // 2. Buscar si el comentario existe
	    Optional<Comments> Ocomment = commentsRepository.findById(idComment);
	    if (Ocomment.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    Comments comment = Ocomment.get();
	    String reviewId = comment.getReviewId();

	    // 3. Borrar el comentario
	    commentsRepository.deleteById(idComment);

	    // 4. Buscar la review para recalcular su valoración
	    Optional<Review> Oreview = reviewRepository.findById(reviewId);
	    if (Oreview.isEmpty()) {
	        // Si no hay review (porque se borró antes), devolvemos éxito pero sin contenido
	        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	    }

	    Review review = Oreview.get();

	    // 5. Obtener los comentarios que quedan y calcular el nuevo promedio
	    List<Comments> remaining = commentsRepository.findByReviewId(reviewId);

	    double sum = review.getValorationInitial();
	    int count = 1 + remaining.size(); // Review inicial + comentarios restantes

	    for (Comments c : remaining) {
	        sum += c.getValoration();
	    }

	    // Actualizar y guardar
	    review.setValoration(sum / count);
	    reviewRepository.save(review);

	    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	/**
	 * Return user info for a given email.
	 * The response includes user fields, links to reviews and links to followers/followeds/friends.
	 * <br>
	 * Example request: <code>/userEmail?email=user@example.com</code>
	 * <br>
	 * Example response:
	 * <pre>
	 * {
	 *   "results": {
	 *     "id": "userId",
	 *     "user": "username",
	 *     "name": "John Doe",
	 *     "description": "desc",
	 *     "email": "user@example.com",
	 *     "photo": "url",
	 *     "theme": "light",
	 *     "language": "en",
	 *     "reviews": ["reviewLink1", "reviewLink2"],
	 *     "created": "2024-01-01 12:00:00",
	 *     "followeds": ["userLink1"],
	 *     "followers": ["userLink2"],
	 *     "friends": ["userLink3"]
	 *   }
	 * }
	 * </pre>
	 * @param em email address
	 * @return 200 OK with user info JSON, 404 if not found
	 */
	@GetMapping("/userEmail")
	public ResponseEntity<String> userEmail(@RequestParam(value = "email") String em) {
		try {
			// Obtener el usuario
			User user = userRepository.findByEmail(em);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
			}

			// Obtener las reseñas del usuario
			List<Review> listReviews = reviewRepository.findByUser(user.getUser());

			// Crear el objeto JSON principal
			JSONObject jsonP = new JSONObject();
			JSONObject jsonR = new JSONObject();
			JSONArray jsonA = new JSONArray();

			// Agregar datos del usuario al JSON
			jsonR.put("id", user.getId());
			jsonR.put("user", user.getUser());
			if (user.getName() == null) {
				jsonR.put("name", "");
			} else {
				jsonR.put("name", user.getName());
			}

			if (user.getDescription() == null) {
				jsonR.put("description", "");
			} else {
				jsonR.put("description", user.getDescription());
			}

			jsonR.put("email", user.getEmail());
			jsonR.put("photo", user.getImage());
			jsonR.put("theme", user.getTheme());
			jsonR.put("language", user.getLanguage());
			// Convertir reseñas en links (solo enlaces como strings)
			if (listReviews != null && !listReviews.isEmpty()) {
				for (Review review : listReviews) {
					String reviewLink = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
					jsonA.put(reviewLink); // Agregar solo el enlace como un string
				}
				jsonR.put("reviews", jsonA);
			} else {
				jsonR.put("reviews", new JSONArray());
			}

			// Formatear la fecha de creación
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String formattedDate = sdf.format(user.getDate());
			jsonR.put("created", formattedDate);

			// Crear arrays con los enlaces de followeds, followers y friends como strings
			JSONArray followedsArray = new JSONArray();
			if (user.getFolloweds() != null && !user.getFolloweds().isEmpty()) {
				for (String followedId : user.getFolloweds()) {
					String followedLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followedId;
					followedsArray.put(followedLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followeds", followedsArray);

			JSONArray followersArray = new JSONArray();
			if (user.getFollowers() != null && !user.getFollowers().isEmpty()) {
				for (String followerId : user.getFollowers()) {
					String followerLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followerId;
					followersArray.put(followerLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followers", followersArray);

			JSONArray friendsArray = new JSONArray();
			if (user.getFriends() != null && !user.getFriends().isEmpty()) {
				for (String friendId : user.getFriends()) {
					String friendLink = "http://44.213.235.160:8080/resenalo/user?userName=" + friendId;
					friendsArray.put(friendLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("friends", friendsArray);

			// Agregar el objeto JSON de este usuario
			jsonP.put("results", jsonR);

			// Retornar la respuesta con el JSON
			return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}

	/**
	 * Similar to /userEmail but intended for other use cases (keeps same structure).
	 * <br>
	 * Example request: <code>/userEmailOther?email=user@example.com</code>
	 * @param em email address
	 * @return 200 OK with user info JSON, 404 if not found
	 */
	@GetMapping("/userEmailOther")
	public ResponseEntity<String> userEmailOther(@RequestParam(value = "email") String em) {
		try {
			// Obtener el usuario
			User user = userRepository.findByEmail(em);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
			}

			// Obtener las reseñas del usuario
			List<Review> listReviews = reviewRepository.findByUser(user.getUser());

			// Crear el objeto JSON principal
			JSONObject jsonP = new JSONObject();
			JSONObject jsonR = new JSONObject();
			JSONArray jsonA = new JSONArray();

			// Agregar datos del usuario al JSON
			jsonR.put("id", user.getId());
			jsonR.put("user", user.getUser());
			if (user.getName() == null) {
				jsonR.put("name", "");
			} else {
				jsonR.put("name", user.getName());
			}

			if (user.getDescription() == null) {
				jsonR.put("description", "");
			} else {
				jsonR.put("description", user.getDescription());
			}
			jsonR.put("email", user.getEmail());
			jsonR.put("photo", user.getImage());
			jsonR.put("theme", user.getTheme());
			jsonR.put("language", user.getLanguage());
			
			// Convertir reseñas en links (solo enlaces como strings)
			if (listReviews != null && !listReviews.isEmpty()) {
				for (Review review : listReviews) {
					String reviewLink = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
					jsonA.put(reviewLink); // Agregar solo el enlace como un string
				}
				jsonR.put("reviews", jsonA);
			} else {
				jsonR.put("reviews", new JSONArray());
			}

			// Crear arrays con los enlaces de followeds, followers y friends como strings
			JSONArray followedsArray = new JSONArray();
			if (user.getFolloweds() != null && !user.getFolloweds().isEmpty()) {
				for (String followedId : user.getFolloweds()) {
					String followedLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followedId;
					followedsArray.put(followedLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followeds", followedsArray);

			JSONArray followersArray = new JSONArray();
			if (user.getFollowers() != null && !user.getFollowers().isEmpty()) {
				for (String followerId : user.getFollowers()) {
					String followerLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followerId;
					followersArray.put(followerLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followers", followersArray);

			JSONArray friendsArray = new JSONArray();
			if (user.getFriends() != null && !user.getFriends().isEmpty()) {
				for (String friendId : user.getFriends()) {
					String friendLink = "http://44.213.235.160:8080/resenalo/user?userName=" + friendId;
					friendsArray.put(friendLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("friends", friendsArray);

			// Agregar el objeto JSON de este usuario
			jsonP.put("results", jsonR);

			// Retornar la respuesta con el JSON
			return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}

	/**
	 * Return public user profile by username.
	 * Includes created date, reviews and social links.
	 * <br>
	 * Example request: <code>/user?userName=username</code>
	 * @param userName username
	 * @return 200 OK with user info JSON, 404 if not found
	 */
	@GetMapping("/user")
	public ResponseEntity<String> user(@RequestParam(value = "userName") String userName) {
		try {
			// Obtener el usuario
			User user = userRepository.findByUser(userName);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
			}

			// Obtener las reseñas del usuario
			List<Review> listReviews = reviewRepository.findByUser(user.getUser());

			// Crear el objeto JSON principal
			JSONObject jsonP = new JSONObject();
			JSONObject jsonR = new JSONObject();
			JSONArray jsonA = new JSONArray();

			// Agregar datos del usuario al JSON
			jsonR.put("id", user.getId());
			jsonR.put("user", user.getUser());
			if (user.getName() == null) {
				jsonR.put("name", "");
			} else {
				jsonR.put("name", user.getName());
			}

			if (user.getDescription() == null) {
				jsonR.put("description", "");
			} else {
				jsonR.put("description", user.getDescription());
			}
			jsonR.put("email", user.getEmail());
			jsonR.put("photo", user.getImage());
			jsonR.put("theme", user.getTheme());
			jsonR.put("language", user.getLanguage());
			
			// Convertir reseñas en links (solo enlaces como strings)
			if (listReviews != null && !listReviews.isEmpty()) {
				for (Review review : listReviews) {
					String reviewLink = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
					jsonA.put(reviewLink); // Agregar solo el enlace como un string
				}
				jsonR.put("reviews", jsonA);
			} else {
				jsonR.put("reviews", new JSONArray()); // Si no hay reseñas, agregar un array vacío
			}

			// Formatear la fecha de creación
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String formattedDate = sdf.format(user.getDate());
			jsonR.put("created", formattedDate);

			// Crear arrays con los enlaces de followeds, followers y friends como strings
			JSONArray followedsArray = new JSONArray();
			if (user.getFolloweds() != null && !user.getFolloweds().isEmpty()) {
				for (String followedId : user.getFolloweds()) {
					String followedLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followedId;
					followedsArray.put(followedLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followeds", followedsArray);

			JSONArray followersArray = new JSONArray();
			if (user.getFollowers() != null && !user.getFollowers().isEmpty()) {
				for (String followerId : user.getFollowers()) {
					String followerLink = "http://44.213.235.160:8080/resenalo/user?userName=" + followerId;
					followersArray.put(followerLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("followers", followersArray);

			JSONArray friendsArray = new JSONArray();
			if (user.getFriends() != null && !user.getFriends().isEmpty()) {
				for (String friendId : user.getFriends()) {
					String friendLink = "http://44.213.235.160:8080/resenalo/user?userName=" + friendId;
					friendsArray.put(friendLink); // Agregar solo el enlace como string
				}
			}
			jsonR.put("friends", friendsArray);

			// Agregar el objeto JSON de este usuario
			jsonP.put("results", jsonR);

			// Retornar la respuesta con el JSON
			return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}

	/**
	 * Return a full review by id including image URLs and metadata.
	 * <br>
	 * Example request: <code>/review?id=reviewId123</code>
	 * <br>
	 * Example response:
	 * <pre>
	 * {
	 *   "id": "reviewId123",
	 *   "title": "Great Place!",
	 *   "user": "username",
	 *   "valoration": 4.5,
	 *   "description": "Nice food and service.",
	 *   "latitud": 40.4168,
	 *   "longitud": -3.7038,
	 *   "type": "restaurant",
	 *   "mimeType": "image/jpeg",
	 *   "images": ["url1", "url2"]
	 * }
	 * </pre>
	 * @param id review id
	 * @return 200 OK with review JSON, 404 if not found
	 */
	@GetMapping("/review")
	public ResponseEntity<String> review(@RequestParam(value = "id") String id) {
		Optional<Review> Oreview = reviewRepository.findById(id);

		if (Oreview.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
		}

		Review review = Oreview.get();
		JSONObject jsonP = new JSONObject();

		jsonP.put("id", review.getId());
		jsonP.put("title", review.getTitle());
		jsonP.put("user", review.getUser());
		jsonP.put("valoration", Math.round(review.getValoration() * 10.0) / 10.0);
		jsonP.put("description", review.getDescription());
		jsonP.put("latitud", review.getLatitud());
		jsonP.put("longitud", review.getLongitud());
		jsonP.put("type", review.getType());

		JSONArray jsonA = new JSONArray();
		List<String> urls = review.getImageUrls();
		if (urls != null) {
			for (String u : urls) {
				if (u != null && !u.isBlank())
					jsonA.put(u);
			}
		}

		jsonP.put("mimeType", "image/jpeg");
		jsonP.put("images", jsonA);

		return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
	}

	/**
	 * Return a compact (preview) representation of a review for lists.
	 * <br>
	 * Example request: <code>/reviewP?id=reviewId123</code>
	 * <br>
	 * Example response:
	 * <pre>
	 * {
	 *   "title": "Great Place!",
	 *   "user": "username",
	 *   "valoration": 4.5,
	 *   "review": "reviewLink",
	 *   "mimeType": "image/jpeg",
	 *   "image": "url"
	 * }
	 * </pre>
	 * @param id review id
	 * @return 200 OK with review preview JSON, 404 if not found
	 */
	@GetMapping("/reviewP")
	public ResponseEntity<String> reviewP(@RequestParam(value = "id") String id) {
		Optional<Review> Oreview = reviewRepository.findById(id);

		if (Oreview.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
		}

		Review review = Oreview.get();
		JSONObject jsonP = new JSONObject();

		jsonP.put("title", review.getTitle());
		jsonP.put("user", review.getUser());
		jsonP.put("valoration", Math.round(review.getValoration() * 10.0) / 10.0);
		jsonP.put("review", "http://44.213.235.160:8080/resenalo/reviewP?id=" + review.getId());

		List<String> urls = review.getImageUrls();
		if (urls != null && !urls.isEmpty() && urls.get(0) != null && !urls.get(0).isBlank()) {
			jsonP.put("mimeType", "image/jpeg");
			jsonP.put("image", urls.get(0));
		} else {
			jsonP.put("mimeType", JSONObject.NULL);
			jsonP.put("image", JSONObject.NULL);
		}

		return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
	}

	/**
	 * Search reviews by place/title and return an array of review objects with images.
	 * <br>
	 * Example request: <code>/reviewPlace?title=Great+Place!</code>
	 * @param title review title
	 * @return 200 OK with array of reviews
	 */
	@GetMapping("/reviewPlace")
	public ResponseEntity<String> reviewPlace(@RequestParam(value = "title") String title) {

		List<Review> listReviews = reviewRepository.findByTitle(title);

		JSONObject jsonResponse = new JSONObject();
		JSONArray jsonReviewsArray = new JSONArray();

		for (Review review : listReviews) {
			JSONObject jsonReview = new JSONObject();

			jsonReview.put("id", review.getId());
			jsonReview.put("title", review.getTitle());
			jsonReview.put("user", review.getUser());
			jsonReview.put("valoration", Math.round(review.getValoration() * 10.0) / 10.0);
			jsonReview.put("description", review.getDescription());
			jsonReview.put("latitud", review.getLatitud());
			jsonReview.put("longitud", review.getLongitud());
			jsonReview.put("type", review.getType());

				JSONArray jsonImagesArray = new JSONArray();
			List<String> urls = review.getImageUrls();
			if (urls != null) {
				for (String u : urls) {
					if (u != null && !u.isBlank())
						jsonImagesArray.put(u);
				}
			}

			jsonReview.put("images", jsonImagesArray);
			jsonReview.put("mimeType", "image/jpeg");

			jsonReviewsArray.put(jsonReview);
		}

		jsonResponse.put("reviews", jsonReviewsArray);
		return ResponseEntity.status(HttpStatus.OK).body(jsonResponse.toString());
	}

	/**
	 * Paginate and return all users as an array of user links and pagination metadata.
	 * <br>
	 * Example request: <code>/users?page=0&size=5</code>
	 * @param page page number
	 * @param size page size
	 * @return 200 OK with users and pagination info
	 */
	@GetMapping("/users")
	public ResponseEntity<String> getAllUsers(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size) {
		try {
			// Crear el objeto Pageable para la paginación
			Pageable pageable = PageRequest.of(page, size);

			// Obtener los usuarios de la base de datos con la paginación
			Page<User> pageUsers = userRepository.findAll(pageable);

			// Crear el array JSON que contendrá los enlaces a los usuarios
			JSONArray jsonUsers = new JSONArray();

			// Recorrer todos los usuarios
			for (User user : pageUsers.getContent()) {
				// Crear el enlace para cada usuario
				String userLink = "http://44.213.235.160:8080/resenalo/userEmail?email=" + user.getEmail();
				jsonUsers.put(userLink); // Agregar solo el enlace al array
			}

			// Crear el objeto JSON con la información de paginación: total de páginas,
			// página actual, etc.
			JSONObject jsonResponse = new JSONObject();
			jsonResponse.put("users", jsonUsers);
			jsonResponse.put("totalPages", pageUsers.getTotalPages());
			jsonResponse.put("currentPage", pageUsers.getNumber());
			jsonResponse.put("totalElements", pageUsers.getTotalElements());

			// Retornar la respuesta con los enlaces de los usuarios y la paginación
			return ResponseEntity.status(HttpStatus.OK).body(jsonResponse.toString());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}

	/**
	 * Paginate and return reviews as preview links with pagination metadata.
	 * <br>
	 * Example request: <code>/reviews?page=0&size=10</code>
	 * @param page page number
	 * @param size page size
	 * @return 200 OK with reviews and pagination info
	 */
	@GetMapping("/reviews")
	public ResponseEntity<String> reviews(@RequestParam(defaultValue = "0") int page, // Página actual, predeterminado
																						// es 0 (la primera página)
			@RequestParam(defaultValue = "10") int size // Número de elementos por página, predeterminado es 10
	) {
		// Crear el objeto Pageable para la paginación
		Pageable pageable = PageRequest.of(page, size);

		// Obtener las reseñas de la base de datos con la paginación
		Page<Review> pageReviews = reviewRepository.findAll(pageable);

		// Crear el array JSON que contendrá los enlaces a las reseñas
		JSONArray jsonReviews = new JSONArray();

		// Recorrer todas las reseñas de la página actual y agregar el enlace
		for (Review review : pageReviews.getContent()) {
			String reviewLink = "http://44.213.235.160:8080/resenalo/reviewP?id=" + review.getId();
			jsonReviews.put(reviewLink);
		}

		// Crear el objeto JSON con la paginación: número total de páginas, página
		// actual, etc.
		JSONObject jsonResponse = new JSONObject();
		jsonResponse.put("reviews", jsonReviews);
		jsonResponse.put("totalPages", pageReviews.getTotalPages());
		jsonResponse.put("currentPage", pageReviews.getNumber());
		jsonResponse.put("totalElements", pageReviews.getTotalElements());

		// Devolver la respuesta con la paginación y los enlaces
		return ResponseEntity.status(HttpStatus.OK).body(jsonResponse.toString());
	}

	/**
	 * Paginate and return comments with metadata. Each comment includes a link to its review.
	 * <br>
	 * Example request: <code>/comments?page=0&size=10</code>
	 * @param page page number
	 * @param size page size
	 * @return 200 OK with comments and pagination info
	 */
	@GetMapping("comments")
	public ResponseEntity<String> comments(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		// Crear el objeto Pageable para la paginación
		Pageable pageable = PageRequest.of(page, size);

		// Obtener todos los comentarios con paginación
		Page<Comments> pageComments = commentsRepository.findAll(pageable);

		// Crear el array JSON que contendrá todas las reseñas
		JSONArray jsonComments = new JSONArray();

		for (Comments comment : pageComments.getContent()) {
			// Crear un objeto JSON para cada comentario
			JSONObject commentJson = new JSONObject();
			commentJson.put("id", comment.getId());
			commentJson.put("text", comment.getText());
			commentJson.put("date_publication", comment.getDate());
			commentJson.put("user", comment.getUser());
			commentJson.put("valoration", Math.round(comment.getValoration() * 100.0) / 100.0);

			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(reviewId);

			// Verificar si la reseña existe
			if (Oreview.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}

		// Crear un objeto JSON para los metadatos de la paginación
		JSONObject paginationMeta = new JSONObject();
		paginationMeta.put("current_page", pageComments.getNumber());
		paginationMeta.put("total_pages", pageComments.getTotalPages());
		paginationMeta.put("total_comments", pageComments.getTotalElements());

		// Crear el JSON final con los comentarios y los metadatos de paginación
		JSONObject responseJson = new JSONObject();
		responseJson.put("comments", jsonComments);
		responseJson.put("pagination", paginationMeta);

		return ResponseEntity.status(HttpStatus.OK).body(responseJson.toString());
	}

	/**
	 * Return all comments for a specific review id.
	 * <br>
	 * Example request: <code>/comment?idReview=reviewId123</code>
	 * @param idReview review id
	 * @return 200 OK with array of comments, 404 if review not found
	 */
	@GetMapping("/comment")
	public ResponseEntity<String> comment(@RequestParam(value = "idReview") String idReview) {
		List<Comments> listComments = commentsRepository.findByReviewId(idReview);
		JSONArray jsonComments = new JSONArray();
		for (Comments comment : listComments) {
			JSONObject commentJson = new JSONObject();
			commentJson.put("id", comment.getId());
			commentJson.put("text", comment.getText());
			commentJson.put("date_publication", comment.getDate());
			commentJson.put("user", comment.getUser());
			commentJson.put("valoration", Math.round(comment.getValoration() * 100.0) / 100.0);
			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(idReview);

			// Verificar si la reseña existe
			if (Oreview.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}
		return ResponseEntity.status(HttpStatus.OK).body(jsonComments.toString());
	}

	/**
	 * Return a small list of random review preview links (max 4) shuffled randomly.
	 * <br>
	 * Example request: <code>/randomReviews</code>
	 * @return 200 OK with up to 4 random review preview links
	 */
	@GetMapping("/randomReviews")
	public ResponseEntity<List<String>> randomReviews() {
		// Obtener todas las reseñas de la base de datos
		List<Review> allReviews = reviewRepository.findAll();
		List<String> urlReviews = new ArrayList<String>();
		for (Review review : allReviews) {
			urlReviews.add("http://44.213.235.160:8080/resenalo/reviewP?id=" + review.getId());
		}
		// Barajar las reseñas de manera aleatoria
		Collections.shuffle(urlReviews);

		// Tomar solo los primeros 4 resultados
		List<String> randomReviews = urlReviews.stream().limit(4).collect(Collectors.toList());

		// Devolver los resultados
		return ResponseEntity.status(HttpStatus.OK).body(randomReviews);
	}

	/**
	 * Return a small list of random user profile links (max 10) shuffled randomly.
	 * <br>
	 * Example request: <code>/randomUsers</code>
	 * @return 200 OK with up to 10 random user profile links
	 */
	@GetMapping("/randomUsers")
	public ResponseEntity<List<String>> randomUsers() {

		List<User> allUsers = userRepository.findAll();
		List<String> urlUsers = new ArrayList<String>();
		for (User user : allUsers) {
			urlUsers.add("http://44.213.235.160:8080/resenalo/user?userName=" + user.getUser());
		}
		Collections.shuffle(urlUsers);
		List<String> randomUsers = urlUsers.stream().limit(10).collect(Collectors.toList());
		return ResponseEntity.status(HttpStatus.OK).body(randomUsers);
	}

	/**
	 * Return top 10 reviews by valoration as preview links.
	 * <br>
	 * Example request: <code>/top10Reviews</code>
	 * @return 200 OK with top 10 review preview links
	 */
	@GetMapping("/top10Reviews")
	public ResponseEntity<List<String>> top10Reviews() {

		List<Review> top10Reviews = reviewRepository.findTop10ByOrderByValorationDesc();

		List<String> top10Links = top10Reviews.stream()
				.map(r -> "http://44.213.235.160:8080/resenalo/reviewP?id=" + r.getId()).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(top10Links);
	}

	/**
	 * Return top 3 reviews by valoration as preview links.
	 * <br>
	 * Example request: <code>/top3Reviews</code>
	 * @return 200 OK with top 3 review preview links
	 */
	@GetMapping("/top3Reviews")
	public ResponseEntity<List<String>> top3Reviews() {
		List<Review> top3Reviews = reviewRepository.findTop3ByOrderByValorationDesc();

		List<String> top3Links = top3Reviews.stream()
				.map(r -> "http://44.213.235.160:8080/resenalo/reviewP?id=" + r.getId()).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(top3Links);
	}

	/**
	 * Search users by partial username (case-insensitive) and return an array of user objects.
	 * <br>
	 * Example request: <code>/searchUsers?user=alice</code>
	 * @param userQuery partial username
	 * @return 200 OK with array of user objects
	 */
	@GetMapping("/searchUsers")
	public ResponseEntity<String> searchUsers(@RequestParam(value = "user") String userQuery) {
		try {
			if (userQuery == null || userQuery.trim().isEmpty()) {
				JSONObject empty = new JSONObject();
				empty.put("results", new JSONArray());
				return ResponseEntity.status(HttpStatus.OK).body(empty.toString());
			}

			List<User> users = userRepository.findByUserContainingIgnoreCase(userQuery);

			JSONArray resultsArray = new JSONArray();

			for (User user : users) {

				// reviews del usuario
				List<Review> listReviews = reviewRepository.findByUser(user.getUser());

				JSONObject jsonR = new JSONObject();
				JSONArray jsonA = new JSONArray();

				jsonR.put("id", user.getId());
				jsonR.put("user", user.getUser());
				jsonR.put("name", user.getName() == null ? "" : user.getName());
				jsonR.put("description", user.getDescription() == null ? "" : user.getDescription());
				jsonR.put("email", user.getEmail());
				jsonR.put("photo", user.getImage());

				// reviews links
				if (listReviews != null && !listReviews.isEmpty()) {
					for (Review review : listReviews) {
						String reviewLink = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
						jsonA.put(reviewLink);
					}
				}
				jsonR.put("reviews", jsonA);
				jsonR.put("theme", user.getTheme());
				jsonR.put("language", user.getLanguage());
				// followeds links
				JSONArray followedsArray = new JSONArray();
				if (user.getFolloweds() != null) {
					for (String followedUser : user.getFolloweds()) {
						followedsArray.put("http://44.213.235.160:8080/resenalo/user?userName=" + followedUser);
					}
				}
				jsonR.put("followeds", followedsArray);

				// followers links
				JSONArray followersArray = new JSONArray();
				if (user.getFollowers() != null) {
					for (String followerUser : user.getFollowers()) {
						followersArray.put("http://44.213.235.160:8080/resenalo/user?userName=" + followerUser);
					}
				}
				jsonR.put("followers", followersArray);

				// friends links
				JSONArray friendsArray = new JSONArray();
				if (user.getFriends() != null) {
					for (String friendUser : user.getFriends()) {
						friendsArray.put("http://44.213.235.160:8080/resenalo/user?userName=" + friendUser);
					}
				}
				jsonR.put("friends", friendsArray);

				// añadir este usuario al array de resultados
				resultsArray.put(jsonR);
			}

			JSONObject jsonP = new JSONObject();
			jsonP.put("results", resultsArray);

			return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}
	
	/**
	 * Update the user's theme preference (light|dark).
	 * Expects JSON with email and theme. Validates theme value.
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "theme": "dark"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if updated, 400/404 if error
	 */
	@PostMapping("/updateTheme")
	public ResponseEntity<Object> updateTheme(@RequestBody String body) throws IOException {

	    JSONObject json = new JSONObject(body);

	    String email = json.getString("email");
	    String theme = json.getString("theme"); // "light" o "dark"

	    if (!theme.equals("light") && !theme.equals("dark")) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("El theme debe ser 'light' o 'dark'");
	    }

	    User user = userRepository.findByEmail(email);
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    user.setTheme(theme);
	    userRepository.save(user);

	    return ResponseEntity.status(HttpStatus.OK).body("Tema actualizado");
	}
	
	/**
	 * Update the user's language preference.
	 * Expects JSON with email and language code (e.g. "en", "es").
	 * <br>
	 * Example:
	 * <pre>
	 * {
	 *   "email": "user@example.com",
	 *   "language": "es"
	 * }
	 * </pre>
	 * @param body JSON request body
	 * @return 200 OK if updated, 404 if user not found
	 */
	@PostMapping("/updateLanguage")
	public ResponseEntity<Object> updateLanguage(@RequestBody String body) throws IOException {

	    JSONObject json = new JSONObject(body);

	    String email = json.getString("email");
	    String language = json.getString("language"); // "es", "en", etc.

	    User user = userRepository.findByEmail(email);
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }

	    user.setLanguage(language);
	    userRepository.save(user);

	    return ResponseEntity.status(HttpStatus.OK).body("Idioma actualizado");
	}
}