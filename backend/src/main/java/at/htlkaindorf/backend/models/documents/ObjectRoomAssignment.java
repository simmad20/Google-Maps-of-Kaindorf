package at.htlkaindorf.backend.models.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "object_room_assignments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObjectRoomAssignment {
    @Id
    private ObjectId id;
    @Field("tenant_id")
    private ObjectId tenantId;
    @Field("event_id")
    private ObjectId eventId;
    @Field("object_ids")
    private List<ObjectId> objectIds;
    @Field("room_id")
    private ObjectId roomId;
}
