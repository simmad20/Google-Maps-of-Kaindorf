package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InviteResponseDTO {
    private String userId;
    private String email;
    private String message;
}
