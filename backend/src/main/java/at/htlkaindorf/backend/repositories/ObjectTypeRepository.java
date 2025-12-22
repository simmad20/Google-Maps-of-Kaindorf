package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ObjectTypeRepository extends MongoRepository<ObjectType, String> {
    Optional<ObjectType> findByName(String name);
}
