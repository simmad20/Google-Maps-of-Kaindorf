package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
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
    private final AuthContext authContext;

    public List<ObjectTypeDTO> getAllObjectTypes() {
        return objectTypeRepository.findByTenantId(authContext.getTenantObjectId()).stream().map(objectTypeMapper::entityToDTO)
                .collect(Collectors.toList());

    }

    public List<ObjectTypeDTO> getObjectTypesForEvent(String eventId) {

        // 1. Alle RoomAssignments für das Event laden
        List<ObjectRoomAssignment> assignments =
                objectRoomAssignmentRepository.findByEventIdAndTenantId(new ObjectId(eventId), authContext.getTenantObjectId());

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
                objectRepository.findByIdInAndTenantId(objectIds, authContext.getTenantObjectId());

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

        return objectTypeRepository.findByIdInAndTenantId(typeIds, authContext.getTenantObjectId()).stream()
                .map(objectTypeMapper::entityToDTO)
                .collect(Collectors.toList());
    }

    public ObjectTypeDTO createObjectType(ObjectTypeCreateDTO objectTypeDTO) {
        ObjectType objectType = objectTypeMapper.createDTOToObjectType(objectTypeDTO);
        objectType.setTenantId(authContext.getTenantObjectId());
        return objectTypeMapper.entityToDTO(objectTypeRepository.save(objectType));
    }

    public ObjectTypeDTO updateObjectType(ObjectTypeDTO objectTypeDTO) {
        ObjectType existing = objectTypeRepository.findByIdAndTenantId(
                new ObjectId(objectTypeDTO.getId()), authContext.getTenantObjectId()
        ).orElseThrow(() -> new IllegalArgumentException("Object type with id " + objectTypeDTO.getId() + " not found"));

        objectTypeMapper.updateEntityFromDTO(objectTypeDTO, existing);
        return objectTypeMapper.entityToDTO(objectTypeRepository.save(existing));
    }

    /*public void deleteObjectType(String objectTypeId) {
        objectTypeRepository.findById(objectTypeId).orElseThrow(()-> new NotFoun)
    }*/
}
