package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.ObjectType;
import at.htlkaindorf.backend.models.Room;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {

    @Query("{ 'card.$id': ?0 }")
    List<Room> findAllByCardId(ObjectId cardId);

    Optional<Room> findByRoomNumber(String roomNumber);

    @Query("{ 'assignedObjects.$id': ?0 }")
    Optional<Room> findRoomByObjectId(ObjectId objectId);

    List<Room> findByNameContainingIgnoreCase(String name);

    @Query("{ 'assignedObjects': { $elemMatch: { '$id': ?0, 'type': ?1 } } }")
    Optional<Room> findRoomByObjectIdAndType(ObjectType objectId, String type);
}
