package at.htlkaindorf.backend.models;

import java.util.Map;
import java.util.Set;

public class RolePermissions {
    private static final Map<Role, Set<Permission>> ROLE_PERMISSIONS = Map.of(
            Role.ADMIN, Set.of(Permission.values()),

            Role.EDITOR, Set.of(
                    Permission.OBJECT_CREATE,
                    Permission.OBJECT_EDIT,
                    Permission.ROOM_ASSIGN
            ),

            Role.VIEWER, Set.of()
    );

    public static Set<Permission> permissions(Role role) {
        return ROLE_PERMISSIONS.getOrDefault(role, Set.of());
    }
}
