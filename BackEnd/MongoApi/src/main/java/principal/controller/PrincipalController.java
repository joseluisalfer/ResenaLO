package principal.controller;

import java.io.IOException;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

import principal.model.User;
import principal.repository.UserRepository;

import static com.mongodb.client.model.Filters.*;

@RestController
@RequestMapping("first")
public class PrincipalController {

	// Genera el hash (esto es lo que guardas en la BD)
	public static String hashPassword(String plainPassword) {
		// 10-12 suele ser un buen coste; 12 es común si el servidor lo aguanta
		int cost = 12;
		return BCrypt.hashpw(plainPassword, BCrypt.gensalt(cost));
	}

	private final UserRepository userRepository;

	public PrincipalController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
	MongoDatabase database = mongoClient.getDatabase("ResenaLo");
	MongoCollection<Document> accounts = database.getCollection("acounts");

	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestBody User user) {

		// Email ya registrado
		if (userRepository.existsByEmail(user.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT) // 409
					.body("Este correo ya está registrado");
		}

		// Username ya usado (opcional pero recomendable)
		if (userRepository.existsByUser(user.getUser())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Este nombre de usuario ya existe");
		}

		// Valores por defecto
		user.setLogged(false);

		// aquí deberías hashear el password (luego)
		String pass = hashPassword(user.getPassword());
		user.setPassword(pass);
		userRepository.save(user);

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

}
