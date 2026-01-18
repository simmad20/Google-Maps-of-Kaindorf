package at.htlkaindorf.backend.io;

import at.htlkaindorf.backend.models.documents.*;
import at.htlkaindorf.backend.repositories.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final ObjectRepository objectRepository;
    private final ObjectTypeRepository objectTypeRepository;
    private final ObjectRoomAssignmentRepository assignmentRepository;
    private final CardRepository cardRepository;
    private final RoomRepository roomRepository;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        /*if (objectRepository.count() == 0) {
            migrateTeachersFromJson();
        }*/
    }

    /*@PostConstruct
    public void fixDuplicateAssignments() {

        // Finde alle Assignments
        List<ObjectRoomAssignment> allAssignments = assignmentRepository.findAll();

        // Map zum Sammeln: Key = "roomId|eventId", Value = Set von Object-IDs
        Map<String, Set<ObjectId>> mergedMap = new HashMap<>();
        Map<String, ObjectRoomAssignment> firstAssignmentMap = new HashMap<>();
        Map<String, List<ObjectId>> assignmentsToDelete = new HashMap<>();

        // 1. Sammle alle Daten
        for (ObjectRoomAssignment assignment : allAssignments) {
            String key = assignment.getRoomId() + "|" + assignment.getEventId();

            // Füge Object-IDs zur Menge hinzu
            mergedMap.computeIfAbsent(key, k -> new HashSet<>())
                    .addAll(assignment.getObjectIds());

            // Merke das erste Assignment für Metadaten
            if (!firstAssignmentMap.containsKey(key)) {
                firstAssignmentMap.put(key, assignment);
            }

            // Sammle alle Assignment-IDs zum Löschen
            assignmentsToDelete.computeIfAbsent(key, k -> new ArrayList<>())
                    .add(assignment.getId());
        }

        // 2. Finde Duplikate (mehr als 1 Assignment pro Key)
        List<String> duplicateKeys = mergedMap.keySet().stream()
                .filter(key -> assignmentsToDelete.get(key).size() > 1)
                .collect(Collectors.toList());

        if (duplicateKeys.isEmpty()) {
            log.info("No duplicate assignments found");
            return;
        }

        // 3. Lösche alle alten und erstelle neue
        for (String key : duplicateKeys) {
            try {
                // Alle alten Assignments löschen
                assignmentRepository.deleteAllById(assignmentsToDelete.get(key));

                // Neues zusammengeführtes Assignment erstellen
                ObjectRoomAssignment first = firstAssignmentMap.get(key);
                Set<ObjectId> allObjectIds = mergedMap.get(key);

                ObjectRoomAssignment merged = ObjectRoomAssignment.builder()
                        .tenantId(first.getTenantId())
                        .roomId(first.getRoomId())
                        .eventId(first.getEventId())
                        .objectIds(new ArrayList<>(allObjectIds))
                        .build();

                assignmentRepository.save(merged);

                log.info("Merged {} assignments for room {} event {} → {} objects",
                        assignmentsToDelete.get(key).size(),
                        first.getRoomId(), first.getEventId(),
                        allObjectIds.size());

            } catch (Exception e) {
                log.error("Error merging key {}: {}", key, e.getMessage());
            }
        }

        log.info("Successfully fixed {} duplicate assignment groups", duplicateKeys.size());
    }*/

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
                    if (!objectRepository.existsByTypeAndAttributesAbbreviation("6915b227c4dcbd5a4b392aef",
                            teacher.get("abbreviation").toString())) {

                        objectRepository.save(ObjectDocument.builder()
                                .typeId(objectTypeRepository.findByName("Teacher").get().getId())
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