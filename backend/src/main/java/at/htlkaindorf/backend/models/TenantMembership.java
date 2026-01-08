package at.htlkaindorf.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantMembership {
    @Field("tenant_id")
    private ObjectId tenantId;
    private Role role;
}
