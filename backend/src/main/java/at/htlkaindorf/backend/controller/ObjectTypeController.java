package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.ObjectTypeDTO;
import at.htlkaindorf.backend.services.ObjectTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
