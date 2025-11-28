package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.ObjectDTO;
import at.htlkaindorf.backend.services.ObjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/objects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ObjectController {

    private final ObjectService objectService;

    @PostMapping("/{typeId}")
    public ResponseEntity<ObjectDTO> createObject(
            @PathVariable String typeId,
            @RequestBody Map<String, Object> attributes) {
        ObjectDTO object = objectService.createObject(typeId, attributes);
        return ResponseEntity.ok(object);
    }

    @PutMapping("/{typeId}/{objectId}")
    public ResponseEntity<ObjectDTO> updateObject(
            @PathVariable String typeId,
            @PathVariable String objectId,
            @RequestBody Map<String, Object> attributes) {
        ObjectDTO object = objectService.updateObject(objectId, typeId, attributes);
        return ResponseEntity.ok(object);
    }

    @GetMapping("/{type}")
    public ResponseEntity<Iterable<ObjectDTO>> getObjectsByType(@PathVariable String type) {
        List<ObjectDTO> objects = objectService.getObjectsByType(type);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/teacher/search")
    public ResponseEntity<Iterable<ObjectDTO>> searchTeachers(
            @RequestParam String query) {
        List<ObjectDTO> teachers = objectService.searchTeachers(query);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{type}/{objectId}")
    public ResponseEntity<ObjectDTO> getObjectById(
            @PathVariable String type,
            @PathVariable String objectId) {
        ObjectDTO object = objectService.getObjectByIdAndType(objectId, type);
        return ResponseEntity.ok(object);
    }

    @PostMapping("/{type}/{objectId}/assign-room/{roomId}")
    public ResponseEntity<ObjectDTO> assignObjectToRoom(
            @PathVariable String type,
            @PathVariable String objectId,
            @PathVariable String roomId) {
        ObjectDTO object = objectService.assignObjectToRoom(objectId, type, roomId);
        return ResponseEntity.ok(object);
    }

    @DeleteMapping("/{type}/{objectId}")
    public ResponseEntity<Void> deleteObject(
            @PathVariable String type,
            @PathVariable String objectId) {
        objectService.deleteObject(objectId, type);
        return ResponseEntity.noContent().build();
    }
}