package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {

    Optional<User> findByIdAndTenantId(ObjectId id, ObjectId tenantId);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndTenantId(String email, ObjectId tenantId);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndTenantId(String username, ObjectId tenantId);

    List<User> findByTenantId(ObjectId tenantId);

    Optional<User> findByEmailVerificationToken(String token);

    Optional<User> findByRefreshToken(String refreshToken);

    List<User> findByEnabledFalseAndEmailVerificationExpiryBefore(LocalDateTime dateTime);

    List<User> findByRolesContainingAndCreatedAtBefore(Role role, LocalDateTime dateTime);
}
