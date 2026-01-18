package at.htlkaindorf.backend.models.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "events")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    @Id
    private ObjectId id;
    @Field("tenant_id")
    private ObjectId tenantId;
    private String name;
    @Field("start_date_time")
    private Instant startDateTime;
    @Field("end_date_time")
    private Instant endDateTime;
    private String description;
    private boolean active;
    private String themeColor;
    private String announcement;
}
