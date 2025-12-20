package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.mapper.CardMapper;
import at.htlkaindorf.backend.repositories.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardMapper cardMapper;

    public List<CardDTO> getAllCards() {
        return cardRepository.findAll()
                .stream().map(cardMapper::toDTO)
                .collect(Collectors.toList());
    }
}
