package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.CardDTO;
import at.htlkaindorf.backend.models.documents.Card;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface CardMapper {
    default CardDTO toDTO(Card c) {
        String path = c.getImageFileId() != null ? "/api/cards/" + c.getId() + "/image" : null;
        return new CardDTO(c.getId().toString(), c.getTitle(), c.getTenantId().toString(),
                path, c.getImageWidth(), c.getImageHeight());
    }

    Card toEntity(CardDTO cardDTO);
}
