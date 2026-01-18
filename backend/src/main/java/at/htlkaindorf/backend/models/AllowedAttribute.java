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
    private String type;
    private Boolean required;
    private Boolean searchable;
    private Boolean sortable;
    private String placeholder;
    private VisibilityConfig dropdown;
    private VisibilityConfig card;
    private VisibilityConfig marker;

}
