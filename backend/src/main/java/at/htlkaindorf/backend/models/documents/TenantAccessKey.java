package at.htlkaindorf.backend.models.documents;

import at.htlkaindorf.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "tenant_access_keys")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TenantAccessKey {
    @Id
    private ObjectId id;
    @Field("tenant_id")
    private ObjectId tenantId;
    private String key;
    private Role role;
    private Instant expiresAt;
    private boolean active;
    private int maxUsages;
    private int usedCount;
}
