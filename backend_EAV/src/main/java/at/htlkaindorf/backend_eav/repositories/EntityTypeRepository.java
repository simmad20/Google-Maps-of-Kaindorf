package at.htlkaindorf.backend_eav.repositories;

import at.htlkaindorf.backend_eav.entities.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntityTypeRepository extends JpaRepository<EntityType, Long> {
}
