package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
import at.htlkaindorf.backend.mapper.MongoIdMapper;
import at.htlkaindorf.backend.mapper.ObjectMapper;
import at.htlkaindorf.backend.mapper.RoomMapper;
import at.htlkaindorf.backend.models.documents.Room;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.repositories.CardRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;
    private final ObjectRepository objectRepository;
    private final CardRepository cardRepository;
    private final ObjectMapper objectMapper;
    private final RoomMapper roomMapper;
    private final MongoIdMapper mongoIdMapper;

    public List<RoomDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getAllRoomsByCardId(String cardId) {
        return roomRepository.findAllByCardId(new ObjectId(cardId))
                .stream().map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                .collect(Collectors.toList());
    }

    public RoomDetailedDTO getRoomWithDetails(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));
        return roomMapper.roomToRoomDetailedDTO(room, objectMapper);
    }

    public RoomDetailedDTO getRoomWithObjectsByType(String roomId, String objectTypeId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        // Filtere Objekte nach Typ
        Room filteredRoom = new Room();
        filteredRoom.setId(room.getId());
        filteredRoom.setRoomNumber(room.getRoomNumber());
        filteredRoom.setName(room.getName());
        filteredRoom.setX(room.getX());
        filteredRoom.setY(room.getY());
        filteredRoom.setWidth(room.getWidth());
        filteredRoom.setHeight(room.getHeight());

        List<ObjectDocument> filteredObjects = room.getAssignedObjects().stream()
                .filter(obj -> new ObjectId(objectTypeId).equals(obj.getType().getId()))
                .collect(Collectors.toList());
        filteredRoom.setAssignedObjects(filteredObjects);

        return roomMapper.roomToRoomDetailedDTO(filteredRoom, objectMapper);
    }

    @Transactional
    public RoomDTO createRoom(CreateRoomRequestDTO request, String cardId) {
        System.out.println(request.toString());
        Room room = roomMapper.createRoomRequestDTOToRoom(request);
        room.setAssignedObjects(new ArrayList<>());
        room.setCard(cardRepository.findCardById(new ObjectId(cardId)).orElseThrow(() -> new IllegalArgumentException("Karte nicht gefunden: " + cardId)));
        Room savedRoom = roomRepository.save(room);
        return roomMapper.roomToRoomDTO(savedRoom, mongoIdMapper);
    }

    @Transactional
    public void deleteRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        // Entferne Raum-Referenzen von allen zugeordneten Objekten
        room.getAssignedObjects().forEach(object -> {
            object.setAssignedRoom(null);
            objectRepository.save(object);
        });

        roomRepository.delete(room);
    }

    @Transactional
    public RoomDTO updateRoom(String roomId, CreateRoomRequestDTO request) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        existingRoom.setRoomNumber(request.getRoomNumber());
        existingRoom.setName(request.getName());
        existingRoom.setX(request.getX());
        existingRoom.setY(request.getY());
        existingRoom.setWidth(request.getWidth());
        existingRoom.setHeight(request.getHeight());

        Room updatedRoom = roomRepository.save(existingRoom);
        return roomMapper.roomToRoomDTO(updatedRoom, mongoIdMapper);
    }

    @Transactional
    public void removeObjectFromRoom(String roomId, String objectId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        boolean removed = room.getAssignedObjects().removeIf(obj ->
                obj.getId().equals(new ObjectId(objectId)));

        if (!removed) {
            throw new IllegalArgumentException("Objekt ist diesem Raum nicht zugeordnet");
        }

        // Entferne Raum-Referenz vom Objekt
        ObjectDocument object = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden"));
        object.setAssignedRoom(null);

        roomRepository.save(room);
        objectRepository.save(object);
    }

    public List<ObjectDocument> getObjectsInRoomByType(String roomId, String objectTypeId) {
        Room room = getRoomWithDetailsEntity(roomId);
        return room.getAssignedObjects().stream()
                .filter(obj -> new ObjectId(objectTypeId).equals(obj.getType().getId()))
                .collect(Collectors.toList());
    }

    private Room getRoomWithDetailsEntity(String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));
    }
}