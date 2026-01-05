package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.ObjectType;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ObjectRepository extends MongoRepository<ObjectDocument, ObjectType> {
    List<ObjectDocument> findByTypeId(ObjectId typeId);

    @Query(value = "{ 'type.$id': ?0 }", sort = "{ 'attributes.lastname': 1 }")
    List<ObjectDocument> findByTypeIdSorted(ObjectId typeId);


    Optional<ObjectDocument> findById(ObjectId id);

    @Query(value = "{ 'type': ?0, 'attributes.abbreviation': ?1 }", exists = true)
    boolean existsByTypeAndAttributesAbbreviation(String type, String abbreviation);

}
