package at.htlkaindorf.backend_eav.controller;

import at.htlkaindorf.backend_eav.entities.Attribute;
import at.htlkaindorf.backend_eav.entities.EntityInstance;
import at.htlkaindorf.backend_eav.entities.EntityType;
import at.htlkaindorf.backend_eav.entities.Value;
import at.htlkaindorf.backend_eav.services.EavService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eav")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EavController {
    private final EavService eavService;

    @PostMapping
    public ResponseEntity<EntityType> createEntityType(@RequestBody EntityType entityType) {
        return ResponseEntity.ok(eavService.createEntityType(entityType));
    }

    @PostMapping("/attribute/{entityTypeId}")
    public ResponseEntity<Attribute> addAttribute(@PathVariable("entityTypeId") Long entityTypeId, @RequestBody Attribute attribute) {
        return ResponseEntity.ok(eavService.addAttribute(entityTypeId, attribute));
    }

    @PostMapping("/instance/{entityTypeId}")
    public ResponseEntity<EntityInstance> createInstance(@PathVariable("entityTypeId") Long entityTypeId, @RequestParam String name) {
        return ResponseEntity.ok(eavService.createInstance(entityTypeId, name));
    }

    @PostMapping("/value")
    public ResponseEntity<Value> addValue(@RequestParam Long instanceId, @RequestParam Long attributeId, @RequestParam String value) {
        return ResponseEntity.ok(eavService.addValue(instanceId, attributeId, value));
    }

    @GetMapping("/instance/{instanceId}/values")
    public ResponseEntity<Iterable<Value>> getValues(@PathVariable Long instanceId) {
        return ResponseEntity.ok(eavService.getValues(instanceId));
    }

    @GetMapping("/search")
    public ResponseEntity<Iterable<EntityInstance>> searchEntities(
            @RequestParam String fach,
            @RequestParam String standort
    ) {
        return ResponseEntity.ok(eavService.findByMultipleAttributes(fach, standort));
    }
}
