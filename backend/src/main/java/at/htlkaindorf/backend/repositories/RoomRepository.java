package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.Room;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, ObjectId> {

    List<Room> findByEventIdInAndTenantId(List<ObjectId> eventIds, ObjectId tenantId);


    List<Room> findByCardIdAndEventIdInAndTenantId(ObjectId cardId, List<ObjectId> eventIds, ObjectId tenantId);

    List<Room> findByTenantId(ObjectId tenantId);

    List<Room> findByCardIdAndTenantId(ObjectId cardId, ObjectId tenantId);


    Optional<Room> findByIdAndTenantId(ObjectId id, ObjectId tenantId);
}
