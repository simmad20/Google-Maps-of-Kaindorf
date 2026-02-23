package at.htlkaindorf.backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppJoinRequestDTO {
    @NotEmpty
    private String joinCode;
}
