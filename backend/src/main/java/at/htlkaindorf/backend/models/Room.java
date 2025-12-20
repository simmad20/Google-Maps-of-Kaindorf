package at.htlkaindorf.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Room {
    @Id
    private ObjectId id;
    @Field("room_number")
    private String roomNumber;
    private String name;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    @DBRef
    @Builder.Default
    @Field("assigned_objects")
    @JsonManagedReference
    private List<ObjectDocument> assignedObjects = new ArrayList<>();
    @DBRef
    @JsonBackReference
    @ToString.Exclude
    private Card card;
}
