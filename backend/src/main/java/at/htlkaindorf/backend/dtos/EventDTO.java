package at.htlkaindorf.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
    @NotBlank
    private String id;
    @NotBlank
    private String name;
    @NotNull
    private String startDateTime;
    private String endDateTime;
    private String description;
    private boolean active;
    private String themeColor;
    private String announcement;
}
