package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.AuthResponseDTO;
import at.htlkaindorf.backend.dtos.LoginRequestDTO;
import at.htlkaindorf.backend.dtos.RegisterTenantRequestDTO;
import at.htlkaindorf.backend.exceptions.*;
import at.htlkaindorf.backend.models.Role;
import at.htlkaindorf.backend.models.documents.Tenant;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.TenantRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    @Value("${spring.mail.expiryInHours}")
    private Long verifyMailExpiryInHours;
    private final AuthContext authContext;

    public String registerSuperAdmin(RegisterTenantRequestDTO request) {
        if (!request.getPassword().equals(request.getRepeatPassword())) {
            throw new PasswordInvalidException("Password does not match repeated password.");
        }

        if (userRepository.findByUsername(request.getName()).isPresent()) {
            throw new UserAlreadyExistsAuthenticationException("Username already exists");
        }

        Tenant tenant = new Tenant();
        tenant.setName(request.getTenantName());
        tenant.setDisplayName(request.getName());

        tenant = tenantRepository.save(tenant);

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getName())
                .tenantId(tenant.getId())
                .roles(Set.of(Role.SUPER_ADMIN))
                .createdAt(LocalDateTime.now())
                .enabled(false)
                .emailVerificationToken(verificationToken)
                .emailVerificationExpiry(LocalDateTime.now().plusHours(verifyMailExpiryInHours))
                .build();

        user = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        return "Successfully registered and created tenant. Please verify your email.";
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid verification token"));

        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now()))
            throw new TokenExpiredException("Verification link has expired");

        user.setEnabled(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        userRepository.save(user);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new NotFoundException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PasswordInvalidException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new UserDeactivatedException("Please verify your email first");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponseDTO refresh(String refreshToken) {
        if (!jwtService.isRefreshToken(refreshToken))
            throw new PasswordInvalidException("Invalid refresh token");

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new PasswordInvalidException("Refresh token revoked"));

        return buildAuthResponse(user);
    }

    public void logout() {
        User user = userRepository.findById(authContext.getUserObjectId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    public void changePassword(String currentPassword, String newPassword) {
        User user = userRepository.findById(authContext.getUserObjectId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new PasswordInvalidException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    private AuthResponseDTO buildAuthResponse(User user) {
        String accessToken = jwtService.generateToken(
                user.getId().toHexString(),
                user.getTenantId().toHexString(),
                user.getRoles()
        );
        String newRefreshToken = jwtService.generateRefreshToken(
                user.getId().toHexString(),
                user.getTenantId().toHexString(),
                user.getRoles()
        );
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return new AuthResponseDTO(
                accessToken, newRefreshToken,
                user.getId().toHexString(),
                user.getUsername(),
                user.getRoles()
        );
    }
}
