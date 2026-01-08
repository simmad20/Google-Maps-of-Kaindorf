package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectType;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ObjectTypeRepository extends MongoRepository<ObjectType, ObjectId> {
    Optional<ObjectType> findByName(String name);
}
