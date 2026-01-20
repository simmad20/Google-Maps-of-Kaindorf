package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.TenantAccessKey;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TenantAccessKeyRepository extends MongoRepository<TenantAccessKey, ObjectId> {
}
