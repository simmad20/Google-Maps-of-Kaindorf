package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangeRoleRequestDTO {
    private Role role;
}
