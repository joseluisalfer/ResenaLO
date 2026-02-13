package principal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.catalina.valves.JsonAccessLogValve;
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
import org.springframework.web.multipart.MultipartFile;

import principal.model.Comments;
import principal.model.Review;
import principal.model.User;
import principal.repository.CommentsRepository;
import principal.repository.ReviewRepository;
import principal.repository.UserRepository;

@RestController
@RequestMapping("first")
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

//		int token = ThreadLocalRandom.current().nextInt(100000, 999999);
//		String message = ("Este es tu codigo de verificacion: "+token);
//		envioMail(message,"Verificacion de correo","resenalo.company@gmail.com","All_Roads_Lead_To_Indra_67", "smtp.gmail.com", "587", emails,anexos);
		// Crear el objeto de usuario
		User newUser = new User();
		newUser.setUser(user);
		newUser.setEmail(email);
		newUser.setPassword(pass);
		newUser.setVerified(false);
		newUser.setDate(new Date());
		newUser.setName(name);
		// newUser.setToken(token);

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

			// Comprobar si el usuario ya está logeado
			if (dbUser.isVerified()) {
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
		String ubication = json.getString("ubication");
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
			Review resena = new Review(title, imageBytesList, user, valoration, description, ubication, type, latitud,
					longitud);

			// Guardar la reseña en la base de datos
			reviewRepository.save(resena);
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

	@PostMapping("/commentReview")
	public ResponseEntity<Object> commentReview(@RequestBody Comments comment) throws IOException {

		// Verificar si la reseña con el id proporcionado existe
		Review resena = reviewRepository.findById(comment.getResenaId()).orElse(null);

		if (resena == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reseña no encontrada.");
		}

		commentsRepository.save(comment);
		return ResponseEntity.status(HttpStatus.OK).body("Comentario creado de manera exitosa");
	}

	@PutMapping("updatePhoto")
	public ResponseEntity<Object> updatePhoto(@RequestBody String body) throws IOException {
		// Parsear el cuerpo del JSON usando JSONObject
		JSONObject json = new JSONObject(body);

		String email = json.getString("email");
		String newImage = json.getString("newImage");

		User user = userRepository.findByEmail(email);

		if (user != null) {
			byte[] imageBytes = Files.readAllBytes(Paths.get(newImage));
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

	@GetMapping("/user")
	public ResponseEntity<String> user(@RequestParam(value = "user") String us) {
		// Obtener el usuario y las reseñas
		User user = userRepository.findByUser(us);
		List<Review> listReviews = reviewRepository.findByUser(user.getUser());

		// Crear el objeto JSON principal
		JSONObject jsonP = new JSONObject();
		JSONObject jsonR = new JSONObject();
		JSONArray jsonA = new JSONArray();

		// Agregar datos del usuario al JSON
		jsonR.put("id", user.getId());
		jsonR.put("user", user.getUser());

		// Convertir la imagen del usuario a Base64 si existe
		if (user.getImage() != null) {
			String encodedImage = Base64.getEncoder().encodeToString(user.getImage());
			jsonR.put("photo", encodedImage); // Agregar la imagen convertida a Base64
		} else {
			jsonR.put("photo", "null"); // Si no hay foto, poner null
		}

		// Convertir solo los links de las reseñas a JSON
		for (Review review : listReviews) {
			JSONObject reviewJson = new JSONObject();

			// Generar el link de la reseña (Asegúrate de que la URL esté correcta y
			// completa)
			String reviewLink = "http://44.213.235.160:8080/first/review?id=" + review.getId(); // Cambia a la URL de tu
																								// API
			reviewJson.put("link", reviewLink); // Agregar el link de la reseña

			// Agregar la reseña (solo el link) a la lista de reseñas
			jsonA.put(reviewJson);
		}

		// Si no hay reseñas, agregar un array vacío
		if (jsonA.isEmpty()) {
			jsonR.put("reviews", new JSONArray()); // Poner array vacío si no hay reseñas
		} else {
			jsonR.put("reviews", jsonA);
		}

		// Agregar la fecha de creación del usuario
		if (user.getDate() != null) {
			String formattedDate = user.getDate().toString(); // O usar un formateador si lo prefieres
			jsonR.put("created", formattedDate);
		}

		// Poner los datos del usuario en el objeto principal
		jsonP.put("results", jsonR);

		// Retornar la respuesta
		return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
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

	@GetMapping("/reviewPlace")
	public ResponseEntity<String> reviewPlace(@RequestParam(value = "ubication") String ubication) {
		// Obtener las reseñas por ubicación
		List<Review> listReviews = reviewRepository.findByUbication(ubication);

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
	public ResponseEntity<String> getAllUsers() {
		// Obtener todos los usuarios de la base de datos
		List<User> users = userRepository.findAll();

		// Crear el objeto JSON principal para la respuesta
		JSONObject jsonP = new JSONObject();
		JSONArray jsonUsers = new JSONArray();

		// Recorrer todos los usuarios
		for (User user : users) {
			// Obtener las reseñas del usuario
			List<Review> listReviews = reviewRepository.findByUser(user.getUser());

			// Crear un objeto JSON para cada usuario
			JSONObject jsonR = new JSONObject();
			JSONArray jsonA = new JSONArray();

			// Agregar datos del usuario al JSON
			jsonR.put("id", user.getId());
			jsonR.put("user", user.getUser());

			// Convertir la imagen del usuario a Base64 si existe
			if (user.getImage() != null) {
				String encodedImage = Base64.getEncoder().encodeToString(user.getImage());
				jsonR.put("photo", encodedImage);
			} else {
				jsonR.put("photo", "null");
			}

			// Convertir los enlaces de las reseñas a JSON
			for (Review review : listReviews) {
				JSONObject reviewJson = new JSONObject();

				// Generar el link de la reseña
				String reviewLink = "http://44.213.235.160:8080/review?id=" + review.getId(); // Cambiar la URL de tu
																								// API si
																								// es necesario
				reviewJson.put("link", reviewLink); // Agregar el link de la reseña

				// Agregar la reseña (solo el link) a la lista de reseñas
				jsonA.put(reviewJson);
			}

			// Si no hay reseñas, agregar un array vacío
			if (jsonA.isEmpty()) {
				jsonR.put("reviews", new JSONArray()); // Poner array vacío si no hay reseñas
			} else {
				jsonR.put("reviews", jsonA); // Poner la lista de reseñas
			}

			// Agregar la fecha de creación del usuario (formateada)
			if (user.getDate() != null) {
				String formattedDate = user.getDate().toString(); // O usar un formateador si prefieres otro formato
				jsonR.put("created", formattedDate);
			}

			// Agregar el objeto del usuario al array de usuarios
			jsonUsers.put(jsonR);
		}

		// Poner los datos en el objeto principal
		jsonP.put("results", jsonUsers);

		// Retornar la respuesta como un string JSON
		return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
	}

	@GetMapping("/reviews")
	public ResponseEntity<String> reviews() {
		// Obtener todas las reseñas
		List<Review> listReviews = reviewRepository.findAll();

		// Crear el array JSON que contendrá todas las reseñas
		JSONArray jsonReviews = new JSONArray();

		// Recorrer todas las reseñas y agregar el enlace al usuario y las imágenes en
		// Base64
		for (Review review : listReviews) {
			// Crear un objeto JSON para cada reseña
			JSONObject reviewJson = new JSONObject();
			reviewJson.put("id", review.getId());
			reviewJson.put("title", review.getTitle());
			reviewJson.put("description", review.getDescription());
			reviewJson.put("valoration", review.getValoration());
			reviewJson.put("latitud", review.getLatitud());
			reviewJson.put("longitud", review.getLongitud());
			reviewJson.put("type", review.getType());
			// Obtener el usuario asociado a la reseña usando el userId de la reseña
			String userId = review.getUser();
			User user = userRepository.findByUser(userId); // Asegúrate de que `getUser()` retorne el identificador
															// adecuado

			// Generar el enlace al usuario
			String userLink = (user != null) ? "http://localhost:8080/user?id=" + user.getId() : null;

			// Agregar el enlace del usuario a la reseña
			reviewJson.put("userLink", userLink);

			// Convertir las imágenes de la reseña a Base64
			if (review.getImages() != null && !review.getImages().isEmpty()) {
				JSONArray imagesArray = new JSONArray();
				for (byte[] image : review.getImages()) {
					// Convertir cada imagen a Base64
					String encodedImage = Base64.getEncoder().encodeToString(image);
					imagesArray.put(encodedImage); // Agregar cada imagen codificada en Base64
				}
				reviewJson.put("images", imagesArray); // Agregar el array de imágenes a la reseña
			} else {
				reviewJson.put("images", new JSONArray()); // Si no hay imágenes, agregar un array vacío
			}

			// Agregar la reseña con el enlace al usuario y las imágenes al array de reseñas
			jsonReviews.put(reviewJson);
		}

		// Devolver la respuesta como un string JSON
		return ResponseEntity.status(HttpStatus.OK).body(jsonReviews.toString());
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
			String userLink = (user != null) ? "http://localhost:8080/user?id=" + user.getId() : null;

			// Agregar el enlace del usuario a la reseña
			commentJson.put("user", userLink);

			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(reviewId);

			// Verificar si la reseña existe
			if (!Oreview.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://localhost:8080/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}

		return ResponseEntity.status(HttpStatus.OK).body(jsonComments.toString());
	}

	@GetMapping("/comment")
	public ResponseEntity<String> comment(@RequestParam(value = "idReview") String idReview) {
		List<Comments> listComments = commentsRepository.findByResenaId(idReview);
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
			String userLink = (user != null) ? "http://localhost:8080/user?id=" + user.getId() : null;

			// Agregar el enlace del usuario a la reseña
			commentJson.put("user", userLink);
			String reviewId = comment.getId();
			Optional<Review> Oreview = reviewRepository.findById(reviewId);

			// Verificar si la reseña existe
			if (!Oreview.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Review not found\"}");
			}

			Review review = Oreview.get();
			String linkReview = "http://localhost:8080/review?id=" + review.getId();
			commentJson.put("review", linkReview);
			jsonComments.put(commentJson);
		}
		return ResponseEntity.status(HttpStatus.OK).body(jsonComments.toString());
	}

}
