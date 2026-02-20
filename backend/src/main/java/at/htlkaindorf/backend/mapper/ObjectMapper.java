package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.dtos.ObjectDTO;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface ObjectMapper {

    ObjectDTO objectToObjectDTO(ObjectDocument object);

    // Methode für List-Mapping hinzufügen
    default List<ObjectDTO> objectsToObjectDTOs(List<ObjectDocument> objects) {
        if (objects == null) return List.of();
        return objects.stream()
                .map(this::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(ObjectDTO dto, @MappingTarget ObjectDocument entity);
}