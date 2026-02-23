package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.AppJoinRequestDTO;
import at.htlkaindorf.backend.dtos.AppJoinResponseDTO;
import at.htlkaindorf.backend.services.AppService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/app")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AppController {
    private final AppService appService;

    @PostMapping("/join")
    public ResponseEntity<AppJoinResponseDTO> joinTenant(@Valid @RequestBody AppJoinRequestDTO request) {
        return ResponseEntity.ok(appService.joinTenant(request));
    }
}
