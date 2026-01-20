package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.Room;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, ObjectId> {
    List<Room> findByCardIdAndEventIdIn(ObjectId cardId, List<ObjectId> eventIds);

    List<Room> findByEventIdIn(List<ObjectId> eventIds);

}
