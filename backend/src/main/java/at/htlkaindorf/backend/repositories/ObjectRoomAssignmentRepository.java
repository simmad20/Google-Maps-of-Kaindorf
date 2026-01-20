package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectRoomAssignment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ObjectRoomAssignmentRepository extends MongoRepository<ObjectRoomAssignment, ObjectId> {
    Optional<ObjectRoomAssignment> findByRoomIdAndEventId(ObjectId roomId, ObjectId eventId);

    List<ObjectRoomAssignment> findByEventId(ObjectId eventId);

    List<ObjectRoomAssignment> findByObjectIdsContains(ObjectId objectId);

    List<ObjectRoomAssignment> findByEventIdAndRoomIdIn(ObjectId eventId, List<ObjectId> roomIds);

    void deleteByRoomId(ObjectId roomId);
}
