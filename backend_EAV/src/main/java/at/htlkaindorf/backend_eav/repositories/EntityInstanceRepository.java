package at.htlkaindorf.backend_eav.repositories;

import at.htlkaindorf.backend_eav.entities.EntityInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EntityInstanceRepository extends JpaRepository<EntityInstance, Long> {
    @Query("""
            SELECT DISTINCT e
            FROM EntityInstance e
            JOIN e.values v
            JOIN v.attribute a
            WHERE a.name = :attributeName AND v.value = :attributeValue
            """)
    List<EntityInstance> findByAttributeValue(String attributeName, String attributeValue);

    @Query("""
            SELECT DISTINCT e
            FROM EntityInstance e
            JOIN e.values v1
            JOIN v1.attribute a1
            JOIN e.values v2
            JOIN v2.attribute a2
            WHERE (a1.name = 'Fach' AND v1.value = :fach)
              AND (a2.name = 'Standort' AND v2.value = :standort)
            """)
    List<EntityInstance> findByMultipleAttributes(String fach, String standort
    );
}
