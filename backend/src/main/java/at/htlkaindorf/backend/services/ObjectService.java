package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.ObjectDTO;
import at.htlkaindorf.backend.mapper.ObjectMapper;
import at.htlkaindorf.backend.models.ObjectDocument;
import at.htlkaindorf.backend.models.ObjectType;
import at.htlkaindorf.backend.models.Room;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObjectService {

    private final ObjectRepository objectRepository;
    private final ObjectTypeRepository objectTypeRepository;
    private final RoomRepository roomRepository;
    private final ObjectMapper objectMapper;

    public ObjectDTO createObject(String typeId, Map<String, Object> attributes) {
        ObjectType objectType = objectTypeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Unbekannter Objekttyp: " + typeId));

        validateAttributes(attributes, objectType);

        ObjectDocument object = ObjectDocument.builder()
                .type(objectType.getDisplayName())
                .attributes(attributes)
                .build();

        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    public ObjectDTO updateObject(String objectId, String typeId, Map<String, Object> attributes) {
        ObjectDocument existingObject = objectRepository.findByIdAndType(objectId, typeId)
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

        ObjectType objectType = objectTypeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Unbekannter Objekttyp: " + typeId));

        validateAttributes(attributes, objectType);

        existingObject.setAttributes(attributes);
        ObjectDocument updatedObject = objectRepository.save(existingObject);
        return objectMapper.objectToObjectDTO(updatedObject);
    }

    public List<ObjectDTO> getObjectsByType(String type) {
        List<ObjectDocument> objects = objectRepository.findTeachersSortedByLastname(type);
        return objects.stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public ObjectDTO getObjectByIdAndType(String id, String type) {
        ObjectDocument object = objectRepository.findByIdAndType(id, type)
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden"));
        return objectMapper.objectToObjectDTO(object);
    }

    @Transactional
    public ObjectDTO assignObjectToRoom(String objectId, String type, String roomId) {
        ObjectDocument object = objectRepository.findByIdAndType(objectId, type)
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        // Entferne Objekt vom bisherigen Raum
        Room previousRoom = roomRepository.findRoomByObjectId(new ObjectId(objectId)).orElse(null);
        if (previousRoom != null) {
            previousRoom.getAssignedObjects().removeIf(obj -> obj.getId().equals(objectId));
            roomRepository.save(previousRoom);
        }

        // Füge Objekt zum neuen Raum hinzu
        if (room.getAssignedObjects().stream().noneMatch(obj -> obj.getId().equals(objectId))) {
            room.getAssignedObjects().add(object);
        }

        object.setAssignedRoom(room);

        roomRepository.save(room);
        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    @Transactional
    public void deleteObject(String objectId, String type) {
        ObjectDocument object = objectRepository.findByIdAndType(objectId, type)
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

        // Entferne Objekt von allen Räumen
        Room assignedRoom = roomRepository.findRoomByObjectId(new ObjectId(objectId)).orElse(null);
        if (assignedRoom != null) {
            assignedRoom.getAssignedObjects().removeIf(obj -> obj.getId().equals(objectId));
            roomRepository.save(assignedRoom);
        }

        objectRepository.delete(object);
    }

    private void validateAttributes(Map<String, Object> attributes, ObjectType objectType) {
        for (String key : attributes.keySet()) {
            if (!objectType.getAllowedAttributes().contains(key)) {
                throw new IllegalArgumentException(
                        String.format("Ungültiges Attribut '%s' für Typ '%s'. Erlaubte Attribute: %s",
                                key, objectType.getDisplayName(), objectType.getAllowedAttributes())
                );
            }
        }
    }

    public List<ObjectDTO> searchTeachers(String searchTerm) {
        List<ObjectDocument> teachers = objectRepository.findTeachersBySearchTerm(searchTerm);
        return teachers.stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }
}