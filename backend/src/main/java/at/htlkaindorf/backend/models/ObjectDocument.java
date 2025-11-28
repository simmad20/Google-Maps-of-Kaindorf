package at.htlkaindorf.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

@Document(collection = "objects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObjectDocument {
    @Id
    private String id;
    private String type;
    private Map<String, Object> attributes;
    @DBRef
    @Field("assigned_room")
    @JsonBackReference
    private Room assignedRoom;
}
