package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.mapper.MongoIdMapper;
import at.htlkaindorf.backend.mapper.ObjectMapper;
import at.htlkaindorf.backend.mapper.RoomMapper;
import at.htlkaindorf.backend.models.documents.ObjectRoomAssignment;
import at.htlkaindorf.backend.models.documents.Room;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.repositories.CardRepository;
import at.htlkaindorf.backend.repositories.ObjectRoomAssignmentRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;
    private final ObjectRepository objectRepository;
    private final CardRepository cardRepository;
    private final ObjectMapper objectMapper;
    private final ObjectRoomAssignmentRepository assignmentRepository;
    private final RoomMapper roomMapper;
    private final MongoIdMapper mongoIdMapper;

    public List<RoomDTO> getAllRoomsFromEvent(String eventId) {
        ObjectId eventObjectId = new ObjectId(eventId);

        List<Room> rooms = roomRepository.findByEventIdIn(Arrays.asList(null, eventObjectId));

        List<RoomDTO> roomDTOS = rooms.stream()
                .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                .collect(Collectors.toList());

        return enrichRoomsWithAssignedObjects(roomDTOS, eventObjectId);
    }

    public List<RoomDTO> getAllRoomsByCardId(String cardId, String eventId) {
        ObjectId cardObjectId = new ObjectId(cardId);
        ObjectId eventObjectId = new ObjectId(eventId);

        List<Room> rooms = roomRepository.findByCardIdAndEventIdIn(cardObjectId, Arrays.asList(null, eventObjectId));

        List<RoomDTO> roomDTOS = rooms.stream()
                .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                .collect(Collectors.toList());

        return enrichRoomsWithAssignedObjects(roomDTOS, eventObjectId);
    }

    public RoomDetailedDTO getRoomWithDetails(String roomId, String eventId) {
        Room room = roomRepository.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        RoomDetailedDTO roomDetailedDTO = roomMapper.roomToRoomDetailedDTO(room, objectMapper);

        // Verwende die wiederverwendbare Methode
        List<ObjectDocument> assignedObjects = getAssignedObjectsForRoom(new ObjectId(roomId), new ObjectId(eventId));
        roomDetailedDTO.setAssignedObjects(objectMapper.objectsToObjectDTOs(assignedObjects));

        return roomDetailedDTO;
    }

    public RoomDetailedDTO getRoomWithObjectsByType(String roomId, String objectTypeId, String eventId) {
        Room room = roomRepository.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        // Holte alle zugewiesenen Objects für diesen Raum und Event
        List<ObjectDocument> allAssignedObjects = getAssignedObjectsForRoom(
                new ObjectId(roomId),
                new ObjectId(eventId)
        );

        // Filtere nach Typ
        ObjectId typeObjectId = new ObjectId(objectTypeId);
        List<ObjectDocument> filteredObjects = allAssignedObjects.stream()
                .filter(obj -> typeObjectId.equals(obj.getTypeId()))
                .collect(Collectors.toList());

        Room filteredRoom = new Room();
        filteredRoom.setId(room.getId());
        filteredRoom.setRoomNumber(room.getRoomNumber());
        filteredRoom.setName(room.getName());
        filteredRoom.setX(room.getX());
        filteredRoom.setY(room.getY());
        filteredRoom.setWidth(room.getWidth());
        filteredRoom.setHeight(room.getHeight());

        RoomDetailedDTO roomDetailedDTO = roomMapper.roomToRoomDetailedDTO(filteredRoom, objectMapper);
        roomDetailedDTO.setAssignedObjects(objectMapper.objectsToObjectDTOs(filteredObjects));

        return roomDetailedDTO;
    }

    @Transactional
    public RoomDTO createRoom(CreateRoomRequestDTO request, String cardId) {
        System.out.println(request.toString());
        Room room = roomMapper.createRoomRequestDTOToRoom(request);
        room.setCardId(cardRepository.findCardById(new ObjectId(cardId)).orElseThrow(() -> new IllegalArgumentException("Card with id: " + cardId + " not found.")).getId());
        Room savedRoom = roomRepository.save(room);
        return roomMapper.roomToRoomDTO(savedRoom, mongoIdMapper);
    }

    @Transactional
    public void deleteRoom(String roomId) {
        ObjectId roomObjectId = new ObjectId(roomId);

        Room room = roomRepository.findById(roomObjectId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Room with id: " + roomId + " not found."
                ));

        assignmentRepository.deleteByRoomId(roomObjectId);

        roomRepository.delete(room);

        log.info("Room {} and its assignments successfully deleted", roomId);
    }


    @Transactional
    public RoomDTO updateRoom(String roomId, CreateRoomRequestDTO request) {
        Room existingRoom = roomRepository.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

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
    public void removeObjectFromRoom(String objectId, String roomId, String eventId) {
        ObjectId objectObjectId = new ObjectId(objectId);
        ObjectId roomObjectId = new ObjectId(roomId);
        ObjectId eventObjectId = new ObjectId(eventId);

        // Finde das Assignment für diesen Raum und Event
        Optional<ObjectRoomAssignment> assignment = assignmentRepository
                .findByRoomIdAndEventId(roomObjectId, eventObjectId);

        if (assignment.isPresent()) {
            ObjectRoomAssignment assignmentDoc = assignment.get();

            // Entferne das Object aus der Liste
            boolean removed = assignmentDoc.getObjectIds().remove(objectObjectId);

            if (removed) {
                // Wenn die Liste jetzt leer ist, lösche das Assignment
                if (assignmentDoc.getObjectIds().isEmpty()) {
                    assignmentRepository.delete(assignmentDoc);
                } else {
                    assignmentRepository.save(assignmentDoc);
                }
            }
        }
    }

    private List<RoomDTO> enrichRoomsWithAssignedObjects(List<RoomDTO> roomDTOs, ObjectId eventId) {
        // Optimierte Batch-Abfrage für alle Räume
        List<ObjectId> roomIds = roomDTOs.stream()
                .map(roomDTO -> new ObjectId(roomDTO.getId()))
                .collect(Collectors.toList());

        // Hole alle Assignments für diese Räume und Event
        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByEventIdAndRoomIdIn(eventId, roomIds);

        // Erstelle Map für schnellen Zugriff
        Map<ObjectId, List<String>> assignmentsByRoomId = assignments.stream()
                .collect(Collectors.toMap(
                        ObjectRoomAssignment::getRoomId,
                        assignment -> assignment.getObjectIds().stream()
                                .map(ObjectId::toString)
                                .collect(Collectors.toList())
                ));

        // Weise Object-IDs zu
        roomDTOs.forEach(roomDTO -> {
            ObjectId roomObjectId = new ObjectId(roomDTO.getId());
            List<String> assignedObjectIds = assignmentsByRoomId
                    .getOrDefault(roomObjectId, Collections.emptyList());
            roomDTO.setAssignedObjectIds(assignedObjectIds);
        });

        return roomDTOs;
    }

    /**
     * Holt alle zugewiesenen Object-Dokumente für einen spezifischen Raum und Event.
     * Wiederverwendbar für getRoomWithDetails und getRoomWithObjectsByType.
     */
    private List<ObjectDocument> getAssignedObjectsForRoom(ObjectId roomId, ObjectId eventId) {

        Optional<ObjectRoomAssignment> assignment = assignmentRepository
                .findByRoomIdAndEventId(roomId, eventId);

        if (assignment.isPresent()) {
            List<ObjectId> objectIds = assignment.get().getObjectIds();
            if (!objectIds.isEmpty()) {

                return objectRepository.findAllByIdIn(objectIds);
            }
        }

        return Collections.emptyList();
    }
}