package at.htlkaindorf.backend.models.documents;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
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
    @Field("type_id")
    private ObjectId typeId;
    private Map<String, Object> attributes;
    @Field("assigned_room_id")
    private ObjectId assignedRoomId;
    @Field("tenant_id")
    private ObjectId tenantId;
}
