package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.AppJoinRequestDTO;
import at.htlkaindorf.backend.dtos.AppJoinResponseDTO;
import at.htlkaindorf.backend.exceptions.TenantInactiveException;
import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.Tenant;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.TenantRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppService {
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AppJoinResponseDTO joinTenant(AppJoinRequestDTO request) {
        Tenant tenant = tenantRepository.findByJoinCode(request.getJoinCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid join code"));

        if (!tenant.isActive()) {
            throw new TenantInactiveException("Tenant is inactive");
        }

        String anonymousEmail = "app-user-" + UUID.randomUUID() + "@anonymous.local";

        User appUser = User.builder()
                .email(anonymousEmail)
                .username("App User")
                .password("")
                .tenantId(tenant.getId())
                .roles(Set.of(Role.APP_USER))
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        appUser = userRepository.save(appUser);

        String token = jwtService.generateToken(appUser.getId().toHexString(), tenant.getId().toHexString(), appUser.getRoles());

        return new AppJoinResponseDTO(
                token,
                appUser.getId().toHexString(),
                appUser.getRoles(),
                tenant.getId().toHexString()
        );
    }
}
