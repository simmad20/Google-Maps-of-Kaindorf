package at.htlkaindorf.backend.models.documents;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "cards")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Card {
    @Id
    private ObjectId id;
    private String title;
    @Field("image_path")
    private String imagePath;
    @Field("tenant_id")
    private ObjectId tenantId;
    @Field("image_file_id")
    private String imageFileId;
    @Field("image_width")
    private Integer imageWidth;
    @Field("image_height")
    private Integer imageHeight;
}
