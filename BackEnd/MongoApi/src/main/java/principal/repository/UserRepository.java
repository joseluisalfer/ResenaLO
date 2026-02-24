package principal.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import principal.model.User;

public interface UserRepository extends MongoRepository<User, String> {
	User findByUser(String user);
	User findByEmailAndPassword(String email, String password);
	User findByEmail(String email);
	boolean existsByUser(String user);
	boolean existsByEmail(String email);
	boolean existsByUserAndPassword(String user, String password);
	
	@Query("{ 'user' : { $regex: ?0, $options: 'i' } }")
	List<User> findByUserContainingIgnoreCase(String username);
}
