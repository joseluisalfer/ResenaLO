package principal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import principal.model.User;

public interface UserRepository extends MongoRepository<User, String> {
	// con esto ya tienes findAll(), save(), deleteById(), etc.

	// extra útil:
	User findByUser(String user);
	User findByEmailAndPassword(String email, String password);
	User findByEmail(String email);
	boolean existsByUser(String user);
	boolean existsByEmail(String email);
	boolean existsByUserAndPassword(String user, String password);
	
}
