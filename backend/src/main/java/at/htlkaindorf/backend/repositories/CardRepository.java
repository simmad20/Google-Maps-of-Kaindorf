package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.Card;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends MongoRepository<Card, ObjectId> {
    List<Card> findAllByTenantId(ObjectId tenantId);

    Optional<Card> findCardByIdAndTenantId(ObjectId id, ObjectId tenantId);
}
