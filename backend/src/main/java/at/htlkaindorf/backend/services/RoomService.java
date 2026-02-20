package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.RoomDTO;
import at.htlkaindorf.backend.dtos.RoomDetailedDTO;
import at.htlkaindorf.backend.dtos.CreateRoomRequestDTO;
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
    private final AuthContext authContext;

    public List<RoomDTO> getAllRoomsFromEvent(String eventId) {
        List<Room> rooms;

        if (eventId != null && !eventId.isBlank()) {
            // Event-scoped: include event rooms + global rooms (eventId = null in DB)
            ObjectId eventObjectId = new ObjectId(eventId);
            rooms = roomRepository.findByEventIdInAndTenantId(
                    Arrays.asList(null, eventObjectId),
                    authContext.getTenantObjectId()
            );
            List<RoomDTO> roomDTOs = rooms.stream()
                    .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                    .collect(Collectors.toList());
            return enrichRoomsWithAssignedObjects(roomDTOs, eventObjectId);
        } else {
            // No event: return all rooms of this tenant without assignment enrichment
            rooms = roomRepository.findByTenantId(authContext.getTenantObjectId());
            return rooms.stream()
                    .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                    .collect(Collectors.toList());
        }
    }

    public List<RoomDTO> getAllRoomsByCardId(String cardId, String eventId) {
        ObjectId cardObjectId = new ObjectId(cardId);
        List<Room> rooms;

        if (eventId != null && !eventId.isBlank()) {
            ObjectId eventObjectId = new ObjectId(eventId);
            rooms = roomRepository.findByCardIdAndEventIdInAndTenantId(
                    cardObjectId,
                    Arrays.asList(null, eventObjectId),
                    authContext.getTenantObjectId()
            );
            List<RoomDTO> roomDTOs = rooms.stream()
                    .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                    .collect(Collectors.toList());
            return enrichRoomsWithAssignedObjects(roomDTOs, eventObjectId);
        } else {
            rooms = roomRepository.findByCardIdAndTenantId(cardObjectId, authContext.getTenantObjectId());
            return rooms.stream()
                    .map(room -> roomMapper.roomToRoomDTO(room, mongoIdMapper))
                    .collect(Collectors.toList());
        }
    }

    public RoomDetailedDTO getRoomWithDetails(String roomId, String eventId) {
        Room room = roomRepository.findByIdAndTenantId(new ObjectId(roomId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        RoomDetailedDTO roomDetailedDTO = roomMapper.roomToRoomDetailedDTO(room, objectMapper);

        if (eventId != null && !eventId.isBlank()) {
            List<ObjectDocument> assignedObjects = getAssignedObjectsForRoom(
                    new ObjectId(roomId), new ObjectId(eventId)
            );
            roomDetailedDTO.setAssignedObjects(objectMapper.objectsToObjectDTOs(assignedObjects));
        } else {
            roomDetailedDTO.setAssignedObjects(Collections.emptyList());
        }

        return roomDetailedDTO;
    }

    public RoomDetailedDTO getRoomWithObjectsByType(String roomId, String objectTypeId, String eventId) {
        Room room = roomRepository.findByIdAndTenantId(new ObjectId(roomId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        List<ObjectDocument> filteredObjects = Collections.emptyList();

        if (eventId != null && !eventId.isBlank()) {
            List<ObjectDocument> allAssignedObjects = getAssignedObjectsForRoom(
                    new ObjectId(roomId), new ObjectId(eventId)
            );
            ObjectId typeObjectId = new ObjectId(objectTypeId);
            filteredObjects = allAssignedObjects.stream()
                    .filter(obj -> typeObjectId.equals(obj.getTypeId()))
                    .collect(Collectors.toList());
        }

        Room filteredRoom = new Room();
        filteredRoom.setId(room.getId());
        filteredRoom.setRoomNumber(room.getRoomNumber());
        filteredRoom.setName(room.getName());
        filteredRoom.setX(room.getX());
        filteredRoom.setY(room.getY());
        filteredRoom.setWidth(room.getWidth());
        filteredRoom.setHeight(room.getHeight());

        RoomDetailedDTO dto = roomMapper.roomToRoomDetailedDTO(filteredRoom, objectMapper);
        dto.setAssignedObjects(objectMapper.objectsToObjectDTOs(filteredObjects));
        return dto;
    }

    @Transactional
    public RoomDTO createRoom(CreateRoomRequestDTO request, String cardId) {
        Room room = roomMapper.createRoomRequestDTOToRoom(request);
        room.setCardId(cardRepository
                .findCardByIdAndTenantId(new ObjectId(cardId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Card with id: " + cardId + " not found."))
                .getId());
        room.setTenantId(authContext.getTenantObjectId());
        Room savedRoom = roomRepository.save(room);
        return roomMapper.roomToRoomDTO(savedRoom, mongoIdMapper);
    }

    @Transactional
    public void deleteRoom(String roomId) {
        ObjectId roomObjectId = new ObjectId(roomId);
        Room room = roomRepository.findByIdAndTenantId(roomObjectId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));
        assignmentRepository.deleteByRoomIdAndTenantId(roomObjectId, authContext.getTenantObjectId());
        roomRepository.delete(room);
        log.info("Room {} and its assignments deleted", roomId);
    }

    @Transactional
    public RoomDTO updateRoom(String roomId, CreateRoomRequestDTO request) {
        Room existingRoom = roomRepository.findByIdAndTenantId(new ObjectId(roomId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        existingRoom.setRoomNumber(request.getRoomNumber());
        existingRoom.setName(request.getName());
        existingRoom.setX(request.getX());
        existingRoom.setY(request.getY());
        existingRoom.setWidth(request.getWidth());
        existingRoom.setHeight(request.getHeight());

        return roomMapper.roomToRoomDTO(roomRepository.save(existingRoom), mongoIdMapper);
    }

    @Transactional
    public void removeObjectFromRoom(String objectId, String roomId, String eventId) {
        ObjectId objectObjectId = new ObjectId(objectId);
        ObjectId roomObjectId   = new ObjectId(roomId);
        ObjectId eventObjectId  = new ObjectId(eventId);

        Optional<ObjectRoomAssignment> assignment = assignmentRepository
                .findByRoomIdAndEventIdAndTenantId(roomObjectId, eventObjectId, authContext.getTenantObjectId());

        assignment.ifPresent(doc -> {
            doc.getObjectIds().remove(objectObjectId);
            if (doc.getObjectIds().isEmpty()) {
                assignmentRepository.delete(doc);
            } else {
                assignmentRepository.save(doc);
            }
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private List<RoomDTO> enrichRoomsWithAssignedObjects(List<RoomDTO> roomDTOs, ObjectId eventId) {
        List<ObjectId> roomIds = roomDTOs.stream()
                .map(dto -> new ObjectId(dto.getId()))
                .collect(Collectors.toList());

        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByEventIdAndRoomIdInAndTenantId(eventId, roomIds, authContext.getTenantObjectId());

        Map<ObjectId, List<String>> assignmentsByRoomId = assignments.stream()
                .collect(Collectors.toMap(
                        ObjectRoomAssignment::getRoomId,
                        a -> a.getObjectIds().stream()
                                .map(ObjectId::toString)
                                .collect(Collectors.toList())
                ));

        roomDTOs.forEach(dto -> {
            List<String> ids = assignmentsByRoomId.getOrDefault(
                    new ObjectId(dto.getId()), Collections.emptyList()
            );
            dto.setAssignedObjectIds(ids);
        });

        return roomDTOs;
    }

    private List<ObjectDocument> getAssignedObjectsForRoom(ObjectId roomId, ObjectId eventId) {
        return assignmentRepository
                .findByRoomIdAndEventIdAndTenantId(roomId, eventId, authContext.getTenantObjectId())
                .map(doc -> {
                    if (doc.getObjectIds().isEmpty()) return Collections.<ObjectDocument>emptyList();
                    return objectRepository.findAllByIdInAndTenantId(doc.getObjectIds(), authContext.getTenantObjectId());
                })
                .orElse(Collections.emptyList());
    }
}