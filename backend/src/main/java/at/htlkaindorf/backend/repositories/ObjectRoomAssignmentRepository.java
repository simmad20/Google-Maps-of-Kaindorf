package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectRoomAssignment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ObjectRoomAssignmentRepository extends MongoRepository<ObjectRoomAssignment, ObjectId> {
    Optional<ObjectRoomAssignment> findByRoomIdAndEventIdAndTenantId(ObjectId roomId, ObjectId eventId, ObjectId tenantId);

    List<ObjectRoomAssignment> findByEventIdAndTenantId(ObjectId eventId, ObjectId tenantId);

    List<ObjectRoomAssignment> findByObjectIdsContainsAndTenantId(List<ObjectId> objectIds, ObjectId tenantId);

    List<ObjectRoomAssignment> findByEventIdAndRoomIdInAndTenantId(ObjectId eventId, Collection<ObjectId> roomIds, ObjectId tenantId);

    void deleteByRoomIdAndTenantId(ObjectId roomId, ObjectId tenantId);
}
