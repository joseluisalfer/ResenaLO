package principal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
	
	List<Review> findByUser(String user);
	List<Review> findByValoration(int valoration);
	List<Review> findByTitle(String title);
	List<Review> findTop3ByOrderByValorationDesc();
	List<Review> findTop10ByOrderByValorationDesc();
	Optional<Review> findById(String id);
}
