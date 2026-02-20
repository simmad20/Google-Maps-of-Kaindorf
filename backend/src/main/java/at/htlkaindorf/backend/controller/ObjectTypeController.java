package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireAdmin;
import at.htlkaindorf.backend.dtos.ObjectTypeCreateDTO;
import at.htlkaindorf.backend.dtos.ObjectTypeDTO;
import at.htlkaindorf.backend.services.ObjectTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/types")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ObjectTypeController {

    private final ObjectTypeService objectTypeService;

    @GetMapping
    public ResponseEntity<Iterable<ObjectTypeDTO>> getAllObjectTypes() {
        return ResponseEntity.ok(objectTypeService.getAllObjectTypes());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Iterable<ObjectTypeDTO>> getAllObjectTypesFromEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(objectTypeService.getObjectTypesForEvent(eventId));
    }

    @PostMapping
    @RequireAdmin
    ResponseEntity<ObjectTypeDTO> createObjectType(@Valid @RequestBody ObjectTypeCreateDTO objectTypeCreateDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(objectTypeService.createObjectType(objectTypeCreateDTO));
    }

    @PutMapping
    @RequireAdmin
    ResponseEntity<ObjectTypeDTO> updateObjectType(@Valid @RequestBody ObjectTypeDTO objectTypeDTO) {
        return ResponseEntity.ok(objectTypeService.updateObjectType(objectTypeDTO));
    }
}