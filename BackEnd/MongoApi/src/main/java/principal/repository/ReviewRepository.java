package principal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
	
	List<Review> findByUser(String user);
	List<Review> findByValoration(int valoration);
	Review findByTitle(String title);
	Optional<Review> findById(String id);
}
