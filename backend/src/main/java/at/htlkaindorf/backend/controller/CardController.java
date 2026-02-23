package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireAdmin;
import at.htlkaindorf.backend.annotations.RequireViewer;
import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.services.CardService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @GetMapping
    public ResponseEntity<Iterable<CardDTO>> getAllCards() {
        return ResponseEntity.ok(cardService.getAllCards());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequireAdmin
    public ResponseEntity<?> create(
            @RequestPart("title") String title,
            @RequestPart("image") MultipartFile image) {
        if (image.isEmpty()) return ResponseEntity.badRequest().body("Image required");
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(cardService.createCard(title, image));
        } catch (IOException e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Image processing failed: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequireAdmin
    public ResponseEntity<?> replaceImage(
            @PathVariable String id,
            @RequestPart("image") MultipartFile image) {
        if (image.isEmpty()) return ResponseEntity.badRequest().body("Image required");
        try {
            return ResponseEntity.ok(cardService.replaceImage(new ObjectId(id), image));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Image processing failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @RequireAdmin
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            cardService.deleteCard(new ObjectId(id));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String id) {
        try {
            CardService.ImageResource res = cardService.getImage(new ObjectId(id));
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(res.contentType))
                    .header("Cache-Control", "max-age=3600, public")
                    .body(new InputStreamResource(res.stream));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
