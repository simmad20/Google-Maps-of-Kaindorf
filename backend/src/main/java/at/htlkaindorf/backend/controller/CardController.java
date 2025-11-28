package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.services.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
