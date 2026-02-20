package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StairConnectionDTO {
    private String id;
    private String node1Id;
    private String node2Id;
    private String card1Id;
    private String card2Id;
    private String name;
    private String tenantId;
}
