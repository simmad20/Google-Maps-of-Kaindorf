package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.annotations.RequireAdmin;
import at.htlkaindorf.backend.dtos.NavNodeDTO;
import at.htlkaindorf.backend.dtos.SetStartNodeRequest;
import at.htlkaindorf.backend.dtos.StairConnectionDTO;
import at.htlkaindorf.backend.services.NavNodeService;
import at.htlkaindorf.backend.services.StairConnectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nav-nodes")
@RequiredArgsConstructor
@CrossOrigin
public class NavNodeController {

    private final NavNodeService navNodeService;
    private final StairConnectionService stairConnectionService;

    @GetMapping
    public ResponseEntity<List<NavNodeDTO>> getNodesByCard(@RequestParam String cardId) {
        return ResponseEntity.ok(navNodeService.getNodesByCard(cardId));
    }

    @GetMapping("/start")
    public ResponseEntity<NavNodeDTO> getStartNode() {
        return ResponseEntity.ok(navNodeService.getStartNode());
    }

    @PostMapping("/start")
    @RequireAdmin
    public ResponseEntity<NavNodeDTO> setStartNode(@Valid @RequestBody SetStartNodeRequest request) {
        return ResponseEntity.ok(navNodeService.setStartNode(new ObjectId(request.getNodeId()), new ObjectId(request.getCardId())));
    }

    @DeleteMapping("/start-clear")
    @RequireAdmin
    public ResponseEntity<NavNodeDTO> clearStartNode() {
        return ResponseEntity.ok(navNodeService.clearStartNode());
    }

    @PostMapping
    @RequireAdmin
    public ResponseEntity<NavNodeDTO> createNode(
            @Valid @RequestBody NavNodeDTO request
    ) {
        NavNodeDTO created = navNodeService.createNode(request);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{nodeId}/connect")
    @RequireAdmin
    public ResponseEntity<NavNodeDTO> connectNodes(
            @PathVariable String nodeId,
            @RequestBody Map<String, String> payload
    ) {
        String targetNodeId = payload.get("targetNodeId");
        NavNodeDTO updated = navNodeService.connectNodes(nodeId, targetNodeId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{nodeId}/disconnect/{targetNodeId}")
    @RequireAdmin
    public ResponseEntity<Void> disconnectNodes(
            @PathVariable String nodeId,
            @PathVariable String targetNodeId
    ) {
        navNodeService.disconnectNodes(nodeId, targetNodeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{nodeId}")
    @RequireAdmin
    public ResponseEntity<Void> deleteNode(@PathVariable String nodeId) {
        navNodeService.deleteNode(nodeId);
        return ResponseEntity.ok().build();
    }

    // STAIR CONNECTIONS (between cards/floors)
    @PostMapping("/stair-connections")
    @RequireAdmin
    public ResponseEntity<StairConnectionDTO> createStairConnection(
            @RequestBody Map<String, String> payload
    ) {
        StairConnectionDTO created = stairConnectionService.createStairConnection(
                new ObjectId(payload.get("node1Id")),
                new ObjectId(payload.get("node2Id")),
                payload.get("name")
        );
        return ResponseEntity.ok(created);
    }

    @GetMapping("/stair-connections")
    public ResponseEntity<List<StairConnectionDTO>> getStairConnections(
            @RequestParam(required = false) String cardId
    ) {
        if (cardId != null) {
            return ResponseEntity.ok(stairConnectionService.getStairConnectionsByCard(cardId));
        }
        return ResponseEntity.ok(stairConnectionService.getAllStairConnections());
    }
}