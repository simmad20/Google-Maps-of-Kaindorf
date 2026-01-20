package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.TenantMembership;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String username;
    private String accessToken;
    private List<TenantMembership> tenants;
    private String activeTenantId;
}
