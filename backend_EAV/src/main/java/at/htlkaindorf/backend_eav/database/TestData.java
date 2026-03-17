package at.htlkaindorf.backend_eav.database;

import at.htlkaindorf.backend_eav.entities.Attribute;
import at.htlkaindorf.backend_eav.entities.EntityInstance;
import at.htlkaindorf.backend_eav.entities.EntityType;
import at.htlkaindorf.backend_eav.entities.Value;
import at.htlkaindorf.backend_eav.repositories.AttributeRepository;
import at.htlkaindorf.backend_eav.repositories.EntityInstanceRepository;
import at.htlkaindorf.backend_eav.repositories.EntityTypeRepository;
import at.htlkaindorf.backend_eav.repositories.ValueRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TestData {
    private final EntityTypeRepository entityTypeRepository;
    private final EntityInstanceRepository entityInstanceRepository;
    private final AttributeRepository attributeRepository;
    private final ValueRepository valueRepository;

    @PostConstruct
    public void init() {
        EntityType teacherType = EntityType.builder().name("Teacher").build();
        entityTypeRepository.save(teacherType);
        EntityInstance teacherInstance = EntityInstance.builder()
                .instanceName("Helmut")
                .entityType(teacherType).build();
        entityInstanceRepository.save(teacherInstance);
        Attribute fachAttribut = Attribute.builder()
                .dataType("String")
                .name("Fach")
                .entityType(teacherType).build();
        Attribute standortAttribut = Attribute.builder()
                .dataType("String")
                .name("Standort")
                .entityType(teacherType).build();
        attributeRepository.saveAll(List.of(fachAttribut, standortAttribut));
        Value fachOfHelmut = Value.builder()
                .value("Mathematik")
                .attribute(fachAttribut)
                .instance(teacherInstance).build();
        Value standortOfHelmut = Value.builder()
                .value("Graz")
                .attribute(standortAttribut)
                .instance(teacherInstance).build();
        valueRepository.saveAll(List.of(fachOfHelmut, standortOfHelmut));
    }
}
