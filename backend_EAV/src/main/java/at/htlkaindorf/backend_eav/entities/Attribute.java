package at.htlkaindorf.backend_eav.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String dataType;
    @ManyToOne
    @JsonBackReference
    private EntityType entityType;
    @OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Value> values;
}
