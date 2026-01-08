package at.htlkaindorf.backend.models.json;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class JsonTeacher {
    @JsonProperty("teacher_id")
    private Long teacherId;
    private String abbreviation;
    @JsonProperty("image_url")
    private String imageUrl;
    private String title;
}
