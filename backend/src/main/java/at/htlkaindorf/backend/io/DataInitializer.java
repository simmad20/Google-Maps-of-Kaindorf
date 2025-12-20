package at.htlkaindorf.backend.io;

import at.htlkaindorf.backend.models.ObjectDocument;
import at.htlkaindorf.backend.models.ObjectType;
import at.htlkaindorf.backend.repositories.CardRepository;
import at.htlkaindorf.backend.repositories.ObjectRepository;
import at.htlkaindorf.backend.repositories.ObjectTypeRepository;
import at.htlkaindorf.backend.repositories.RoomRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final ObjectRepository objectRepository;
    private final ObjectTypeRepository objectTypeRepository;
    private final CardRepository cardRepository;
    private final RoomRepository roomRepository;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        /*if (objectRepository.count() == 0) {
            migrateTeachersFromJson();
        }*/
    }

    private void migrateTeachersFromJson() {
        try {
            // JSON-Daten laden
            List<Map<String, Object>> people = loadJsonData("people.json");
            List<Map<String, Object>> teachers = loadJsonData("teachers.json");

            if (people.isEmpty() || teachers.isEmpty()) {
                log.warn("Keine Daten zum Migrieren gefunden");
                return;
            }

            // Personen nach ID mappen
            Map<Long, Map<String, Object>> personMap = new HashMap<>();
            for (Map<String, Object> person : people) {
                Long personId = ((Number) person.get("person_id")).longValue();
                personMap.put(personId, person);
            }

            // Lehrer migrieren
            int migrated = 0;
            for (Map<String, Object> teacher : teachers) {
                Long teacherId = ((Number) teacher.get("teacher_id")).longValue();
                Map<String, Object> person = personMap.get(teacherId);

                if (person != null) {
                    // Einfache Attributes-Map erstellen
                    Map<String, Object> attributes = new HashMap<>();
                    attributes.put("firstname", person.get("firstname"));
                    attributes.put("lastname", person.get("lastname"));
                    attributes.put("abbreviation", teacher.get("abbreviation"));
                    attributes.put("image_url", teacher.get("image_url"));
                    attributes.put("title", teacher.get("title"));
                    attributes.put("legacy_teacher_id", teacherId);

                    // Nur speichern wenn nicht bereits vorhanden
                    if (!objectRepository.existsByTypeAndAttributesAbbreviation("teacher",
                            teacher.get("abbreviation").toString())) {

                        objectRepository.save(ObjectDocument.builder()
                                .type(objectTypeRepository.findByName("Teacher").get())
                                .attributes(attributes)
                                .build());
                        migrated++;
                    }
                }
            }

            log.info("Migration abgeschlossen: {} Lehrer migriert", migrated);

        } catch (Exception e) {
            log.error("Fehler bei der Migration: {}", e.getMessage());
        }
    }

    private List<Map<String, Object>> loadJsonData(String fileName) {
        try (InputStream inputStream = getClass().getResourceAsStream("/" + fileName)) {
            return objectMapper.readValue(inputStream, new TypeReference<>() {
            });
        } catch (Exception e) {
            log.warn("Datei nicht gefunden: {}", fileName);
            return Collections.emptyList();
        }
    }
}