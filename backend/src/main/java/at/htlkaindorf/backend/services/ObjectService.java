package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.ObjectDTO;
import at.htlkaindorf.backend.mapper.ObjectMapper;
import at.htlkaindorf.backend.models.AllowedAttribute;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.ObjectType;
import at.htlkaindorf.backend.models.documents.Room;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
    private final MongoTemplate mongoTemplate;

    public ObjectDTO createObject(String typeId, Map<String, Object> attributes) {
        ObjectType objectType = objectTypeRepository.findById(new ObjectId(typeId))
                .orElseThrow(() -> new IllegalArgumentException("Unbekannter Objekttyp: " + typeId));

        validateAttributes(attributes, objectType);

        ObjectDocument object = ObjectDocument.builder()
                .type(objectType)
                .attributes(attributes)
                .build();

        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    public ObjectDTO updateObject(String objectId, Map<String, Object> attributes) {
        ObjectDocument existingObject = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt mit der Id " + objectId + " nicht gefunden"));

        validateAttributes(attributes, existingObject.getType());

        existingObject.setAttributes(attributes);
        ObjectDocument updatedObject = objectRepository.save(existingObject);
        return objectMapper.objectToObjectDTO(updatedObject);
    }

    public List<ObjectDTO> getObjectsByType(String typeId) {
        List<ObjectDocument> objects = objectRepository.findByTypeIdSorted(new ObjectId(typeId));
        return objects.stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public List<ObjectDTO> searchObjects(
            String typeId,
            String search
    ) {
        ObjectType type = objectTypeRepository.findById(new ObjectId(typeId))
                .orElseThrow(() -> new RuntimeException("ObjectType not found"));

        List<String> searchableKeys = type.getAllowedAttributes().stream()
                .filter(a -> Boolean.TRUE.equals(a.getSearchable()))
                .map(AllowedAttribute::getKey)
                .toList();

        Criteria criteria = Criteria.where("type.$id").is(typeId);

        if (search != null && !search.isBlank() && !searchableKeys.isEmpty()) {
            List<Criteria> orCriteria = searchableKeys.stream()
                    .map(key ->
                            Criteria.where("attributes." + key)
                                    .regex(search, "i") // case-insensitive
                    )
                    .toList();

            criteria = criteria.andOperator(
                    new Criteria().orOperator(orCriteria)
            );
        }

        Query query = new Query(criteria);

        List<ObjectDocument> searchedObjects = mongoTemplate.find(query, ObjectDocument.class);

        return objectMapper.objectsToObjectDTOs(searchedObjects);
    }

    public ObjectDTO getObjectById(String id) {
        ObjectDocument object = objectRepository.findById(new ObjectId(id))
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden"));
        return objectMapper.objectToObjectDTO(object);
    }

    @Transactional
    public ObjectDTO assignObjectToRoom(String objectId, String roomId) {
        ObjectDocument object = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

        Room room = roomRepository.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Raum nicht gefunden: " + roomId));

        // Entferne Objekt vom bisherigen Raum
        Room previousRoom = roomRepository.findRoomByObjectId(new ObjectId(objectId)).orElse(null);
        if (previousRoom != null) {
            log.info(previousRoom.toString());
            previousRoom.getAssignedObjects().removeIf(obj -> obj.getId().equals(new ObjectId(objectId)));
            roomRepository.save(previousRoom);
        }

        // Füge Objekt zum neuen Raum hinzu
        if (room.getAssignedObjects().stream().noneMatch(obj -> obj.getId().equals(new ObjectId(objectId)))) {
            room.getAssignedObjects().add(object);
        }

        object.setAssignedRoom(room);

        roomRepository.save(room);
        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    @Transactional
    public void deleteObject(String objectId) {
        ObjectDocument object = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

        // Entferne Objekt von allen Räumen
        Room assignedRoom = roomRepository.findRoomByObjectId(new ObjectId(objectId)).orElse(null);
        if (assignedRoom != null) {
            assignedRoom.getAssignedObjects().removeIf(obj -> obj.getId().equals(new ObjectId(objectId)));
            roomRepository.save(assignedRoom);
        }

        objectRepository.delete(object);
    }

    private void validateAttributes(Map<String, Object> attributes, ObjectType objectType) {
        List<String> allowedKeys = objectType.getAllowedAttributes().stream()
                .map(AllowedAttribute::getKey)
                .toList();

        for (String key : attributes.keySet()) {
            if (!allowedKeys.contains(key)) {
                throw new IllegalArgumentException(
                        String.format(
                                "Ungültiges Attribut '%s' für Typ '%s'. Erlaubte Attribute: %s",
                                key,
                                objectType.getName(),
                                allowedKeys
                        )
                );
            }
        }
    }
}