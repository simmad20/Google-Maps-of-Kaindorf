package at.htlkaindorf.backend.models;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AllowedAttribute {

    private String key;
    private String label;
    @ToString.Exclude
    private String type;
    private boolean required;
    private String placeholder;

    private List<String> options;
}
