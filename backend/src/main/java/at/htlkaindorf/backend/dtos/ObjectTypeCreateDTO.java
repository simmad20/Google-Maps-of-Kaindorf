package at.htlkaindorf.backend.dtos;

import at.htlkaindorf.backend.models.AllowedAttribute;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObjectTypeCreateDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String displayName;
    private String description;
    private String icon;
    private String color;
    @NotNull
    private Boolean visibleInApp;
    @NotNull
    private Boolean visibleInAdmin;
    private List<AllowedAttribute> schema;
}
