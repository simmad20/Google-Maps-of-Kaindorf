package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    String refreshToken;
    private String id;
    private String username;
    private Set<Role> roles;
}
