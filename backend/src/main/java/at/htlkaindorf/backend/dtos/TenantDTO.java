package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TenantDTO {
    private String id;
    private String name;
    private String displayName;
    private String joinCode;
    // später löschen
    private String apiKey;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
