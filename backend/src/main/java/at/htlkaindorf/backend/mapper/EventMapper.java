package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.EventCreateDTO;
import at.htlkaindorf.backend.dtos.EventDTO;
import at.htlkaindorf.backend.models.documents.Event;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface EventMapper {
    EventDTO toDTO(Event event);

    Event toEntity(EventDTO dto);

    Event createDTOtoEntity(EventCreateDTO dto);
}
