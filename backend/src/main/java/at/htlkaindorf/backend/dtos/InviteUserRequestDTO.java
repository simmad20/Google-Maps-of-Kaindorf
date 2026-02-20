package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.Role;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InviteUserRequestDTO {
    @NotEmpty
    private String email;
    @NotEmpty
    private String name;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    private Role role;
}
