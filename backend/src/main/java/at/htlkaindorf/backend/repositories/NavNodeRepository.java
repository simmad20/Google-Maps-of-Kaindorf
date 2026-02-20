package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.NavNode;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NavNodeRepository extends MongoRepository<NavNode, ObjectId> {
    List<NavNode> findByCardIdAndTenantId(ObjectId cardId, ObjectId tenantId);

    List<NavNode> findByTenantId(ObjectId tenantId);

    Optional<NavNode> findByIdAndTenantId(ObjectId id, ObjectId tenantId);

    void deleteByCardIdAndTenantId(ObjectId cardId, ObjectId tenantId);
}
