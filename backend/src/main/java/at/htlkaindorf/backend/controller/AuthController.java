package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.LoginRequestDTO;
import at.htlkaindorf.backend.dtos.AuthResponseDTO;
import at.htlkaindorf.backend.dtos.RegisterRequestDTO;
import at.htlkaindorf.backend.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(@CookieValue String refreshToken, HttpServletResponse response) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken, response));
    }
}
