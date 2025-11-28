package at.htlkaindorf.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document("object_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObjectType {
    @Id
    private String id;
    @Field("display_name")
    private String displayName;
    @Field("allowed_attributes")
    private List<String> allowedAttributes;
}
