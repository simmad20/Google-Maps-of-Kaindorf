package at.htlkaindorf.backend.auth;

import at.htlkaindorf.backend.models.Role;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class AuthContext {
    private ObjectId userId;
    private ObjectId tenantId;
    private Role role;
}
