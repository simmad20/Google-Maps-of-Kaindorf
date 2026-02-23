package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireSuperAdmin;
import at.htlkaindorf.backend.annotations.RequireViewer;
import at.htlkaindorf.backend.dtos.*;
import at.htlkaindorf.backend.services.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tenant")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TenantController {
    private final TenantService tenantService;

    @GetMapping
    @RequireViewer
    public ResponseEntity<TenantDTO> getTenant() {
        return ResponseEntity.ok(tenantService.getTenant());
    }

    @PutMapping
    @RequireSuperAdmin
    public ResponseEntity<TenantDTO> updateTenant(@Valid @RequestBody UpdateTenantRequestDTO request) {
        return ResponseEntity.ok(tenantService.updateTenant(request));
    }

    @PostMapping("/joincode/reset")
    @RequireSuperAdmin
    public ResponseEntity<TenantDTO> resetJoinCode() {
        return ResponseEntity.ok(tenantService.resetJoinCode());
    }

    @PostMapping("/invite")
    @RequireSuperAdmin
    public ResponseEntity<InviteResponseDTO> inviteUser(@Valid @RequestBody InviteUserRequestDTO request) {
        return ResponseEntity.ok(tenantService.inviteUser(request));
    }

    @PutMapping("/users/{userId}/role")
    @RequireSuperAdmin
    public ResponseEntity<UserDTO> changeUserRole(@PathVariable String userId, @RequestBody ChangeRoleRequestDTO request) {
        return ResponseEntity.ok(tenantService.changeUserRole(userId, request));
    }

    @DeleteMapping("/users/{userId}")
    @RequireSuperAdmin
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        tenantService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    @RequireViewer
    public ResponseEntity<Iterable<UserDTO>> listUsers() {
        return ResponseEntity.ok(tenantService.listUsers());
    }
}
