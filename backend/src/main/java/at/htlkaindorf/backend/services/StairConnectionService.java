package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.StairConnectionDTO;
import at.htlkaindorf.backend.mapper.StairConnectionMapper;
import at.htlkaindorf.backend.models.NodeType;
import at.htlkaindorf.backend.models.documents.NavNode;
import at.htlkaindorf.backend.models.documents.StairConnection;
import at.htlkaindorf.backend.repositories.NavNodeRepository;
import at.htlkaindorf.backend.repositories.StairConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StairConnectionService {
    private final StairConnectionRepository stairConnectionRepository;
    private final NavNodeRepository navNodeRepository;
    private final StairConnectionMapper stairConnectionMapper;
    private final AuthContext authContext;

    public StairConnectionDTO createStairConnection(
            ObjectId node1Id,
            ObjectId node2Id,
            String name
    ) {
        NavNode node1 = navNodeRepository.findByIdAndTenantId(node1Id, authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Node 1 not found"));
        NavNode node2 = navNodeRepository.findByIdAndTenantId(node2Id, authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Node 2 not found"));

        // Validate: Both must be STAIRS type
        if (node1.getType() != NodeType.STAIRS || node2.getType() != NodeType.STAIRS) {
            throw new RuntimeException("Both nodes must be of type STAIRS");
        }

        // Validate: Must be on different cards
        if (node1.getCardId().equals(node2.getCardId())) {
            throw new RuntimeException("Stair connections must connect different cards (floors)");
        }

        StairConnection connection = new StairConnection();
        connection.setNode1Id(node1Id);
        connection.setNode2Id(node2Id);
        connection.setCard1Id(node1.getCardId());
        connection.setCard2Id(node2.getCardId());
        connection.setName(name);
        connection.setTenantId(authContext.getTenantObjectId());

        return stairConnectionMapper.toDto(stairConnectionRepository.save(connection));
    }

    public List<StairConnectionDTO> getAllStairConnections() {
        return stairConnectionRepository.findByTenantId(authContext.getTenantObjectId()).stream().map(stairConnectionMapper::toDto).toList();
    }

    public List<StairConnectionDTO> getStairConnectionsByCard(String cardId) {
        return stairConnectionRepository.findByCardAndTenantId(new ObjectId(cardId), authContext.getTenantObjectId())
                .stream().map(stairConnectionMapper::toDto).toList();
    }
}
