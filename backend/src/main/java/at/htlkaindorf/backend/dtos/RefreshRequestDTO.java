package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshRequestDTO {
    private String refreshToken;
}
