package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class AppJoinResponseDTO {
    private String token;
    private String id;
    private Set<Role> roles;
    private String tenantId;
}
