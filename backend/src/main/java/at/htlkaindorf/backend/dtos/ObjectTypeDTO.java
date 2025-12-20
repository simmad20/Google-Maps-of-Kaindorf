package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.AllowedAttribute;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObjectTypeDTO {
    private String id;
    private String name;
    private String description;
    private String icon;
    private List<AllowedAttribute> schema;

}
