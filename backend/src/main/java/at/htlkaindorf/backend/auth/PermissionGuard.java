package at.htlkaindorf.backend.auth;

import at.htlkaindorf.backend.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class PermissionGuard {
    private final AuthContext auth;

    public void require(Role role) throws AccessDeniedException {
        if (auth.getRole() != role) {
            throw new AccessDeniedException("Insufficient permissions");
        }
    }

    public void requireAny(Role... roles) throws AccessDeniedException {
        if (Arrays.stream(roles).noneMatch(r -> r.equals(auth.getRole()))) {
            throw new AccessDeniedException("Insufficient permissions");
        }
    }
}
