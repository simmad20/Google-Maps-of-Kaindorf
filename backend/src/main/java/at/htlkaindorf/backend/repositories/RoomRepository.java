package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.Room;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, ObjectId> {

    @Query("{ 'card_id': ?0 }")
    List<Room> findAllByCardId(ObjectId cardId);

}
