package principal.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestParam("user") String user, @RequestParam("password") String password,
			@RequestParam("email") String email, @RequestParam("image") MultipartFile image) throws IOException {

		// Email ya registrado
		if (userRepository.existsByEmail(email)) {
			return ResponseEntity.status(HttpStatus.CONFLICT) // 409
					.body("Este correo ya está registrado");
		}

		// Username ya usado
		if (userRepository.existsByUser(user)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Este nombre de usuario ya existe");
		}

		boolean logged = false;

		// Encriptar contraseña
		String pass = hashPassword(password);

		// Convertir la imagen a bytes
		byte[] imageBytes = image.getBytes();

		// Crear el objeto de usuario
		User newUser = new User();
		newUser.setUser(user);
		newUser.setEmail(email);
		newUser.setPassword(pass);
		newUser.setLogged(logged);
		newUser.setImage(imageBytes);
		newUser.setDate(new Date());
		// Guardar el usuario en la base de datos
		userRepository.save(newUser);

		return ResponseEntity.status(HttpStatus.CREATED) // 201
				.body("Cuenta creada con ÉXITO");
	}

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody User user) {

		// Buscar usuario solo por username
		User dbUser = userRepository.findByUser(user.getUser());

		if (dbUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Credenciales incorrectas o usuario no registrado");
		}

		// Comparar contraseña en claro vs hash guardado
		boolean ok = BCrypt.checkpw(user.getPassword(), // contraseña que llega del POST
				dbUser.getPassword() // hash guardado en la BD
		);

		if (!ok) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
		}

		// Comprobar si ya está logeado
		if (dbUser.isLogged()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario ya está logeado");
		}

		// Marcar como logeado
		dbUser.setLogged(true);

		userRepository.save(dbUser);

		return ResponseEntity.status(HttpStatus.OK).body("Bienvenido " + dbUser.getUser());
	}

	@PostMapping("/logout")
	public ResponseEntity<Object> logout(@RequestBody User user) {

		// Buscar usuario solo por username
		User dbUser = userRepository.findByUser(user.getUser());

		if (dbUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Credenciales incorrectas o usuario no registrado");
		}

		// Comparar contraseña en claro vs hash guardado
		boolean ok = BCrypt.checkpw(user.getPassword(), // contraseña que llega del POST
				dbUser.getPassword() // hash guardado en la BD
		);

		if (!ok) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
		}

		// Comprobar si ya está logeado
		if (!dbUser.isLogged()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario no está logeado");
		}

		// Marcar como logeado
		dbUser.setLogged(false);
		userRepository.save(dbUser);

		return ResponseEntity.status(HttpStatus.OK).body("Bienvenido " + dbUser.getUser());
	}

	@PostMapping("/uploadReview")
	public ResponseEntity<Object> uploadReview(@RequestParam("title") String title,
			@RequestParam("file") List<MultipartFile> files, @RequestParam("user") String user,
			@RequestParam("valoration") int valoration, @RequestParam("description") String description)
			throws IOException {

		// Convertimos el archivo recibido a un array de bytes (binario)
		List<byte[]> imageBytesList = new ArrayList<>();
		for (MultipartFile image : files) {
			byte[] imageBytes = image.getBytes(); // Convertir cada imagen a bytes
			imageBytesList.add(imageBytes);
		}

		Review resena = new Review(title, imageBytesList, user, valoration, description);
		// Guardamos la resna en la base de datos (MongoDB)
		reviewRepository.save(resena);
		return ResponseEntity.status(HttpStatus.OK).body("Resena creada de manera exitosa");
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
			String reviewLink = "http://localhost:8080/first/review?id=" + review.getId(); // Cambia a la URL de tu API
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
				String reviewLink = "http://localhost:8080/review?id=" + review.getId(); // Cambiar la URL de tu API si
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
	public String reviews() {
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
		return jsonReviews.toString();
	}

}
