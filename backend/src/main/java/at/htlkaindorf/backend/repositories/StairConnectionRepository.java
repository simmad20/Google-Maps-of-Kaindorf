package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.StairConnection;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface StairConnectionRepository extends MongoRepository<StairConnection, ObjectId> {
    List<StairConnection> findByTenantId(ObjectId tenantId);

    @Query("{ $or: [ { 'card1Id': ?0 }, { 'card2Id': ?0 } ], 'tenantId': ?1 }")
    List<StairConnection> findByCardAndTenantId(ObjectId cardId, ObjectId tenantId);

    @Query("{ $or: [ { 'node1Id': ?0 }, { 'node2Id': ?1 } ], 'tenantId': ?2 }")
    List<StairConnection> findByNode1IdOrNode2IdAndTenantId(ObjectId node1Id, ObjectId node2Id, ObjectId tenantId);
}
