package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireAdmin;
import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
import at.htlkaindorf.backend.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms(
            @RequestParam(required = false) String eventId
    ) {
        return ResponseEntity.ok(roomService.getAllRoomsFromEvent(eventId));
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<List<RoomDTO>> getAllRoomsFromCard(
            @PathVariable String cardId,
            @RequestParam(required = false) String eventId
    ) {
        return ResponseEntity.ok(roomService.getAllRoomsByCardId(cardId, eventId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailedDTO> getRoomWithDetails(
            @PathVariable String id,
            @RequestParam(required = false) String eventId
    ) {
        return ResponseEntity.ok(roomService.getRoomWithDetails(id, eventId));
    }

    @GetMapping("/{id}/objects/{objectTypeId}")
    public ResponseEntity<RoomDetailedDTO> getRoomWithObjectsByType(
            @PathVariable String id,
            @PathVariable String objectTypeId,
            @RequestParam(required = false) String eventId
    ) {
        return ResponseEntity.ok(roomService.getRoomWithObjectsByType(id, objectTypeId, eventId));
    }

    @PostMapping("/{cardId}")
    @RequireAdmin
    public ResponseEntity<RoomDTO> createRoom(
            @RequestBody CreateRoomRequestDTO request,
            @PathVariable String cardId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(request, cardId));
    }

    @PutMapping("/{id}")
    @RequireAdmin
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable String id,
            @RequestBody CreateRoomRequestDTO request
    ) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    @RequireAdmin
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/assigned")
    @RequireAdmin
    public ResponseEntity<Void> removeObjectFromRoom(
            @RequestParam String roomId,
            @RequestParam String objectId,
            @RequestParam String eventId
    ) {
        roomService.removeObjectFromRoom(objectId, roomId, eventId);
        return ResponseEntity.noContent().build();
    }
}
