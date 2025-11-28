package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.models.Card;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CardMapper {
    CardDTO toDTO(Card card);

    Card toEntity(CardDTO cardDTO);
}
