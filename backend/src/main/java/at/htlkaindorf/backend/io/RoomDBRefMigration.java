package at.htlkaindorf.backend.io;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.DBRef;
import org.bson.Document;
import org.bson.types.ObjectId;

import static com.mongodb.client.model.Filters.eq;

public class RoomDBRefMigration {

    public static void main(String[] args) {

        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("mapsOfKaindorf");
            MongoCollection<Document> rooms = database.getCollection("rooms");

            for (Document room : rooms.find()) {

                Document update = new Document();
                Document unset = new Document();

                // --- DBRef card → card_id ---
                Object cardField = room.get("card");
                if (cardField instanceof DBRef) {
                    DBRef cardRef = (DBRef) cardField;
                    update.append("card_id", (ObjectId) cardRef.getId());
                    unset.append("card", "");
                }

                // --- assigned_object_ids löschen ---
                if (room.containsKey("assigned_object_ids")) {
                    unset.append("assigned_object_ids", "");
                }

                // --- Update ausführen, wenn nötig ---
                if (!update.isEmpty() || !unset.isEmpty()) {
                    rooms.updateOne(eq("_id", room.get("_id")),
                            new Document("$set", update)
                                    .append("$unset", unset));
                }
            }

            System.out.println("✅ Migration abgeschlossen: card → card_id + assigned_object_ids gelöscht");
        }
    }
}
