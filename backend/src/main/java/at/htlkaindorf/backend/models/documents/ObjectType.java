package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.AllowedAttribute;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
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
    private ObjectId id;
    @Field("name")
    private String name;
    @Field("display_name")
    private String displayName;
    private String description;
    private String icon;
    private String color;
    @Field("visible_in_app")
    private Boolean visibleInApp;
    @Field("visible_in_admin")
    private Boolean visibleInAdmin;
    @Field("allowed_attributes")
    private List<AllowedAttribute> allowedAttributes;
    @Field("tenant_id")
    private ObjectId tenantId;
}
