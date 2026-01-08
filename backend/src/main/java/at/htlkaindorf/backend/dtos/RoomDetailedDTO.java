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
public class RoomDetailedDTO {
    private String id;
    private String roomNumber;
    private String name;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private List<ObjectDTO> assignedObjects;
    private String cardId;
}
