package at.htlkaindorf.backend_eav.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EntityInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String instanceName;
    @ManyToOne
    private EntityType entityType;
    @OneToMany(mappedBy = "instance", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Value> values;
}
