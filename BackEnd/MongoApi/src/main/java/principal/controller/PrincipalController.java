package principal.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.json.JSONArray;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

import principal.model.Comments;
import principal.model.Review;
import principal.model.User;
import principal.repository.CommentsRepository;
import principal.repository.ReviewRepository;
import principal.repository.UserRepository;

import static com.mongodb.client.model.Filters.*;

@RestController
@RequestMapping("first")
public class PrincipalController {

	// Genera la contraseña encriptada
	public static String hashPassword(String plainPassword) {
		// 10-12 suele ser un buen coste; 12 es común si el servidor lo aguanta
		int cost = 12;
		return BCrypt.hashpw(plainPassword, BCrypt.gensalt(cost));
	}

	private final UserRepository userRepository;
	private final CommentsRepository commentsRepository;
	private final ReviewRepository reviewRepository;

	public PrincipalController(UserRepository userRepository, CommentsRepository commentsRepository,
			ReviewRepository reviewRepository) {
		this.userRepository = userRepository;
		this.commentsRepository = commentsRepository;
		this.reviewRepository = reviewRepository;
	}

	MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
	MongoDatabase database = mongoClient.getDatabase("ResenaLo");
	MongoCollection<Document> accounts = database.getCollection("acounts");

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
	        jsonR.put("photo", encodedImage);  // Agregar la imagen convertida a Base64
	    } else {
	        jsonR.put("photo", "null"); // Si no hay foto, poner null
	    }

	    // Convertir las reseñas a JSON
	    for (Review review : listReviews) {
	        JSONObject reviewJson = new JSONObject();
	        JSONArray reviewImages = new JSONArray();

	        // Agregar los datos de la reseña
	        reviewJson.put("title", review.getTitle());
	        reviewJson.put("description", review.getDescription());
	        reviewJson.put("valoracion", review.getValoration());

	        // Verificar si la reseña tiene imágenes
	        if (!review.getImages().isEmpty()) {
	            // Convertir cada imagen a Base64 y agregarla al array de imágenes (hay que hacerlo en aws para que sea un link)
	            for (byte[] imageBytes : review.getImages()) {
	                String encodedReviewImage = Base64.getEncoder().encodeToString(imageBytes);
	                reviewImages.put(encodedReviewImage);  // Agregar la imagen al array
	            }
	        }

	        // Agregar las imágenes de la reseña al JSON
	        reviewJson.put("images", reviewImages);
	        // Agregar la reseña a la lista de reseñas
	        jsonA.put(reviewJson);
	    }

	    // Si no hay reseñas, agregar un array vacío
	    if (jsonA.isEmpty()) {
	        jsonR.put("reviews", new JSONArray());  // Poner array vacío si no hay reseñas
	    } else {
	        jsonR.put("reviews", jsonA);
	    }

	    // Agregar la fecha de creación del usuario
	    if (user.getDate() != null) {
	        String formattedDate = user.getDate().toString();  // O usar un formateador si lo prefieres
	        jsonR.put("created", formattedDate);
	    }

	    // Poner los datos del usuario en el objeto principal
	    jsonP.put("results", jsonR);

	    // Retornar la respuesta
	    return ResponseEntity.status(HttpStatus.OK).body(jsonP.toString());
	}
	
	
}
