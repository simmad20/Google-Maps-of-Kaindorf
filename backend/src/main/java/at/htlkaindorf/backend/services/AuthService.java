package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.LoginRequestDTO;
import at.htlkaindorf.backend.dtos.AuthResponseDTO;
import at.htlkaindorf.backend.dtos.RegisterRequestDTO;
import at.htlkaindorf.backend.exceptions.InvalidTokenException;
import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.exceptions.PasswordInvalidException;
import at.htlkaindorf.backend.exceptions.UserAlreadyExistsAuthenticationException;
import at.htlkaindorf.backend.models.TenantMembership;
import at.htlkaindorf.backend.models.documents.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        TenantMembership membership = findLastUsedTenantMembershipOfUser(user);
        String token = jwtService.generateToken(user, membership);

        return new AuthResponseDTO(user.getUsername(), token, user.getMemberships(), membership.getTenantId().toHexString());
    }

    public String register(RegisterRequestDTO request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(u -> {
            throw new UserAlreadyExistsAuthenticationException("A user with this username already exists");
        });

        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new UserAlreadyExistsAuthenticationException("A user with this email already exists");
        });

        if (!request.getPassword().equals(request.getRepeatPassword())) {
            throw new PasswordInvalidException("Password does not match repeated password");
        }

        User newUser = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .email(request.getEmail())
                .createdAt(Instant.now())
                .enabled(true)
                .build();


        userRepository.save(newUser);

        return "Registration successful";
    }

    public AuthResponseDTO refreshToken(String refreshToken, HttpServletResponse response) {
        String userId = jwtService.extractUserId(refreshToken);

        User user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new NotFoundException("User for refresh token not found"));

        if (!jwtService.isRefreshTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        TenantMembership membership = findLastUsedTenantMembershipOfUser(user);
        String newAccessToken = jwtService.generateToken(user, membership);
        String newRefreshToken = jwtService.generateRefreshToken(user, membership);

        setRefreshTokenCookie(response, newRefreshToken);

        return new AuthResponseDTO(
                user.getUsername(),
                newAccessToken,
                user.getMemberships(),
                membership.getTenantId().toHexString()
        );
    }

    public void logout(HttpServletResponse response) {
        Cookie deleteCookie = new Cookie("refreshToken", null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(false);
        deleteCookie.setPath("/auth");
        deleteCookie.setMaxAge(0);

        response.addCookie(deleteCookie);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/auth");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(refreshTokenCookie);
    }

    private TenantMembership findLastUsedTenantMembershipOfUser(User user) {
        return user.getMemberships().stream().filter(m -> m.getTenantId().equals(user.getLastTenantId()))
                .findFirst()
                .or(() -> user.getMemberships().stream().findFirst())
                .orElseThrow(() -> new NotFoundException("No tenant found for user: " + user.getUsername()));
    }
}
