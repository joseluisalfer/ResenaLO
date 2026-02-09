package principal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import principal.model.Images;

public interface ImagesRepository extends MongoRepository<Images, String> {
	
}
