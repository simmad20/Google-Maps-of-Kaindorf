package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.EventCreateDTO;
import at.htlkaindorf.backend.dtos.EventDTO;
import at.htlkaindorf.backend.models.documents.Event;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface EventMapper {
    EventDTO toDTO(Event event);

    Event toEntity(EventDTO dto);

    Event createDTOtoEntity(EventCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(EventDTO dto, @MappingTarget Event entity);
}
