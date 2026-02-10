package principal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Comments;

public interface CommentsRepository extends MongoRepository<Comments, String> {
	
}
