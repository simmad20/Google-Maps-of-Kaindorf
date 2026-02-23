package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Set;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    private ObjectId id;
    private String username;
    @Field("first_name")
    private String firstName;
    @Field("last_name")
    private String lastName;
    private String email;
    private String password;
    private ObjectId tenantId;
    private Set<Role> roles;
    @Field("created_at")
    private LocalDateTime createdAt;
    @Field("last_login_at")
    private LocalDateTime lastLoginAt;
    private boolean enabled;
    @Field("refresh_token")
    private String refreshToken;
    @Field("email_verification_token")
    private String emailVerificationToken;
    @Field("email_verification_expiry")
    private LocalDateTime emailVerificationExpiry;

    public boolean isSuperAdmin() {
        return roles != null && roles.contains(Role.SUPER_ADMIN);
    }

    public boolean canEdit() {
        return roles != null && (
                roles.contains(Role.SUPER_ADMIN) ||
                        roles.contains(Role.ADMIN)
        );
    }
}
