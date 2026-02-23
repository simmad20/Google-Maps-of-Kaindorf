package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NavNodeDTO {
    private String id;
    private Integer x;
    private Integer y;
    private String type;
    private List<String> neighbors;
    private String cardId;
}
