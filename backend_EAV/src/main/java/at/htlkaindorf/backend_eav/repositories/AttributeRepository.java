package at.htlkaindorf.backend_eav.repositories;

import at.htlkaindorf.backend_eav.entities.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {
}
