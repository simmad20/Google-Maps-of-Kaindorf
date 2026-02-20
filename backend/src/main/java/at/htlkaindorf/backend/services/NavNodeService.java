package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.auth.AuthContext;
import at.htlkaindorf.backend.dtos.NavNodeDTO;
import at.htlkaindorf.backend.exceptions.NotFoundException;
import at.htlkaindorf.backend.mapper.NavNodeMapper;
import at.htlkaindorf.backend.models.documents.NavNode;
import at.htlkaindorf.backend.models.documents.StairConnection;
import at.htlkaindorf.backend.models.documents.Tenant;
import at.htlkaindorf.backend.repositories.NavNodeRepository;
import at.htlkaindorf.backend.repositories.StairConnectionRepository;
import at.htlkaindorf.backend.repositories.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavNodeService {
    private final NavNodeRepository navNodeRepository;
    private final StairConnectionRepository stairConnectionRepository;
    private final TenantRepository tenantRepository;
    private final NavNodeMapper navNodeMapper;
    private final AuthContext authContext;

    public List<NavNodeDTO> getNodesByCard(String cardId) {
        List<NavNode> nodes = navNodeRepository.findByCardIdAndTenantId(new ObjectId(cardId), authContext.getTenantObjectId());
        return nodes.stream().map(navNodeMapper::toDto).collect(Collectors.toList());
    }

    public NavNodeDTO getStartNode() {
        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant with id " + authContext.getTenantId() + " not found."));

        if (tenant.getStartNodeId() == null) {
            return null;
        }
        NavNode navNode = navNodeRepository.findByIdAndTenantId(tenant.getStartNodeId(), authContext.getTenantObjectId()).orElse(null);

        return navNodeMapper.toDto(navNode);
    }

    public NavNodeDTO setStartNode(ObjectId nodeId, ObjectId cardId) {
        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant with id " + authContext.getTenantId() + " not found."));

        NavNode navNode = navNodeRepository.findByIdAndTenantId(nodeId, authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Node with id: " + nodeId + " not found."));

        if (!navNode.getCardId().equals(cardId)) {
            throw new RuntimeException("Node does not belong to this card");
        }
        tenant.setStartNodeId(nodeId);
        tenantRepository.save(tenant);

        return navNodeMapper.toDto(navNode);
    }

    public NavNodeDTO clearStartNode() {
        Tenant tenant = tenantRepository.findById(authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Tenant with id " + authContext.getTenantId() + " not found."));

        NavNode navNode = navNodeRepository.findByIdAndTenantId(tenant.getStartNodeId(), authContext.getTenantObjectId())
                .orElseThrow(() -> new NotFoundException("Node with id: " + tenant.getStartNodeId() + " not found."));

        tenant.setStartNodeId(null);

        return navNodeMapper.toDto(navNode);
    }

    public NavNodeDTO createNode(NavNodeDTO dto) {
        NavNode node = navNodeMapper.toEntity(dto);
        node.setTenantId(authContext.getTenantObjectId());

        NavNode saved = navNodeRepository.save(node);
        return navNodeMapper.toDto(saved);
    }

    @Transactional
    public NavNodeDTO connectNodes(String nodeId, String targetNodeId) {
        ObjectId id1 = new ObjectId(nodeId);
        ObjectId id2 = new ObjectId(targetNodeId);

        NavNode node1 = navNodeRepository.findByIdAndTenantId(id1, authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Node not found"));
        NavNode node2 = navNodeRepository.findByIdAndTenantId(id2, authContext.getTenantObjectId())
                .orElseThrow(() -> new RuntimeException("Target node not found"));

        if (!node1.getCardId().equals(node2.getCardId())) {
            throw new RuntimeException("Can only connect nodes on the same card");
        }

        if (!node1.getNeighbors().contains(id2)) {
            node1.getNeighbors().add(id2);
        }
        if (!node2.getNeighbors().contains(id1)) {
            node2.getNeighbors().add(id1);
        }

        navNodeRepository.save(node1);
        navNodeRepository.save(node2);

        return navNodeMapper.toDto(node1);
    }

    @Transactional
    public void disconnectNodes(String nodeId, String targetNodeId) {
        ObjectId id1 = new ObjectId(nodeId);
        ObjectId id2 = new ObjectId(targetNodeId);

        NavNode node1 = navNodeRepository.findByIdAndTenantId(id1, authContext.getTenantObjectId()).orElse(null);
        NavNode node2 = navNodeRepository.findByIdAndTenantId(id2, authContext.getTenantObjectId()).orElse(null);

        if (node1 != null) {
            node1.getNeighbors().remove(id2);
            navNodeRepository.save(node1);
        }

        if (node2 != null) {
            node2.getNeighbors().remove(id1);
            navNodeRepository.save(node2);
        }
    }

    public void deleteNode(String nodeId) {
        ObjectId id = new ObjectId(nodeId);

        // Remove all references to this node
        List<NavNode> allNodes = navNodeRepository.findByTenantId(authContext.getTenantObjectId());
        for (NavNode node : allNodes) {
            if (node.getNeighbors().contains(id)) {
                node.getNeighbors().remove(id);
                navNodeRepository.save(node);
            }
        }

        // Remove stair connections
        List<StairConnection> stairConns = stairConnectionRepository.findByNode1IdOrNode2IdAndTenantId(id, id, authContext.getTenantObjectId());
        stairConnectionRepository.deleteAll(stairConns);

        navNodeRepository.deleteById(id);
    }
}
