package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireAdmin;
import at.htlkaindorf.backend.dtos.EventCreateDTO;
import at.htlkaindorf.backend.dtos.EventDTO;
import at.htlkaindorf.backend.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<Iterable<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/active")
    public ResponseEntity<EventDTO> getActiveEvent() {
        return ResponseEntity.ok(eventService.findActiveEvent());
    }

    @PostMapping
    @RequireAdmin
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventCreateDTO eventDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(eventDTO));
    }

    @PutMapping
    @RequireAdmin
    public ResponseEntity<EventDTO> updateEvent(@Valid @RequestBody EventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(eventDTO));
    }

    @PutMapping("/{eventId}/activate")
    @RequireAdmin
    public ResponseEntity<EventDTO> activateEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(eventService.setActiveEvent(eventId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }
}
