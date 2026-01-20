package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.ObjectType;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ObjectRepository extends MongoRepository<ObjectDocument, ObjectType> {
    List<ObjectDocument> findByTypeId(ObjectId typeId);

    @Query(value = "{ 'type_id': ?0 }")
    List<ObjectDocument> findByTypeIdSorted(ObjectId typeId, Sort sort);


    Optional<ObjectDocument> findById(ObjectId id);

    List<ObjectDocument> findByIdIn(Collection<ObjectId> ids);

    @Query(value = "{ 'type_id': ?0, 'attributes.abbreviation': ?1 }", exists = true)
    boolean existsByTypeAndAttributesAbbreviation(String typeId, String abbreviation);

    List<ObjectDocument> findByAssignedRoomId(ObjectId roomId);

    List<ObjectDocument> findAllByIdIn(List<ObjectId> objectIds);

    List<ObjectDocument> findByAssignedRoomIdAndTypeId(ObjectId roomId, ObjectId typeId);

}
