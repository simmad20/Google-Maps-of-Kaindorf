package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByEmail(String email);
}
