package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.ObjectDTO;
import at.htlkaindorf.backend.mapper.ObjectMapper;
import at.htlkaindorf.backend.models.AllowedAttribute;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.ObjectRoomAssignment;
import at.htlkaindorf.backend.models.documents.ObjectType;
import at.htlkaindorf.backend.models.documents.Room;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.ObjectRoomAssignmentRepository;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObjectService {

    private final ObjectRepository objectRepository;
    private final ObjectTypeRepository objectTypeRepository;
    private final ObjectRoomAssignmentRepository assignmentRepository;
    private final RoomRepository roomRepository;
    private final ObjectMapper objectMapper;
    private final MongoTemplate mongoTemplate;

    private ObjectType findTypeById(ObjectId typeId) {
        return objectTypeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Object type with id: " + typeId + " not found."));
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
                .orElseThrow(() -> new IllegalArgumentException("Object with id " + objectId + " not found"));
        ObjectType objectType = findTypeById(existingObject.getTypeId());
        validateAttributes(attributes, objectType);

        existingObject.setAttributes(attributes);
        ObjectDocument updatedObject = objectRepository.save(existingObject);
        return objectMapper.objectToObjectDTO(updatedObject);
    }

    public List<ObjectDTO> getAllObjects() {
        List<ObjectDocument> objects = objectRepository.findAll().stream().toList();

        return objects.stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public List<ObjectDTO> getObjectsByType(String typeId) {
        ObjectId typeObjectId = new ObjectId(typeId);

        ObjectType objectType = objectTypeRepository.findById(typeObjectId)
                .orElseThrow(() -> new RuntimeException("Object type with id " + typeId + " not found."));

        List<String> sortableAttributes = objectType.getAllowedAttributes().stream()
                .filter(AllowedAttribute::getSortable)
                .map(attr -> "attributes." + attr.getKey())
                .collect(Collectors.toList());

        Sort sort;
        if (!sortableAttributes.isEmpty()) {
            Sort.Order[] orders = sortableAttributes.stream()
                    .map(attr -> new Sort.Order(Sort.Direction.ASC, attr))
                    .toArray(Sort.Order[]::new);
            sort = Sort.by(orders);
        } else {
            sort = Sort.by(Sort.Direction.ASC, "attributes.name");
        }

        // Führe die Abfrage mit dynamischer Sortierung aus
        List<ObjectDocument> objects = objectRepository.findByTypeIdSorted(typeObjectId, sort);

        return objects.stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public List<ObjectDTO> searchObjects(
            String typeId,
            String search
    ) {
        ObjectType type = objectTypeRepository.findById(new ObjectId(typeId))
                .orElseThrow(() -> new RuntimeException("Object type with id " + typeId + " not found."));

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
                .orElseThrow(() -> new IllegalArgumentException("Object with id: " + id + " not found."));
        return objectMapper.objectToObjectDTO(object);
    }

    @Transactional
    public ObjectDTO assignObjectToRoom(String objectId, String roomId, String eventId) {
        // Prüfen, ob Object und Room existieren
        ObjectDocument object = objectRepository.findById(new ObjectId(objectId))
                .orElseThrow(() -> new IllegalArgumentException("Object with id: " + objectId + " not found."));

        Room room = roomRepository.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        ObjectId eventObjectId = new ObjectId(eventId);

        // 1. Prüfen, ob bereits ein Assignment für diesen Raum und Event existiert
        Optional<ObjectRoomAssignment> existingAssignment = assignmentRepository
                .findByRoomIdAndEventId(room.getId(), eventObjectId);

        if (existingAssignment.isPresent()) {
            // Bestehendes Assignment aktualisieren und Object hinzufügen, falls noch nicht vorhanden
            ObjectRoomAssignment assignment = existingAssignment.get();
            if (!assignment.getObjectIds().contains(object.getId())) {
                assignment.getObjectIds().add(object.getId());
                assignmentRepository.save(assignment);
            }
        } else {
            // Neues Assignment erstellen
            ObjectRoomAssignment newAssignment = ObjectRoomAssignment.builder()
                    .tenantId(object.getTenantId())
                    .eventId(eventObjectId)
                    .roomId(room.getId())
                    .objectIds(List.of(object.getId()))
                    .build();
            assignmentRepository.save(newAssignment);
        }

        // 2. Object wird NICHT aktualisiert, da es keine direkte Room-Referenz mehr hat
        return objectMapper.objectToObjectDTO(object);
    }

    @Transactional
    public void deleteObject(String objectId) {
        ObjectId objectObjectId = new ObjectId(objectId);

        ObjectDocument object = objectRepository.findById(objectObjectId)
                .orElseThrow(() -> new IllegalArgumentException("Object with id: " + objectId + " not found."));

        // Object aus ALLEN Assignments in ALLEN Events entfernen
        removeObjectFromAllAssignments(objectId);

        objectRepository.delete(object);
    }

    @Transactional
    public void removeObjectFromAllRoomsInEvent(String objectId, String eventId) {
        ObjectId objectObjectId = new ObjectId(objectId);
        ObjectId eventObjectId = new ObjectId(eventId);

        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByEventId(eventObjectId);

        for (ObjectRoomAssignment assignment : assignments) {
            assignment.getObjectIds().remove(objectObjectId);

            if (assignment.getObjectIds().isEmpty()) {
                assignmentRepository.delete(assignment);
            } else {
                assignmentRepository.save(assignment);
            }
        }
    }

    private void validateAttributes(Map<String, Object> attributes, ObjectType objectType) {
        List<String> allowedKeys = objectType.getAllowedAttributes().stream()
                .map(AllowedAttribute::getKey)
                .toList();

        for (String key : attributes.keySet()) {
            if (!allowedKeys.contains(key)) {
                throw new IllegalArgumentException(
                        String.format(
                                "Invalid attribute '%s' for Object type '%s'. Valid attributes: %s",
                                key,
                                objectType.getName(),
                                allowedKeys
                        )
                );
            }
        }
    }

    private void removeObjectFromAllAssignments(String objectId) {
        ObjectId objectObjectId = new ObjectId(objectId);

        // Finde alle Assignments, die dieses Object enthalten
        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByObjectIdsContains(objectObjectId);

        // Entferne das Object aus allen Assignments
        for (ObjectRoomAssignment assignment : assignments) {
            assignment.getObjectIds().remove(objectObjectId);

            // Wenn das Assignment jetzt leer ist, lösche es
            if (assignment.getObjectIds().isEmpty()) {
                assignmentRepository.delete(assignment);
            } else {
                assignmentRepository.save(assignment);
            }
        }
    }

}