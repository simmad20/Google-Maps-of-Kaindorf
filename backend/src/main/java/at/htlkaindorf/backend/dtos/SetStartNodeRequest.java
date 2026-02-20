package at.htlkaindorf.backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetStartNodeRequest {
    @NotEmpty
    private String nodeId;
    @NotEmpty
    private String cardId;
}
