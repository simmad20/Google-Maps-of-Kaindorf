package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.ObjectDTO;
import at.htlkaindorf.backend.services.ObjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        return ResponseEntity.status(HttpStatus.CREATED).body(object);
    }

    @PutMapping("/{objectId}")
    public ResponseEntity<ObjectDTO> updateObject(
            @PathVariable String objectId,
            @RequestBody Map<String, Object> attributes) {
        ObjectDTO object = objectService.updateObject(objectId, attributes);
        return ResponseEntity.ok(object);
    }

    @GetMapping("/{typeId}")
    public ResponseEntity<Iterable<ObjectDTO>> getObjectsByType(@PathVariable String typeId) {
        List<ObjectDTO> objects = objectService.getObjectsByType(typeId);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/teacher/search")
    public ResponseEntity<Iterable<ObjectDTO>> searchTeachers(
            @RequestParam String query) {
        List<ObjectDTO> teachers = objectService.searchTeachers(query);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/findById/{objectId}")
    public ResponseEntity<ObjectDTO> getObjectById(
            @PathVariable String objectId) {
        ObjectDTO object = objectService.getObjectById(objectId);
        return ResponseEntity.ok(object);
    }

    @PostMapping("/{objectId}/assign-room/{roomId}")
    public ResponseEntity<ObjectDTO> assignObjectToRoom(
            @PathVariable String objectId,
            @PathVariable String roomId) {
        ObjectDTO object = objectService.assignObjectToRoom(objectId, roomId);
        return ResponseEntity.status(HttpStatus.CREATED).body(object);
    }

    @DeleteMapping("/{objectId}")
    public ResponseEntity<Void> deleteObject(
            @PathVariable String objectId) {
        objectService.deleteObject(objectId);
        return ResponseEntity.noContent().build();
    }
}