package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.TenantMembership;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    private ObjectId id;
    @Field("first_name")
    private String firstName;
    @Field("last_name")
    private String lastName;
    private String email;
    private String password;
    private ObjectId tenantId;
    @Field("created_at")
    private Date createdAt;
    private List<TenantMembership> memberships;
    @Field("last_tenant_id")
    private ObjectId lastTenantId;
}
