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

    RoomDTO roomToRoomDTO(Room room, @Context MongoIdMapper mongoIdMapper);

    RoomDetailedDTO roomToRoomDetailedDTO(Room room, @Context ObjectMapper objectMapper);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomNumber", source = "roomNumber")
    Room createRoomRequestDTOToRoom(CreateRoomRequestDTO request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "roomNumber", source = "request.roomNumber")
    Room updateRoomRequestDTOToRoom(String id, CreateRoomRequestDTO request);
}