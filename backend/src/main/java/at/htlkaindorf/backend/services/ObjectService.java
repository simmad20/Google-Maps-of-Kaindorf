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

    private ObjectType findTypeById(ObjectId typeId) {
        return objectTypeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Unbekannter Objekttyp: " + typeId));
    }

    public ObjectDTO createObject(String typeId, Map<String, Object> attributes) {
        ObjectType objectType = findTypeById(new ObjectId(typeId));
        validateAttributes(attributes, objectType);

        ObjectDocument object = ObjectDocument.builder()
                .typeId(objectType.getId())
                .attributes(attributes)
                .build();

        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    public ObjectDTO updateObject(String objectId, Map<String, Object> attributes) {
        ObjectDocument existingObject = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt mit der Id " + objectId + " nicht gefunden"));
        ObjectType objectType = findTypeById(existingObject.getTypeId());
        validateAttributes(attributes, objectType);

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

        Criteria criteria = Criteria.where("type_id").is(new ObjectId(typeId));

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

        object.setAssignedRoomId(room.getId());

        roomRepository.save(room);
        ObjectDocument savedObject = objectRepository.save(object);
        return objectMapper.objectToObjectDTO(savedObject);
    }

    @Transactional
    public void deleteObject(String objectId) {
        ObjectDocument object = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Objekt nicht gefunden: " + objectId));

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