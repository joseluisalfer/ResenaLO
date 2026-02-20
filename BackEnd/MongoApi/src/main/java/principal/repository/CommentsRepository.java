package principal.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Comments;

public interface CommentsRepository extends MongoRepository<Comments, String> {
	List<Comments> findByReviewId(String resenaId);
	long deleteByReviewId(String reviewId);
}
