package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.NodeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "nav_nodes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NavNode {
    @Id
    private ObjectId id;
    private Integer x;
    private Integer y;
    private NodeType type;
    private List<ObjectId> neighbors = new ArrayList<>();
    private ObjectId cardId;
    private ObjectId tenantId;
}
