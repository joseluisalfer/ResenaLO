package principal.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
	
	List<Review> findByUser(String user);
	List<Review> findByValoration(int valoration);
	List<Review> findByTitle(String title);
	
}
