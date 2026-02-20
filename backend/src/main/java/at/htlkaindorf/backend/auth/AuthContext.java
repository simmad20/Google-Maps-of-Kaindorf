package at.htlkaindorf.backend.auth;

import at.htlkaindorf.backend.models.Role;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Set;

@Component
@RequestScope
@Data
public class AuthContext {
    private String userId;
    private String tenantId;
    private Set<Role> roles;

    public ObjectId getTenantObjectId() {
        return new ObjectId(tenantId);
    }

    public ObjectId getUserObjectId() {
        return new ObjectId(userId);
    }
}
