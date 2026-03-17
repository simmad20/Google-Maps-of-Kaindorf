package at.htlkaindorf.backend_eav.services;

import at.htlkaindorf.backend_eav.entities.Attribute;
import at.htlkaindorf.backend_eav.entities.EntityInstance;
import at.htlkaindorf.backend_eav.entities.EntityType;
import at.htlkaindorf.backend_eav.entities.Value;
import at.htlkaindorf.backend_eav.repositories.AttributeRepository;
import at.htlkaindorf.backend_eav.repositories.EntityInstanceRepository;
import at.htlkaindorf.backend_eav.repositories.EntityTypeRepository;
import at.htlkaindorf.backend_eav.repositories.ValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EavService {
    private final EntityTypeRepository entityTypeRepository;
    private final AttributeRepository attributeRepository;
    private final EntityInstanceRepository entityInstanceRepository;
    private final ValueRepository valueRepository;

    public EntityType createEntityType(EntityType entityType) {
        return entityTypeRepository.save(entityType);
    }

    public Attribute addAttribute(Long entityTypeId, Attribute attribute) {
        EntityType type = entityTypeRepository.findById(entityTypeId).orElseThrow();
        attribute.setEntityType(type);

        return attributeRepository.save(attribute);
    }

    public EntityInstance createInstance(Long entityTypeId, String name) {
        EntityType type = entityTypeRepository.findById(entityTypeId).orElseThrow();
        EntityInstance instance = EntityInstance.builder()
                .instanceName(name)
                .entityType(type).build();

        return entityInstanceRepository.save(instance);
    }

    public Value addValue(Long instanceId, Long attributeId, String value) {
        EntityInstance instance = entityInstanceRepository.findById(instanceId).orElseThrow();
        Attribute attribute = attributeRepository.findById(attributeId).orElseThrow();

        // Konsistenzprüfung: Prüfen, ob das Attribut zum Typ der Instanz gehört
        if (!attribute.getEntityType().getId().equals(instance.getEntityType().getId())) {
            throw new IllegalArgumentException("Das ausgewählte Attribut gehört nicht zum Typ der Instanz.");
        }

        Value v = Value.builder()
                .instance(instance)
                .attribute(attribute)
                .value(value)
                .build();

        return valueRepository.save(v);
    }

    public List<Value> getValues(Long instanceId) {
        EntityInstance instance = entityInstanceRepository.findById(instanceId).orElseThrow();

        return instance.getValues();
    }

    public List<EntityInstance> findByMultipleAttributes(String fach, String standort) {
        return entityInstanceRepository.findByMultipleAttributes(fach, standort);
    }
}
