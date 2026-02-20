package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.*;
import at.htlkaindorf.backend.exceptions.ForbiddenException;
import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.exceptions.UserAlreadyExistsAuthenticationException;
import at.htlkaindorf.backend.mapper.TenantMapper;
import at.htlkaindorf.backend.mapper.UserMapper;
import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.Tenant;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.TenantRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final TenantMapper tenantMapper;
    private final UserMapper userMapper;
    private final AuthContext authContext;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    @Value("${spring.mail.expiryInHours}")
    private Long verifyMailExpiryInHours;

    public TenantDTO getTenant() {
        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant not found"));

        return tenantMapper.toDto(tenant);
    }

    public TenantDTO updateTenant(UpdateTenantRequestDTO request) {
        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant not found"));

        tenant.setName(request.getName());
        tenant.setDisplayName(request.getDisplayName());
        tenant.setUpdatedAt(LocalDateTime.now());

        return tenantMapper.toDto(tenantRepository.save(tenant));
    }

    public TenantDTO resetJoinCode() {

        Tenant tenant = tenantRepository.findById(
                authContext.getTenantObjectId()
        ).orElseThrow(() -> new NotFoundException("Tenant not found"));

        tenant.setJoinCode(UUID.randomUUID().toString());
        tenant.setUpdatedAt(LocalDateTime.now());

        tenantRepository.save(tenant);

        return tenantMapper.toDto(tenant);
    }

    public InviteResponseDTO inviteUser(InviteUserRequestDTO request) {
        if (userRepository.findByEmailAndTenantId(request.getEmail(), authContext.getTenantObjectId()).isPresent()) {
            throw new UserAlreadyExistsAuthenticationException("Email already exists in this tenant");
        }

        if (userRepository.findByUsername(request.getName()).isPresent()) {
            throw new UserAlreadyExistsAuthenticationException("Username already exists");
        }

        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant not found"));

        String tempPassword = UUID.randomUUID().toString().substring(0, 12);
        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(tempPassword))
                .tenantId(authContext.getTenantObjectId())
                .roles(Set.of(request.getRole()))
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .emailVerificationToken(verificationToken)
                .emailVerificationExpiry(LocalDateTime.now().plusHours(verifyMailExpiryInHours))
                .build();

        user = userRepository.save(user);

        emailService.sendInvitationEmail(user.getEmail(), verificationToken, tenant.getName(), request.getRole().name(),
                tempPassword);

        return new InviteResponseDTO(user.getId().toHexString(), user.getEmail(),
                request.getRole().toString() + " invited successfully. Temp password and verification link sent to email: " +
                        request.getEmail() + ". Their verification link will expire in 24 hours.");
    }

    public UserDTO changeUserRole(String userId, ChangeRoleRequestDTO request) {
        User user = userRepository.findByIdAndTenantId(new ObjectId(userId), authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getRoles().contains(Role.SUPER_ADMIN)) {
            throw new ForbiddenException("Cannot modify a SuperAdmin");
        }

        user.setRoles(Set.of(request.getRole()));
        user.setRefreshToken(null);
        return userMapper.toDto(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        User user = userRepository.findByIdAndTenantId(new ObjectId(userId), authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getRoles().contains(Role.SUPER_ADMIN)) {
            throw new ForbiddenException("Cannot delete a SuperAdmin");
        }

        userRepository.delete(user);
    }

    public List<UserDTO> listUsers() {
        return userRepository.findByTenantId(authContext.getTenantObjectId())
                .stream().map(userMapper::toDto)
                .collect(Collectors.toList());
    }
}
