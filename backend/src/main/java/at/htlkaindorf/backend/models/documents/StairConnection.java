package at.htlkaindorf.backend.models.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stair_connections")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StairConnection {
    @Id
    private ObjectId id;
    private ObjectId node1Id;
    private ObjectId node2Id;
    private ObjectId card1Id;
    private ObjectId card2Id;
    private String name;
    private ObjectId tenantId;
}
