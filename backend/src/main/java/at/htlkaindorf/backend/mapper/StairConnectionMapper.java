package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.StairConnectionDTO;
import at.htlkaindorf.backend.models.documents.StairConnection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface StairConnectionMapper {
    StairConnectionDTO toDto(StairConnection stairConnection);

    StairConnection toEntity(StairConnectionDTO dto);
}
