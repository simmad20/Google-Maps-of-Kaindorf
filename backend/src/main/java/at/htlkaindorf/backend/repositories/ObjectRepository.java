package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.ObjectDocument;
import at.htlkaindorf.backend.models.ObjectType;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ObjectRepository extends MongoRepository<ObjectDocument, String> {
    List<ObjectDocument> findByType(String type);

    @Aggregation(pipeline = {
            "{ $match: { type: ?0 } }",
            "{ $sort: { 'attributes.lastname': 1 } }"
    })
    List<ObjectDocument> findTeachersSortedByLastname(String type);

    Optional<ObjectDocument> findByIdAndType(String id, String type);

    @Query("{ 'type': ?0, 'attributes.?1': ?2 }")
    List<ObjectDocument> findByTypeAndAttribute(String type, String attributeKey, Object attributeValue);

    @Query("{ 'type': ?0, 'assignedRoom.$id': ?1 }")
    List<ObjectDocument> findObjectsByTypeAndRoomId(String type, ObjectType roomId);

    // Korrekte Query für exists mit dynamischen Attributen
    @Query(value = "{ 'type': ?0, 'attributes.abbreviation': ?1 }", exists = true)
    boolean existsByTypeAndAttributesAbbreviation(String type, String abbreviation);

    @Query("{ 'type': 'teacher', $or: [ " +
            "{ 'attributes.firstname': { $regex: ?0, $options: 'i' } }, " +
            "{ 'attributes.lastname': { $regex: ?0, $options: 'i' } }, " +
            "{ 'attributes.kuerzel': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<ObjectDocument> findTeachersBySearchTerm(String searchTerm);
}
