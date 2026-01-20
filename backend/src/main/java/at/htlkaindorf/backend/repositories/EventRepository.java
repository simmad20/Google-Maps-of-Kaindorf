package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.Event;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EventRepository extends MongoRepository<Event, ObjectId> {
    Optional<Event> findEventByActiveIsTrue();
}
