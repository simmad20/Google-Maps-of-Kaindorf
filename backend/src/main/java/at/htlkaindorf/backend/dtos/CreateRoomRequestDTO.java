package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateRoomRequestDTO {
    private String roomNumber;
    private String name;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
}
