package at.htlkaindorf.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCreateDTO {
    @NotBlank
    private String name;
    @NotNull
    private Instant startDateTime;
    private Instant endDateTime;
    private String description;
    private String themeColor;
    private String announcement;
}
