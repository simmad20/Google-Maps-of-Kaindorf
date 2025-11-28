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
public class ObjectDTO {
    private String id;
    private String type;
    private Map<String, Object> attributes;
    private String assignedRoomId;
}
