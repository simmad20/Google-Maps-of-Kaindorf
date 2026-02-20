import {HttpStatusCode} from "axios";
import {API_URL} from "../config.ts";
import {
    ConnectNodesRequest,
    CreateNavNodeRequest,
    CreateStairConnectionRequest,
    INavNode,
    IStairConnection
} from "../models/interfaces.ts";
import api from "../api/axios.ts";

const BASE_URL: string = API_URL + '/nav-nodes';

class NavNodeService {

    /**
     * Fetch all nodes for a specific card
     */
    static async fetchNodesByCard(cardId: string): Promise<INavNode[]> {
        try {
            console.log(`[NavNodeService] Fetching nodes for card: ${cardId}`);

            const response = await api.get(BASE_URL, {
                params: {cardId}
            });

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response fetching nodes: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} nodes:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error fetching nodes for card ${cardId}:`, error.message);
            throw error;
        }
    }

    static async fetchStartNode(): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Fetching start node`);

            const response = await api.get(BASE_URL + "/start");

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response fetching start node: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully fetched start node`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error fetching start node`, error.message);
            throw error;
        }
    }

    static async setStartNode(nodeId: string, cardId: string): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Setting start node`);

            const response = await api.post(BASE_URL + "/start", {nodeId, cardId});

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response setting start node: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully setted start node`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error setting start node`, error.message);
            throw error;
        }
    }

    static async clearStartNode(): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Setting start node`);

            const response = await api.delete(BASE_URL + "/start-clear");

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response clearing start node: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully cleared start node`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error clearing start node`, error.message);
            throw error;
        }
    }

    /**
     * Fetch nodes for multiple cards (for stair connection management)
     */
    static async fetchNodesForAllCards(cardIds: string[]): Promise<INavNode[]> {
        try {
            console.log(`[NavNodeService] Fetching nodes for ${cardIds.length} cards`);

            const promises = cardIds.map(cardId => this.fetchNodesByCard(cardId));
            const results = await Promise.all(promises);
            const combined = results.flat();

            console.log(`[NavNodeService] Successfully fetched ${combined.length} total nodes from all cards`);
            return combined;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error fetching nodes for all cards:`, error.message);
            throw error;
        }
    }

    /**
     * Create a new navigation node
     */
    static async createNode(nodeData: CreateNavNodeRequest): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Creating node:`, nodeData);

            const response = await api.post(BASE_URL, nodeData);

            if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.Created) {
                throw new Error(`Error response creating node: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully created node:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error creating node:`, error.message);
            throw error;
        }
    }

    /**
     * Connect two nodes on the same card
     */
    static async connectNodes(nodeId: string, targetNodeId: string): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Connecting nodes: ${nodeId} -> ${targetNodeId}`);

            const response = await api.post(
                `${BASE_URL}/${nodeId}/connect`,
                {targetNodeId} as ConnectNodesRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response connecting nodes: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully connected nodes:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error connecting nodes ${nodeId} -> ${targetNodeId}:`, error.message);
            throw error;
        }
    }

    /**
     * Disconnect two nodes
     */
    static async disconnectNodes(nodeId: string, targetNodeId: string): Promise<void> {
        try {
            console.log(`[NavNodeService] Disconnecting nodes: ${nodeId} <-> ${targetNodeId}`);

            const response = await api.delete(`${BASE_URL}/${nodeId}/disconnect/${targetNodeId}`);

            if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Error response disconnecting nodes: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully disconnected nodes`);
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error disconnecting nodes ${nodeId} <-> ${targetNodeId}:`, error.message);
            throw error;
        }
    }

    /**
     * Delete a navigation node
     */
    static async deleteNode(nodeId: string): Promise<void> {
        try {
            console.log(`[NavNodeService] Deleting node: ${nodeId}`);

            const response = await api.delete(`${BASE_URL}/${nodeId}`);

            if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Error response deleting node: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully deleted node: ${nodeId}`);
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error deleting node ${nodeId}:`, error.message);
            throw error;
        }
    }

    /**
     * Fetch all stair connections
     */
    static async fetchStairConnections(): Promise<IStairConnection[]> {
        try {

            const response = await api.get(BASE_URL + "/stair-connections");

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response fetching stair connections: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} stair connections:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error fetching stair connections:`, error.message);
            throw error;
        }
    }

    /**
     * Fetch stair connections for a specific card
     */
    static async fetchStairConnectionsByCard(cardId: string, tenantId: string): Promise<IStairConnection[]> {
        try {
            console.log(`[NavNodeService] Fetching stair connections for card: ${cardId}`);

            const response = await api.get(BASE_URL + "/stair-connections", {
                headers: {
                    'X-Tenant-Id': tenantId
                },
                params: {cardId}
            });

            if (response.status !== HttpStatusCode.Ok) {
                throw new Error(`Error response fetching stair connections for card: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} stair connections for card:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error fetching stair connections for card ${cardId}:`, error.message);
            throw error;
        }
    }

    /**
     * Create a stair connection between two floors
     */
    static async createStairConnection(
        connectionData: CreateStairConnectionRequest
    ): Promise<IStairConnection> {
        try {
            console.log(`[NavNodeService] Creating stair connection:`, connectionData);

            const response = await api.post(BASE_URL + "/stair-connections", connectionData);

            if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.Created) {
                throw new Error(`Error response creating stair connection: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully created stair connection:`, response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error creating stair connection:`, error.message);
            throw error;
        }
    }

    /**
     * Delete a stair connection
     */
    static async deleteStairConnection(connectionId: string): Promise<void> {
        try {
            console.log(`[NavNodeService] Deleting stair connection: ${connectionId}`);

            const response = await api.delete(BASE_URL + "/stair-connections/" + connectionId);

            if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Error response deleting stair connection: ${response.status}`);
            }

            console.log(`[NavNodeService] Successfully deleted stair connection: ${connectionId}`);
        } catch (err) {
            const error: Error = err as Error;
            console.error(`[NavNodeService] Error deleting stair connection ${connectionId}:`, error.message);
            throw error;
        }
    }
}

export default NavNodeService;