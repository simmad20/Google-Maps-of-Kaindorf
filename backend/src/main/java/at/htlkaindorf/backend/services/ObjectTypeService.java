package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.ObjectTypeCreateDTO;
import at.htlkaindorf.backend.dtos.ObjectTypeDTO;
import at.htlkaindorf.backend.mapper.ObjectTypeMapper;
import at.htlkaindorf.backend.models.documents.ObjectDocument;
import at.htlkaindorf.backend.models.documents.ObjectRoomAssignment;
import at.htlkaindorf.backend.models.documents.ObjectType;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.ObjectRoomAssignmentRepository;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObjectTypeService {
    private final ObjectTypeRepository objectTypeRepository;
    private final ObjectRoomAssignmentRepository objectRoomAssignmentRepository;
    private final ObjectRepository objectRepository;
    private final ObjectTypeMapper objectTypeMapper;

    public List<ObjectTypeDTO> getAllObjectTypes() {
        return objectTypeRepository.findAll().stream().map(objectTypeMapper::entityToDTO)
                .collect(Collectors.toList());

    }

    public List<ObjectTypeDTO> getObjectTypesForEvent(String eventId) {

        // 1. Alle RoomAssignments für das Event laden
        List<ObjectRoomAssignment> assignments =
                objectRoomAssignmentRepository.findByEventId(new ObjectId(eventId));

        if (assignments.isEmpty()) {
            return List.of();
        }

        // 2. Alle ObjectIds extrahieren (distinct)
        Set<ObjectId> objectIds = assignments.stream()
                .filter(a -> a.getObjectIds() != null)
                .flatMap(a -> a.getObjectIds().stream())
                .collect(Collectors.toSet());

        if (objectIds.isEmpty()) {
            return List.of();
        }

        // 3. Alle ObjectDocuments laden
        List<ObjectDocument> objects =
                objectRepository.findByIdIn(objectIds);

        if (objects.isEmpty()) {
            return List.of();
        }

        // 4. Alle TypeIds extrahieren (distinct)
        Set<ObjectId> typeIds = objects.stream()
                .map(ObjectDocument::getTypeId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (typeIds.isEmpty()) {
            return List.of();
        }

        return objectTypeRepository.findByIdIn(typeIds).stream()
                .map(objectTypeMapper::entityToDTO)
                .collect(Collectors.toList());
    }

    public ObjectTypeDTO createObjectType(ObjectTypeCreateDTO objectTypeDTO) {
        ObjectType objectType = objectTypeMapper.createDTOToObjectType(objectTypeDTO);
        return objectTypeMapper.entityToDTO(objectTypeRepository.save(objectType));
    }

    public ObjectTypeDTO updateObjectType(ObjectTypeDTO objectTypeDTO) {
        objectTypeRepository.findById(new ObjectId(objectTypeDTO.getId())).orElseThrow(
                () -> new IllegalArgumentException("Object type with id " + objectTypeDTO.getId() + " not found"));

        return objectTypeMapper.entityToDTO(objectTypeRepository.save(objectTypeMapper.dtoToObjectType(objectTypeDTO)));
    }

    /*public void deleteObjectType(String objectTypeId) {
        objectTypeRepository.findById(objectTypeId).orElseThrow(()-> new NotFoun)
    }*/
}
