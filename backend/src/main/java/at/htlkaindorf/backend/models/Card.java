package at.htlkaindorf.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "cards")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Card {
    private String id;
    private String title;
    @Field("image_path")
    private String imagePath;
    @DBRef
    @JsonManagedReference
    private List<Room> rooms;
}
