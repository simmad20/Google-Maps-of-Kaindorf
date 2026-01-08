package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.Settings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "tenants")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tenant {
    @Id
    private ObjectId id;
    private String name;
    private String slug;
    private Settings settings;
    private boolean active;
    @Field("created_at")
    private Date createdAt;
}
