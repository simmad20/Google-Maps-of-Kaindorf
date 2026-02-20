package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.NavNodeDTO;
import at.htlkaindorf.backend.models.NodeType;
import at.htlkaindorf.backend.models.documents.NavNode;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MongoIdMapper.class)
public interface NavNodeMapper {
    @Mapping(target = "type", expression = "java(navNode.getType().name())")
    NavNodeDTO toDto(NavNode navNode);

    @Mapping(target = "type", expression = "java(mapStringToNodeType(dto.getType()))")
    NavNode toEntity(NavNodeDTO dto);

    default NodeType mapStringToNodeType(String type) {
        if (type == null) return NodeType.NORMAL;
        return NodeType.valueOf(type);
    }
}
