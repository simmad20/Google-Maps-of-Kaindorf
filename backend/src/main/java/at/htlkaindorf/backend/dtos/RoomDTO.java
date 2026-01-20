package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomDTO {
    private String id;
    private String roomNumber;
    private String name;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private List<String> assignedObjectIds;
    private String cardId;
    private String eventId;
}
