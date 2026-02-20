package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.Settings;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TenantDTO {
    private String id;
    private String name;
    private String displayName;
    private Settings settings;
    private String joinCode;
    private String apiKey;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
