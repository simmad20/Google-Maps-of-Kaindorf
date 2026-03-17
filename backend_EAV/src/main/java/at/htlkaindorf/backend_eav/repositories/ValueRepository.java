package at.htlkaindorf.backend_eav.repositories;

import at.htlkaindorf.backend_eav.entities.Value;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ValueRepository extends JpaRepository<Value, Long> {
}
