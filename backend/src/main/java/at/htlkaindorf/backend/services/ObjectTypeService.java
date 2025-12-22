package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dtos.ObjectTypeCreateDTO;
import at.htlkaindorf.backend.dtos.ObjectTypeDTO;
import at.htlkaindorf.backend.mapper.ObjectTypeMapper;
import at.htlkaindorf.backend.models.documents.ObjectType;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObjectTypeService {
    private final ObjectTypeRepository objectTypeRepository;
    private final ObjectTypeMapper objectTypeMapper;

    public List<ObjectTypeDTO> getAllObjectTypes() {
        return objectTypeRepository.findAll().stream().map(objectTypeMapper::entityToDTO)
                .collect(Collectors.toList());

    }

    public ObjectTypeDTO createObjectType(ObjectTypeCreateDTO objectTypeDTO) {
        ObjectType objectType = objectTypeMapper.createDTOToObjectType(objectTypeDTO);
        return objectTypeMapper.entityToDTO(objectTypeRepository.save(objectType));
    }

    public ObjectTypeDTO updateObjectType(ObjectTypeDTO objectTypeDTO) {
        objectTypeRepository.findById(objectTypeDTO.getId()).orElseThrow(
                () -> new IllegalArgumentException("Objekttyp mit der Id " + objectTypeDTO.getId() + " nicht gefunden"));

        return objectTypeMapper.entityToDTO(objectTypeRepository.save(objectTypeMapper.dtoToObjectType(objectTypeDTO)));
    }
}
