package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
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
    private final AuthContext authContext;

    private ObjectType findTypeById(ObjectId typeId) {
        return objectTypeRepository.findByIdAndTenantId(typeId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Object type with id: " + typeId + " not found."));
    }

    public ObjectDTO createObject(String typeId, Map<String, Object> attributes) {
        ObjectType objectType = findTypeById(new ObjectId(typeId));
        validateAttributes(attributes, objectType);

        ObjectDocument object = ObjectDocument.builder()
                .typeId(objectType.getId())
                .attributes(attributes)
                .tenantId(authContext.getTenantObjectId())
                .build();

        return objectMapper.objectToObjectDTO(objectRepository.save(object));
    }

    public ObjectDTO updateObject(String objectId, Map<String, Object> attributes) {
        ObjectDocument existing = objectRepository
                .findByIdAndTenantId(new ObjectId(objectId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Object with id " + objectId + " not found."));

        validateAttributes(attributes, findTypeById(existing.getTypeId()));
        existing.setAttributes(attributes);
        return objectMapper.objectToObjectDTO(objectRepository.save(existing));
    }

    public List<ObjectDTO> getAllObjects() {
        return objectRepository.findByTenantId(authContext.getTenantObjectId())
                .stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public List<ObjectDTO> getObjectsByType(String typeId) {
        ObjectId typeObjectId = new ObjectId(typeId);

        ObjectType objectType = objectTypeRepository
                .findByIdAndTenantId(typeObjectId, authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Object type with id " + typeId + " not found."));

        List<String> sortableAttributes = objectType.getAllowedAttributes().stream()
                .filter(AllowedAttribute::getSortable)
                .map(attr -> "attributes." + attr.getKey())
                .collect(Collectors.toList());

        Sort sort = sortableAttributes.isEmpty()
                ? Sort.by(Sort.Direction.ASC, "attributes.name")
                : Sort.by(sortableAttributes.stream()
                .map(attr -> new Sort.Order(Sort.Direction.ASC, attr))
                .toArray(Sort.Order[]::new));

        return objectRepository.findByTypeIdSorted(typeObjectId, authContext.getTenantObjectId(), sort)
                .stream()
                .map(objectMapper::objectToObjectDTO)
                .collect(Collectors.toList());
    }

    public List<ObjectDTO> searchObjects(String typeId, String search) {
        ObjectType type = objectTypeRepository
                .findByIdAndTenantId(new ObjectId(typeId), authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Object type with id " + typeId + " not found."));

        List<String> searchableKeys = type.getAllowedAttributes().stream()
                .filter(a -> Boolean.TRUE.equals(a.getSearchable()))
                .map(AllowedAttribute::getKey)
                .toList();

        Criteria criteria = Criteria.where("type_id").is(new ObjectId(typeId))
                .and("tenant_id").is(authContext.getTenantObjectId());

        if (search != null && !search.isBlank() && !searchableKeys.isEmpty()) {
            List<Criteria> orCriteria = searchableKeys.stream()
                    .map(key -> Criteria.where("attributes." + key).regex(search, "i"))
                    .toList();
            criteria = criteria.andOperator(new Criteria().orOperator(orCriteria));
        }

        return objectMapper.objectsToObjectDTOs(mongoTemplate.find(new Query(criteria), ObjectDocument.class));
    }

    public ObjectDTO getObjectById(String id) {
        return objectMapper.objectToObjectDTO(
                objectRepository.findByIdAndTenantId(new ObjectId(id), authContext.getTenantObjectId())
                        .orElseThrow(() -> new IllegalArgumentException("Object with id: " + id + " not found."))
        );
    }

    @Transactional
    public ObjectDTO assignObjectToRoom(String objectId, String roomId, String eventId) {
        if (eventId == null || eventId.isBlank()) {
            throw new IllegalArgumentException(
                    "An event must be selected before assigning objects to rooms. eventId is required."
            );
        }

        ObjectDocument object = objectRepository
                .findByIdAndTenantId(new ObjectId(objectId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Object with id: " + objectId + " not found."));

        Room room = roomRepository
                .findByIdAndTenantId(new ObjectId(roomId), authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Room with id: " + roomId + " not found."));

        ObjectId eventObjectId = new ObjectId(eventId);

        Optional<ObjectRoomAssignment> existing = assignmentRepository
                .findByRoomIdAndEventIdAndTenantId(room.getId(), eventObjectId, authContext.getTenantObjectId());

        if (existing.isPresent()) {
            ObjectRoomAssignment assignment = existing.get();
            if (!assignment.getObjectIds().contains(object.getId())) {
                assignment.getObjectIds().add(object.getId());
                assignmentRepository.save(assignment);
            }
        } else {
            assignmentRepository.save(
                    ObjectRoomAssignment.builder()
                            .tenantId(object.getTenantId())
                            .eventId(eventObjectId)
                            .roomId(room.getId())
                            .objectIds(List.of(object.getId()))
                            .build()
            );
        }

        return objectMapper.objectToObjectDTO(object);
    }

    @Transactional
    public void deleteObject(String objectId) {
        ObjectId objectObjectId = new ObjectId(objectId);
        ObjectDocument object = objectRepository
                .findByIdAndTenantId(objectObjectId, authContext.getTenantObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Object with id: " + objectId + " not found."));

        removeObjectFromAllAssignments(objectId);
        objectRepository.delete(object);
        log.info("Object {} deleted", objectId);
    }

    /**
     * Removes an object from all room assignments within a specific event.
     * eventId is REQUIRED.
     *
     * @throws IllegalArgumentException if eventId is null or blank
     */
    @Transactional
    public void removeObjectFromAllRoomsInEvent(String objectId, String eventId) {
        if (eventId == null || eventId.isBlank()) {
            throw new IllegalArgumentException(
                    "eventId is required to remove an object from room assignments."
            );
        }

        ObjectId objectObjectId = new ObjectId(objectId);
        ObjectId eventObjectId  = new ObjectId(eventId);

        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByEventIdAndTenantId(eventObjectId, authContext.getTenantObjectId());

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
                throw new IllegalArgumentException(String.format(
                        "Invalid attribute '%s' for object type '%s'. Allowed: %s",
                        key, objectType.getName(), allowedKeys
                ));
            }
        }
    }

    private void removeObjectFromAllAssignments(String objectId) {
        ObjectId objectObjectId = new ObjectId(objectId);

        List<ObjectRoomAssignment> assignments = assignmentRepository
                .findByObjectIdsContainsAndTenantId(List.of(objectObjectId), authContext.getTenantObjectId());

        for (ObjectRoomAssignment assignment : assignments) {
            assignment.getObjectIds().remove(objectObjectId);
            if (assignment.getObjectIds().isEmpty()) {
                assignmentRepository.delete(assignment);
            } else {
                assignmentRepository.save(assignment);
            }
        }
    }
}