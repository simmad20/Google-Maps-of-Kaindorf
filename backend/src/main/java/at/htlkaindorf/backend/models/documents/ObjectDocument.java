package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.documents.Room;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.bson.types.ObjectId;
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
    private ObjectId id;
    @DBRef
    private ObjectType type;
    private Map<String, Object> attributes;
    @DBRef
    @Field("assigned_room")
    @ToString.Exclude
    @JsonBackReference
    private Room assignedRoom;
}
