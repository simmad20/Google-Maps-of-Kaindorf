package at.htlkaindorf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssignedObjectDTO {
    private String objectId;
    private String objectType;
    private Map<String, Object> attributes;
}
