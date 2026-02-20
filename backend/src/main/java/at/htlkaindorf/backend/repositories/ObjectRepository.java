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

public interface ObjectRepository extends MongoRepository<ObjectDocument, ObjectId> {

    List<ObjectDocument> findByTenantId(ObjectId tenantId);

    List<ObjectDocument> findByTypeIdAndTenantId(ObjectId typeId, ObjectId tenantId);

    @Query(value = "{ 'type_id': ?0 , 'tenant_id':  ?1}")
    List<ObjectDocument> findByTypeIdSorted(ObjectId typeId, ObjectId tenantId, Sort sort);


    Optional<ObjectDocument> findByIdAndTenantId(ObjectId id, ObjectId tenantId);

    List<ObjectDocument> findByIdInAndTenantId(Collection<ObjectId> ids, ObjectId tenantId);

    @Query(value = "{ 'type_id': ?0, 'attributes.abbreviation': ?1 }", exists = true)
    boolean existsByTypeAndAttributesAbbreviation(String typeId, String abbreviation);

    List<ObjectDocument> findAllByIdInAndTenantId(Collection<ObjectId> ids, ObjectId tenantId);

}
