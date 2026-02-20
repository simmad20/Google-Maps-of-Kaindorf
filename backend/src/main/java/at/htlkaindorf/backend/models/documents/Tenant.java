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

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Document(collection = "tenants")
@Data
public class Tenant {
    @Id
    private ObjectId id;

    private String name;
    private String displayName;

    private Settings settings;

    // QR-Code-Inhalt: eindeutiger Join-Key für die Mobile App
    private String joinCode;


    // API-Credentials für externe Systeme
    @Field("api_key")
    private String apiKey;
    @Field("api_secret")
    private String apiSecret;

    // Soft-Delete / Deaktivierung
    private boolean active;

    @Field("created_at")
    private LocalDateTime createdAt;
    @Field("updated_at")
    private LocalDateTime updatedAt;

    @Field("start_node_id")
    private ObjectId startNodeId;

    public Tenant() {
        this.joinCode = UUID.randomUUID().toString();
        this.apiKey = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.active = true;
    }
}
