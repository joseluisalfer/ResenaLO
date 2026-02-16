package principal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("resenalo")
public class PrincipalController {

	@Autowired
	private CommentsRepository commentsRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ReviewRepository reviewRepository;

	// Genera la contraseña encriptada
	public static String hashPassword(String plainPassword) {
		// 10-12 suele ser un buen coste; 12 es común si el servidor lo aguanta
		int cost = 12;
		return BCrypt.hashpw(plainPassword, BCrypt.gensalt(cost));
	}

	// Funcion del email
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

		String imagePath = "src/main/resources/foto_default.png";
		byte[] imageBytes = Files.readAllBytes(Paths.get(imagePath));
		newUser.setImage(imageBytes);

		// Guardar el usuario en la base de datos
		userRepository.save(newUser);

		return ResponseEntity.status(HttpStatus.CREATED) // 201
				.body("Cuenta creada con ÉXITO");
	}

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

			// A espera de arreglar el email
			// Comprobar si el usuario ya está verificado
//			if (!dbUser.isVerified()) {
//				return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"El usuario ya está logueado\"}");
//			}

			// Marcar al usuario como verificado
			// dbUser.setVerified(true);
			userRepository.save(dbUser);

			return ResponseEntity.status(HttpStatus.OK).build();

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("{\"error\": \"Error en el servidor: " + e.getMessage() + "\"}");
		}
	}

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

	@PostMapping("/uploadReview")
	public ResponseEntity<Object> uploadReview(@RequestBody String body) throws IOException {

		// Parsear el cuerpo del JSON usando JSONObject
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

		// Procesar la lista de imágenes (en base64)
		List<byte[]> imageBytesList = new ArrayList<>();

		JSONArray files = json.getJSONArray("files");
		if (json.has("files") && !json.isNull("files")) {
			for (int i = 0; i < files.length(); i++) {
				String base64Image = files.getString(i);
				byte[] imageBytes = Base64.getDecoder().decode(base64Image); // Convertir base64 a bytes
				imageBytesList.add(imageBytes);
			}

			// Crear la nueva reseña
			Review resena = new Review(title, imageBytesList, user, valoration, description, type, latitud, longitud);

			// Guardar la reseña en la base de datos
			reviewRepository.save(resena);
		}
		return ResponseEntity.status(HttpStatus.OK).build();

	}

	@PostMapping("addFollow")
	public ResponseEntity<Object> addFollow(@RequestBody String body) throws IOException {
		JSONObject json = new JSONObject(body);
		String us = json.getString("user");
		String usFollow = json.getString("userFollow");

		// Buscar usuario
		User user = userRepository.findByUser(us);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Buscar usuario a seguir
		User userFollow = userRepository.findByUser(usFollow);
		if (userFollow == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		// Agregar usuario a la lista de seguidos si no está ya presente
		List<String> listFollow = user.getFolloweds();
		if (!listFollow.contains(userFollow.getUser())) {
			listFollow.add(userFollow.getUser());
			user.setFolloweds(listFollow);
			userRepository.save(user);
		}

		// Agregar usuario a la lista de seguidores si no está ya presente
		List<String> listFollowers = userFollow.getFollowers();
		List<String> listNotifications = user.getNotifications();
		if (!listFollowers.contains(user.getUser())) {
			listFollowers.add(user.getUser());
			userFollow.setFollowers(listFollowers);
			listNotifications.add(user.getUser() + " te ha empezado a seguir");
			userRepository.save(userFollow);
		}

		// Verificar si ambos usuarios se siguen mutuamente

		if (listFollow.contains(userFollow.getUser()) && listFollowers.contains(user.getUser())) {
			// Añadir los usuarios a la lista de amigos si no están ya en ella
			List<String> userFriends = user.getFriends();
			if (!userFriends.contains(userFollow.getUser())) {
				userFriends.add(userFollow.getUser());
				user.setFriends(userFriends);
			}

			List<String> userFollowFriends = userFollow.getFriends();
			if (!userFollowFriends.contains(user.getUser())) {
				userFollowFriends.add(user.getUser());
				userFollow.setFriends(userFollowFriends);
			}
		}

		return ResponseEntity.status(HttpStatus.OK).build();
	}

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

	@PutMapping("updateUsername")
	public ResponseEntity<Object> updateUsername(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String newUsername = json.getString("newUsername");

		User user = userRepository.findByEmail(email);
		if (user != null) {
			User user2 = userRepository.findByUser(newUsername);
			if (user2 == null) {
				user.setUser(newUsername);
				userRepository.save(user);
				return ResponseEntity.status(HttpStatus.OK).build();
			} else {
				return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PutMapping("updateName")
	public ResponseEntity<Object> updateName(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String newName = json.getString("newName");

		User user = userRepository.findByEmail(email);
		if (user != null) {
			user.setName(newName);
			userRepository.save(user);
			return ResponseEntity.status(HttpStatus.OK).build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PutMapping("updateDescription")
	public ResponseEntity<Object> updateDescription(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String newDescription = json.getString("newDescription");

		User user = userRepository.findByEmail(email);
		if (user != null) {
			user.setDescription(newDescription);
			userRepository.save(user);
			return ResponseEntity.status(HttpStatus.OK).build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PostMapping("/commentReview")
	public ResponseEntity<Object> commentReview(@RequestBody String body) throws IOException {

		JSONObject json = new JSONObject(body);
		String reviewId = json.getString("reviewId");
		String user = json.getString("user");
		String text = json.getString("text");
		Date date = new Date();
		Double valoration = json.getDouble("valoration");

		// Verificar si la reseña con el id proporcionado existe
		Optional<Review> Oreview = reviewRepository.findById(reviewId);

		if (Oreview.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reseña no encontrada.");
		}

		// Crear el nuevo comentario
		Comments comment = new Comments(reviewId, user, text, date, valoration);

		// Guardar el comentario en la colección de comentarios
		commentsRepository.save(comment);

		// Obtener la reseña de la base de datos
		Review review = Oreview.get();

		// Sumar la valoración del comentario a la reseña
		List<Comments> commentsList = commentsRepository.findByReviewId(reviewId);
		double totalValoration = review.getValoration(); // Valoracion de la reseña
		int totalCount = 1;

		// Sumamos las valoraciones de todos los comentarios
		for (Comments c : commentsList) {
			totalValoration += c.getValoration();
			totalCount++;
		}

		double newValoration = totalValoration / totalCount;
		review.setValoration(newValoration);

		// Guardar la reseña con la nueva valoración
		reviewRepository.save(review);

		// Responder con éxito
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@PutMapping("updatePhoto")
	public ResponseEntity<Object> updatePhoto(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String newImagePath = json.getString("newImage"); // Aquí recibimos la ruta del archivo

		User user = userRepository.findByEmail(email);

		if (user != null) {
			// Convertir la ruta del archivo en un arreglo de bytes
			Path path = Paths.get(newImagePath);
			byte[] imageBytes = Files.readAllBytes(path); // Leer el archivo y convertirlo a bytes

			// Guardar la imagen en el usuario
			user.setImage(imageBytes);
			userRepository.save(user);

			return ResponseEntity.status(HttpStatus.OK).build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@DeleteMapping("deleteReview")
	public ResponseEntity<Object> deleteReview(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);
		String idReview = json.getString("idReview");

		// Verificar si la reseña existe
		Optional<Review> Oreview = reviewRepository.findById(idReview);
		if (!Oreview.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Devuelve 404 si no existe la reseña
		}

		// Eliminar la reseña
		Review review = Oreview.get();
		reviewRepository.delete(review);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Devuelve 204 si se elimina correctamente
	}

	@DeleteMapping("deleteComment")
	public ResponseEntity<Object> deleteComment(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);
		String idComment = json.getString("idComment");

		// Verificar si el comentario existe
		Optional<Comments> Ocomment = commentsRepository.findById(idComment);
		if (!Ocomment.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Devuelve 404 si no existe el comentario
		}

		// Eliminar el comentario
		Comments comment = Ocomment.get();
		commentsRepository.delete(comment);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Devuelve 204 si se elimina correctamente
	}

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

			// Añadir notificaciones al JSON
			JSONArray notificationsArray = new JSONArray();

			if (user.getNotifications() != null && !user.getNotifications().isEmpty()) {
				for (String notif : user.getNotifications()) {
					notificationsArray.put(notif); // cada notificación como string
				}
			}
			// Verificar si el usuario tiene imagen y agregarla a Base64
			if (user.getImage() != null) {
				String encodedImage = Base64.getEncoder().encodeToString(user.getImage());
				jsonR.put("photo", encodedImage); // Agregar la imagen convertida a Base64
			} else {
				jsonR.put("photo", "null"); // Si no hay imagen, poner null o una imagen predeterminada
			}

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

			// Verificar si el usuario tiene imagen y agregarla a Base64
			if (user.getImage() != null) {
				String encodedImage = Base64.getEncoder().encodeToString(user.getImage());
				jsonR.put("photo", encodedImage); // Agregar la imagen convertida a Base64
			} else {
				jsonR.put("photo", "null"); // Si no hay imagen, poner null o una imagen predeterminada
			}

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

			int numFolloweds = 0;

			if (user.getFolloweds() != null && !user.getFolloweds().isEmpty()) {
				numFolloweds = user.getFolloweds().size();
			}
			jsonR.put("followeds", numFolloweds);

			int numFollowers = 0;
			if (user.getFollowers() != null && !user.getFollowers().isEmpty()) {

				numFollowers = user.getFollowers().size();

			}
			jsonR.put("followers", numFollowers);

			int numFriends = 0;
			if (user.getFriends() != null && !user.getFriends().isEmpty()) {

				numFriends = user.getFriends().size();

			}
			jsonR.put("friends", numFriends);

			// Agregar el objeto JSON de este usuario
			jsonP.put("results", jsonR);

			// Retornar la respuesta con el JSON
			return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Hubo un error al procesar la solicitud: " + e.getMessage());
		}
	}

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
			jsonR.put("name", user.getName());
			jsonR.put("description", user.getDescription());

			// Verificar si el usuario tiene imagen y agregarla a Base64
			if (user.getImage() != null) {
				String encodedImage = Base64.getEncoder().encodeToString(user.getImage());
				jsonR.put("photo", encodedImage); // Agregar la imagen convertida a Base64
			} else {
				jsonR.put("photo", "null"); // Si no hay imagen, poner null o una imagen predeterminada
			}

			// Añadir notificaciones al JSON
			JSONArray notificationsArray = new JSONArray();

			if (user.getNotifications() != null && !user.getNotifications().isEmpty()) {
				for (String notif : user.getNotifications()) {
					notificationsArray.put(notif); // cada notificación como string
				}
			}

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

	@GetMapping("/review")
	public ResponseEntity<String> review(@RequestParam(value = "id") String id) {
		Optional<Review> Oreview = reviewRepository.findById(id);

		// Verificar si la reseña existe
		if (!Oreview.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
		}

		JSONObject jsonP = new JSONObject();
		JSONArray jsonA = new JSONArray();
		Review review = Oreview.get();

		// Agregar información básica de la reseña
		jsonP.put("id", review.getId());
		jsonP.put("title", review.getTitle());
		jsonP.put("user", review.getUser());
		jsonP.put("valoration", review.getValoration());
		jsonP.put("description", review.getDescription());
		jsonP.put("latitud", review.getLatitud());
		jsonP.put("longitud", review.getLongitud());
		jsonP.put("type", review.getType());
		// Verificar si hay imágenes
		List<byte[]> images = review.getImages();
		if (images != null && !images.isEmpty()) {
			// Convertir las imágenes a Base64
			for (byte[] image : images) {
				if (image != null) {
					String encodedImage = Base64.getEncoder().encodeToString(image);
					jsonA.put(encodedImage); // Agregar imagen codificada a la respuesta
				}
			}
		} else {
			// Si no hay imágenes, agregar un campo vacío o null
			jsonP.put("images", "No images available");
		}

		// Agregar los datos de las imágenes y el tipo MIME
		jsonP.put("mimeType", "image/jpeg");
		jsonP.put("images", jsonA);

		// Retornar la respuesta con la reseña en formato JSON
		return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
	}

	@GetMapping("/reviewP")
	public ResponseEntity<String> reviewP(@RequestParam(value = "id") String id) {
		Optional<Review> Oreview = reviewRepository.findById(id);

		// Verificar si la reseña existe
		if (Oreview.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
		}

		JSONObject jsonP = new JSONObject();
		Review review = Oreview.get();

		// Agregar información básica de la reseña
		jsonP.put("title", review.getTitle());
		jsonP.put("user", review.getUser());
		jsonP.put("valoration", review.getValoration());
		jsonP.put("review", "http://44.213.235.160:8080/resenalo/review?id=" + review.getId());

		// Solo la primera imagen
		List<byte[]> images = review.getImages();
		if (images != null && !images.isEmpty() && images.get(0) != null) {
			String firstImage = Base64.getEncoder().encodeToString(images.get(0));
			jsonP.put("mimeType", "image/jpeg");
			jsonP.put("image", firstImage); // <- solo una
		} else {
			jsonP.put("mimeType", JSONObject.NULL);
			jsonP.put("image", JSONObject.NULL);
		}

		return ResponseEntity.ok(jsonP.toString());
	}

	@GetMapping("/reviewPlace")
	public ResponseEntity<String> reviewPlace(@RequestParam(value = "title") String title) {
		// Obtener las reseñas por ubicación
		List<Review> listReviews = reviewRepository.findByTitle(title);

		// Crear el objeto JSON para la respuesta
		JSONObject jsonResponse = new JSONObject();
		JSONArray jsonReviewsArray = new JSONArray();

		// Iterar sobre las reseñas encontradas
		for (Review review : listReviews) {
			JSONObject jsonReview = new JSONObject();

			// Agregar información básica de la reseña
			jsonReview.put("id", review.getId());
			jsonReview.put("title", review.getTitle());
			jsonReview.put("user", review.getUser());
			jsonReview.put("valoration", review.getValoration());
			jsonReview.put("description", review.getDescription());
			jsonReview.put("latitud", review.getLatitud());
			jsonReview.put("longitud", review.getLongitud());
			jsonReview.put("type", review.getType());

			// Verificar si hay imágenes
			List<byte[]> images = review.getImages();
			if (images != null && !images.isEmpty()) {
				// Convertir las imágenes a Base64
				JSONArray jsonImagesArray = new JSONArray();
				for (byte[] image : images) {
					if (image != null) {
						String encodedImage = Base64.getEncoder().encodeToString(image);
						jsonImagesArray.put(encodedImage); // Agregar imagen codificada a la respuesta
					}
				}
				jsonReview.put("images", jsonImagesArray);
				jsonReview.put("mimeType", "image/jpeg");
			} else {
				// Si no hay imágenes, agregar un campo vacío o null
				jsonReview.put("images", "No images available");
			}

			// Agregar la reseña al arreglo de reseñas
			jsonReviewsArray.put(jsonReview);
		}

		// Agregar el arreglo de reseñas a la respuesta JSON
		jsonResponse.put("reviews", jsonReviewsArray);

		// Retornar la respuesta con las reseñas en formato JSON
		return ResponseEntity.status(HttpStatus.OK).body(jsonResponse.toString());
	}

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
			String reviewLink = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
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

	@GetMapping("comments")
	public ResponseEntity<String> comments() {

		// Obtener todos los comentarios
		List<Comments> listComments = commentsRepository.findAll();
		// Crear el array JSON que contendrá todas las reseñas
		JSONArray jsonComments = new JSONArray();

		for (Comments comment : listComments) {
			// Crear un objeto JSON para cada comentario
			JSONObject commentJson = new JSONObject();
			commentJson.put("id", comment.getId());
			commentJson.put("text", comment.getText());
			commentJson.put("date_publication", comment.getDate());

			// Obtener el usuario asociado a la reseña usando el userId de la reseña
			String userId = comment.getUser();
			User user = userRepository.findByUser(userId);

			// Generar el enlace al usuario
			String userLink = (user != null) ? "http://44.213.235.160:8080/resenalo/user?id=" + user.getId() : null;

			// Agregar el enlace del usuario a la reseña
			commentJson.put("user", userLink);

			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(reviewId);

			// Verificar si la reseña existe
			if (!Oreview.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}

		return ResponseEntity.status(HttpStatus.OK).body(jsonComments.toString());
	}

	@GetMapping("/comment")
	public ResponseEntity<String> comment(@RequestParam(value = "idReview") String idReview) {
		List<Comments> listComments = commentsRepository.findByReviewId(idReview);
		JSONArray jsonComments = new JSONArray();
		for (Comments comment : listComments) {
			JSONObject commentJson = new JSONObject();
			commentJson.put("id", comment.getId());
			commentJson.put("text", comment.getText());
			commentJson.put("date_publication", comment.getDate());

			// Obtener el usuario asociado a la reseña usando el userId de la reseña
			String userId = comment.getUser();
			User user = userRepository.findByUser(userId);

			// Generar el enlace al usuario
			String userLink = (user != null) ? "http://44.213.235.160:8080/resenalo/user?id=" + user.getId() : null;

			// Agregar el enlace del usuario a la reseña
			commentJson.put("user", userLink);
			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(reviewId);

			// Verificar si la reseña existe
			if (!Oreview.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://44.213.235.160:8080/resenalo/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}
		return ResponseEntity.status(HttpStatus.OK).body(jsonComments.toString());
	}

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

	// Devuelve el top 10 de reviews
	@GetMapping("/top10Reviews")
	public ResponseEntity<List<String>> top10Reviews() {

		List<Review> listReviews = reviewRepository.findAll();

		// Ordenar de mayor a menor por valoración
		listReviews.sort((r1, r2) -> Double.compare(r2.getValoration(), r1.getValoration()));

		// Límite hasta 10
		int limite = Math.min(10, listReviews.size());

		// Crear lista de links
		List<String> top10Links = new ArrayList<>();
		for (int i = 0; i < limite; i++) {
			Review r = listReviews.get(i);
			top10Links.add("http://44.213.235.160:8080/resenalo/reviewP?id=" + r.getId());
		}

		return ResponseEntity.ok(top10Links);
	}

}
