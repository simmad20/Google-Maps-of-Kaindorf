package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.ObjectTypeCreateDTO;
import at.htlkaindorf.backend.dtos.ObjectTypeDTO;
import at.htlkaindorf.backend.models.documents.ObjectType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface ObjectTypeMapper {
    @Mapping(target = "allowedAttributes", source = "schema")
    ObjectType dtoToObjectType(ObjectTypeDTO objectTypeDTO);

    @Mapping(target = "allowedAttributes", source = "schema")
    ObjectType createDTOToObjectType(ObjectTypeCreateDTO objectTypeDTO);

    @Mapping(target = "schema", source = "allowedAttributes")
    ObjectTypeDTO entityToDTO(ObjectType objectType);
}
