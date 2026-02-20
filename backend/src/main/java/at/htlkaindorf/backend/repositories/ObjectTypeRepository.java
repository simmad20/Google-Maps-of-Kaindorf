package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.ObjectType;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ObjectTypeRepository extends MongoRepository<ObjectType, ObjectId> {

    List<ObjectType> findByTenantId(ObjectId tenantId);

    Optional<ObjectType> findByIdAndTenantId(ObjectId id, ObjectId tenantId);

    List<ObjectType> findByIdInAndTenantId(Collection<ObjectId> ids, ObjectId tenantId);
}
