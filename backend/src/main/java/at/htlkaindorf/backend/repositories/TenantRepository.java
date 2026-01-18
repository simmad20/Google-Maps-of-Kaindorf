package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.documents.Tenant;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TenantRepository extends MongoRepository<Tenant, ObjectId> {
}
