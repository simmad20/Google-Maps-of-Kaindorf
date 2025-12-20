package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.Card;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CardRepository extends MongoRepository<Card, String> {
    Optional<Card> findCardById(ObjectId id);
}
