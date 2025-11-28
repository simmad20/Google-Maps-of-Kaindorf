package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
import at.htlkaindorf.backend.services.RoomService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<Iterable<RoomDTO>> getAllRooms() {
        List<RoomDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<Iterable<RoomDTO>> getAllRoomsFromCard(
            @PathVariable String cardId
    ) {
        List<RoomDTO> rooms = roomService.getAllRoomsByCardId(cardId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailedDTO> getRoomWithDetails(@PathVariable String id) {
        RoomDetailedDTO room = roomService.getRoomWithDetails(id);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{id}/objects/{objectType}")
    public ResponseEntity<RoomDetailedDTO> getRoomWithObjectsByType(
            @PathVariable String id,
            @PathVariable String objectType) {
        RoomDetailedDTO room = roomService.getRoomWithObjectsByType(id, objectType);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{cardId}")
    public ResponseEntity<RoomDTO> createRoom(
            @RequestBody CreateRoomRequestDTO request,
            @PathVariable String cardId) {
        RoomDTO createdRoom = roomService.createRoom(request, cardId);
        return ResponseEntity.status(201).body(createdRoom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable String id,
            @RequestBody CreateRoomRequestDTO request) {
        RoomDTO updatedRoom = roomService.updateRoom(id, request);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/assigned")
    public ResponseEntity<Void> removeObjectFromRoom(
            @RequestParam String roomId,
            @RequestParam String objectId,
            @RequestParam String objectType) {
        roomService.removeObjectFromRoom(roomId, objectId, objectType);
        return ResponseEntity.noContent().build();
    }
}