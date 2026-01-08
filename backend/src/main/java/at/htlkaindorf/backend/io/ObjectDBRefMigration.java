package at.htlkaindorf.backend.io;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.DBRef;
import org.bson.Document;
import org.bson.types.ObjectId;

import static com.mongodb.client.model.Filters.eq;

public class ObjectDBRefMigration {

    public static void main(String[] args) {

        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("mapsOfKaindorf");
            MongoCollection<Document> objects = database.getCollection("objects");

            for (Document obj : objects.find()) {

                Document update = new Document();
                Document unset = new Document();

                // --- type → type_id ---
                Object typeField = obj.get("type");
                if (typeField instanceof DBRef) {
                    DBRef typeRef = (DBRef) typeField;
                    update.append("type_id", (ObjectId) typeRef.getId());
                    unset.append("type", "");
                }

                // --- assigned_room → assigned_room_id ---
                Object assignedRoomField = obj.get("assigned_room");
                if (assignedRoomField instanceof DBRef) {
                    DBRef roomRef = (DBRef) assignedRoomField;
                    update.append("assigned_room_id", (ObjectId) roomRef.getId());
                    unset.append("assigned_room", "");
                }

                // --- Update ausführen, wenn nötig ---
                if (!update.isEmpty() || !unset.isEmpty()) {
                    objects.updateOne(eq("_id", obj.get("_id")),
                            new Document("$set", update)
                                    .append("$unset", unset));
                }
            }

            System.out.println("✅ Migration abgeschlossen: type → type_id, assigned_room → assigned_room_id");
        }
    }
}
