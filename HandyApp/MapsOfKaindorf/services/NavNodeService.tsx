import {AxiosError} from 'axios';
import {API_URL} from '@/config';
import api from "@/api/axios";

export interface INavNode {
    id: string;
    x: number;
    y: number;
    type: 'NORMAL' | 'HALLWAY' | 'STAIRS';
    neighbors: string[];
    cardId: string;
}

export interface IStairConnection {
    id: string;
    node1Id: string;
    node2Id: string;
    card1Id: string;
    card2Id: string;
    name: string;
}

interface ApiNavNode {
    id: string;
    x: number;
    y: number;
    type: 'NORMAL' | 'HALLWAY' | 'STAIRS';
    neighbors: string[];
    cardId: string;
}

class NavNodeService {
    private static BASE_URL = `${API_URL}/nav-nodes`;
    private static STAIR_CONNECTIONS_URL = `${API_URL}/nav-nodes/stair-connections`;

    static async fetchNodesByCard(cardId: string): Promise<INavNode[]> {
        try {
            console.log(`[NavNodeService] Fetching nodes for card: ${cardId}`);

            const response = await api.get<ApiNavNode[]>(this.BASE_URL, {
                params: {cardId}
            });

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} nodes:`, response.data);

            return response.data.map(node => ({
                ...node,
                type: node.type as 'NORMAL' | 'HALLWAY' | 'STAIRS'
            }));
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[NavNodeService] Error fetching nodes for card ${cardId}:`, err.message);
            console.error('[NavNodeService] Error details:', err.response?.data);
            throw err;
        }
    }

    static async fetchStartNode(): Promise<INavNode> {
        try {
            console.log(`[NavNodeService] Fetching start node`);

            const response = await api.get<ApiNavNode>(this.BASE_URL + "/start");

            console.log(`[NavNodeService] Successfully fetched start node: `, response.data);

            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[NavNodeService] Error fetching start node:`, err.message);
            console.error('[NavNodeService] Error details:', err.response?.data);
            throw err;
        }
    }

    /**
     * Fetch nodes for multiple cards at once
     */
    static async fetchNodesForAllCards(cardIds: string[]): Promise<INavNode[]> {
        try {
            console.log(`[NavNodeService] Fetching nodes for ${cardIds.length} cards:`, cardIds);

            const promises = cardIds.map(cardId => this.fetchNodesByCard(cardId));
            const results = await Promise.all(promises);
            const combined = results.flat();

            console.log(`[NavNodeService] Successfully fetched ${combined.length} total nodes from all cards`);
            return combined;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[NavNodeService] Error fetching nodes for all cards:`, err.message);
            throw err;
        }
    }

    /**
     * Fetch all stair connections
     */
    static async fetchStairConnections(): Promise<IStairConnection[]> {
        try {

            const response = await api.get<IStairConnection[]>(this.STAIR_CONNECTIONS_URL);

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} stair connections:`, response.data);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[NavNodeService] Error fetching stair connections:`, err.message);
            console.error('[NavNodeService] Error details:', err.response?.data);
            throw err;
        }
    }

    /**
     * Fetch stair connections for a specific card
     */
    static async fetchStairConnectionsByCard(cardId: string): Promise<IStairConnection[]> {
        try {
            console.log(`[NavNodeService] Fetching stair connections for card: ${cardId}`);

            const response = await api.get<IStairConnection[]>(this.STAIR_CONNECTIONS_URL, {
                params: {cardId}
            });

            console.log(`[NavNodeService] Successfully fetched ${response.data.length} stair connections for card`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[NavNodeService] Error fetching stair connections for card ${cardId}:`, err.message);
            throw err;
        }
    }
}

export default NavNodeService;