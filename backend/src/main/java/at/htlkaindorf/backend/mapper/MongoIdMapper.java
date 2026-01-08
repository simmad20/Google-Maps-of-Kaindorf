package at.htlkaindorf.backend.mapper;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

@Component
public class MongoIdMapper {

    public String asString(ObjectId id) {
        return id != null ? id.toHexString() : null;
    }

    public ObjectId asObjectId(String id) {
        return (id != null && !id.isBlank()) ? new ObjectId(id) : null;
    }
}
