package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ObjectRepository extends MongoRepository<ObjectDocument, String> {
    List<ObjectDocument> findByTypeId(ObjectId typeId);

    @Query(value = "{ 'type.$id': ?0 }", sort = "{ 'attributes.lastname': 1 }")
    List<ObjectDocument> findByTypeIdSorted(ObjectId typeId);

    Optional<ObjectDocument> findByIdAndTypeId(ObjectId id, ObjectId typeId);

    Optional<ObjectDocument> findById(ObjectId id);

    @Query("{ 'type': ?0, 'attributes.?1': ?2 }")
    List<ObjectDocument> findByTypeAndAttribute(String type, String attributeKey, Object attributeValue);

    @Query("{ 'typeId': ?0, 'assigned_room.$id': ?1 }")
    List<ObjectDocument> findObjectsByTypeAndRoomId(ObjectId typeId, ObjectId roomId);

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
