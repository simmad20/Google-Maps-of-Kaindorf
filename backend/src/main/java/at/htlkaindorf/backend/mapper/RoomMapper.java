package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.models.documents.Room;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ObjectMapper.class, MongoIdMapper.class})
public interface RoomMapper {

    @Mapping(
            target = "assignedObjectIds",
            expression = "java(mapAssignedObjectIds(room.getAssignedObjects(), mongoIdMapper))"
    )
    @Mapping(target = "cardId", source = "card.id")
    RoomDTO roomToRoomDTO(Room room, @Context MongoIdMapper mongoIdMapper);

    @Mapping(target = "assignedObjects", expression = "java(objectMapper.objectsToObjectDTOs(room.getAssignedObjects()))")
    @Mapping(target = "cardId", source = "card.id")
    RoomDetailedDTO roomToRoomDetailedDTO(Room room, @Context ObjectMapper objectMapper);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomNumber", source = "roomNumber")
    @Mapping(target = "assignedObjects", ignore = true)
    Room createRoomRequestDTOToRoom(CreateRoomRequestDTO request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "roomNumber", source = "request.roomNumber")
    @Mapping(target = "assignedObjects", ignore = true)
    Room updateRoomRequestDTOToRoom(String id, CreateRoomRequestDTO request);

    default List<String> mapAssignedObjectIds(
            List<ObjectDocument> objects,
            MongoIdMapper mongoIdMapper
    ) {
        if (objects == null) return List.of();

        return objects.stream()
                .map(ObjectDocument::getId)
                .map(mongoIdMapper::asString)
                .toList();
    }
}