export interface IRoom {
    id: string;
    roomNumber: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    assignedObjectIds: string[];
    cardId: string;
    eventId?: string
}

export interface IRoomDetailed {
    id: number;
    roomNumber: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    assignedObjects: IObject[];
    cardId: string;
    eventId?: string;
}

export interface IObject {
    id: string;
    typeId: string;
    attributes: Record<string, any>;
    assignedRoomId?: string;
}

export interface IVisibilityConfig {
    visible: boolean;
    order: number;
}

export interface IObjectField {
    key: string;
    label: string;
    type: "text" | "number" | "email" | "image";
    required: boolean;
    searchable: boolean;
    sortable: boolean;
    placeholder: string

    dropdown: IVisibilityConfig;
    card: IVisibilityConfig;
    marker: IVisibilityConfig;
}

export interface IObjectTypeCreate {
    name: string;
    displayName: string;
    description: string;
    icon: string;
    color: string;

    visibleInApp: boolean;
    visibleInAdmin: boolean;

    schema: IObjectField[];
}

export interface IObjectType extends IObjectTypeCreate {
    id: string
}

export interface ICard {
    id: string
    title: string
    imagePath: string
    startNodeId: string
    imageWidth: number
    imageHeight: number
}


export interface IEvent {
    id: string
    name: string
    startDateTime: string
    endDateTime?: string
    description?: string
    active?: boolean
    themeColor: string
    announcement?: string
}

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

export interface CreateNavNodeRequest {
    x: number;
    y: number;
    type: 'NORMAL' | 'HALLWAY' | 'STAIRS';
    cardId: string;
}

export interface ConnectNodesRequest {
    targetNodeId: string;
}

export interface CreateStairConnectionRequest {
    node1Id: string;
    node2Id: string;
    card1Id: string;
    card2Id: string;
    name: string;
}

export interface IAuthResponse {
    token: string;
    refreshToken: string;
    id: string;
    email: string;
    roles: string[];
}

export interface IUser {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    lastLoginAt: Date;
    enabled:boolean;
    roles: string[];
}

export interface RegisterTenantRequest {
    tenantName: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    password: string;
    repeatPassword: string;
}

export interface ITenant {
    id: string;
    name: string;
    displayName: string;
    joinCode: string;
    apiKey: string;
    active: boolean;
}