import React, {useState, useEffect, useCallback} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import StairConnectionModal from './StairConnectionModal';
import ConfirmDialog from './ConfirmDialog';
import {INavNode, ICard, IStairConnection} from '../models/interfaces';
import {FaInfoCircle} from 'react-icons/fa';
import {IoChevronDown, IoChevronUp} from 'react-icons/io5';
import NavNodeService from '../services/NavNodeService';
import AuthService from '../services/AuthService.tsx';
import {SELECTED_CONF, URL_START} from '../config.ts';
import {useAuth} from '../context/AuthContext.tsx';

interface NodeEditorProps {
    card: ICard;
    allCards: ICard[];
    onCardChange: (card: ICard) => void;
}

type EditorMode = 'view' | 'add' | 'connect' | 'delete' | 'stairs' | 'setStart';

interface INavNodeWithStart extends INavNode {
    isStart?: boolean;
}

const NodeEditor: React.FC<NodeEditorProps> = ({card, allCards, onCardChange}) => {
    const {isViewer} = useAuth();

    const [nodes, setNodes]                           = useState<INavNodeWithStart[]>([]);
    const [stairConnections, setStairConnections]     = useState<IStairConnection[]>([]);
    const [mode, setMode]                             = useState<EditorMode>('view');
    const [selectedNodeType, setSelectedNodeType]     = useState<'HALLWAY' | 'STAIRS' | 'NORMAL'>('NORMAL');
    const [connectingFrom, setConnectingFrom]         = useState<{nodeId: string; cardId: string} | null>(null);
    const [imageDimensions, setImageDimensions]       = useState({width: 0, height: 0});
    const [showInfo, setShowInfo]                     = useState(true);
    const [imageBlobUrl, setImageBlobUrl]             = useState<string | null>(null);
    const [startNodeId, setStartNodeId]               = useState<string | null>(null);
    const [startNodeCardId, setStartNodeCardId]       = useState<string | null>(null);
    const [showStairConnectionModal, setShowStairConnectionModal] = useState(false);
    const [stairConnectionData, setStairConnectionData] = useState<{
        node1Id: string; node2Id: string; card1Id: string; card2Id: string;
    } | null>(null);
    const [confirmDialog, setConfirmDialog]           = useState<{isOpen: boolean; nodeId?: string}>({isOpen: false});
    const [replaceStartDialog, setReplaceStartDialog] = useState<{
        isOpen: boolean; pendingNodeId?: string; existingCardName?: string;
    }>({isOpen: false});

    const loadNodes = useCallback(async () => {
        try { setNodes(await NavNodeService.fetchNodesByCard(card.id)); }
        catch { toast.error('Failed to load nodes.'); }
    }, [card.id]);

    const loadStairConnections = useCallback(async () => {
        try { setStairConnections(await NavNodeService.fetchStairConnections()); }
        catch { toast.error('Failed to load stair connections.'); }
    }, []);

    const loadStartNode = useCallback(async () => {
        try {
            const result = await NavNodeService.fetchStartNode();
            setStartNodeId(result?.id ?? null);
            setStartNodeCardId(result?.cardId ?? null);
        } catch { console.error('[NodeEditor] Failed to load start node'); }
    }, []);

    useEffect(() => {
        if (!card.imagePath) return;
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                const token = AuthService.getToken();
                const fullUrl = card.imagePath.startsWith('http')
                    ? card.imagePath
                    : `${URL_START[SELECTED_CONF]}${card.imagePath}`;
                const res = await fetch(fullUrl, {
                    headers: token ? {Authorization: `Bearer ${token}`} : {}
                });
                if (!res.ok) throw new Error(`Image load failed: ${res.status}`);
                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setImageBlobUrl(objectUrl);
                const img = new Image();
                img.onload = () => setImageDimensions({width: img.naturalWidth, height: img.naturalHeight});
                img.src = objectUrl;
            } catch (err) {
                console.error('Failed to load node editor map image:', err);
            }
        };

        fetchImage();
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [card.imagePath]);

    useEffect(() => {
        loadNodes();
        loadStairConnections();
        loadStartNode();
    }, [loadNodes,  loadStairConnections, loadStartNode]);

    const handleMapClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        if (mode !== 'add' || isViewer) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * imageDimensions.width);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * imageDimensions.height);
        const t = toast.loading('Creating node...');
        try {
            await NavNodeService.createNode({x, y, type: selectedNodeType, cardId: card.id});
            await loadNodes();
            toast.success('Node created.', {id: t});
        } catch { toast.error('Failed to create node.', {id: t}); }
    }, [mode, isViewer, selectedNodeType, card.id, imageDimensions, loadNodes]);

    const handleCreateStairConnection = async (name: string) => {
        if (!stairConnectionData) return;
        const t = toast.loading('Creating stair connection...');
        try {
            await NavNodeService.createStairConnection({...stairConnectionData, name});
            await loadStairConnections();
            setConnectingFrom(null); setShowStairConnectionModal(false); setStairConnectionData(null);
            toast.success(`Stair connection "${name}" created.`, {id: t});
        } catch { toast.error('Failed to create stair connection.', {id: t}); }
    };

    const applySetStartNode = useCallback(async (nodeId: string) => {
        const t = toast.loading('Setting start node...');
        try {
            await NavNodeService.setStartNode(nodeId, card.id);
            setStartNodeId(nodeId); setStartNodeCardId(card.id);
            toast.success('Start node updated.', {id: t});
        } catch { toast.error('Failed to set start node.', {id: t}); }
    }, [card.id]);

    const handleSetStartMode = useCallback((nodeId: string) => {
        if (startNodeId === nodeId) { toast('This node is already the start node.'); return; }
        if (startNodeId) {
            const existingCardName = startNodeCardId !== card.id
                ? allCards.find(c => c.id === startNodeCardId)?.title ?? 'another floor'
                : card.title;
            setReplaceStartDialog({isOpen: true, pendingNodeId: nodeId, existingCardName});
            return;
        }
        applySetStartNode(nodeId);
    }, [startNodeId, startNodeCardId, card.id, card.title, allCards, applySetStartNode]);

    const handleNodeClick = useCallback(async (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isViewer) return;

        if (mode === 'setStart') { handleSetStartMode(nodeId); return; }
        if (mode === 'delete')   { setConfirmDialog({isOpen: true, nodeId}); return; }

        if (mode === 'connect') {
            if (!connectingFrom) {
                setConnectingFrom({nodeId, cardId: card.id});
                toast('First node selected. Click the second node on this floor to connect them.');
            } else {
                const t = toast.loading('Connecting nodes...');
                try {
                    await NavNodeService.connectNodes(connectingFrom.nodeId, nodeId);
                    await loadNodes(); setConnectingFrom(null);
                    toast.success('Nodes connected.', {id: t});
                } catch {
                    toast.error('Failed to connect nodes.', {id: t});
                    setConnectingFrom(null);
                }
            }
            return;
        }

        if (mode === 'stairs') {
            const clickedNode = nodes.find(n => n.id === nodeId);
            if (!clickedNode || clickedNode.type !== 'STAIRS') {
                toast.error('Only nodes of type "Stairs" can be used for stair connections.');
                return;
            }
            if (!connectingFrom) {
                setConnectingFrom({nodeId, cardId: card.id});
                toast('Stair node selected. Switch to another floor and click the corresponding stair node.');
            } else {
                if (connectingFrom.cardId === card.id) {
                    toast.error('Stair connections must link nodes on different floors.');
                    setConnectingFrom(null); return;
                }
                setStairConnectionData({
                    node1Id: connectingFrom.nodeId, node2Id: nodeId,
                    card1Id: connectingFrom.cardId, card2Id: card.id,
                });
                setShowStairConnectionModal(true);
            }
        }
    }, [mode, isViewer, connectingFrom, card.id, nodes, loadNodes, handleSetStartMode]);

    const handleConfirmDelete = async () => {
        if (!confirmDialog.nodeId) return;
        const isStart = confirmDialog.nodeId === startNodeId;
        const t = toast.loading('Deleting node...');
        try {
            await NavNodeService.deleteNode(confirmDialog.nodeId);
            if (isStart) {
                await NavNodeService.clearStartNode();
                setStartNodeId(null); setStartNodeCardId(null);
            }
            await loadNodes();
            toast.success(isStart ? 'Node deleted — start node cleared.' : 'Node deleted.', {id: t});
            setConfirmDialog({isOpen: false});
        } catch {
            toast.error('Failed to delete node.', {id: t});
            setConfirmDialog({isOpen: false});
        }
    };

    const getNodeColor = (node: INavNodeWithStart) => {
        if (node.id === startNodeId) return '#F59E0B';
        switch (node.type) {
            case 'HALLWAY': return '#22C55E';
            case 'STAIRS':  return '#F97316';
            default:        return '#7C3AED';
        }
    };

    const getNodeBorder = (node: INavNodeWithStart) => {
        if (node.id === startNodeId)            return '3px solid #D97706';
        if (connectingFrom?.nodeId === node.id) return '3px solid #FBBF24';
        return '2px solid white';
    };

    const getNodeSize = (node: INavNodeWithStart) => node.id === startNodeId ? '28px' : '20px';
    const getCardName = (cardId: string) => allCards.find(c => c.id === cardId)?.title ?? 'Unknown';
    const startNodeIsOnThisCard = startNodeCardId === card.id;

    const allModeButtons: {key: EditorMode; label: string; active: string; inactive: string}[] = [
        { key: 'view',     label: 'View',             active: 'bg-gray-800 text-white border-transparent',     inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
        { key: 'add',      label: 'Add Node',         active: 'bg-green-600 text-white border-transparent',    inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
        { key: 'connect',  label: 'Connect',          active: 'bg-purple-600 text-white border-transparent',   inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
        { key: 'stairs',   label: 'Stair Connection', active: 'bg-orange-500 text-white border-transparent',   inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
        { key: 'setStart', label: 'Set Start',        active: 'bg-yellow-400 text-gray-900 border-yellow-500', inactive: 'bg-white text-gray-600 border-yellow-200 hover:bg-yellow-50' },
        { key: 'delete',   label: 'Delete',           active: 'bg-red-500 text-white border-transparent',      inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    ];

    // Viewer sieht nur View-Button
    const modeButtons = isViewer
        ? allModeButtons.filter(b => b.key === 'view')
        : allModeButtons;

    const statusMessages: Partial<Record<EditorMode, string>> = {
        view:     'View mode — no edits will be made.',
        add:      `Add mode — click on the floor plan to place a ${selectedNodeType} node.`,
        delete:   'Delete mode — click a node to remove it and all its connections.',
        setStart: 'Set Start mode — click any node to define the global navigation entry point.',
    };

    const getStatusMessage = () => {
        if (mode === 'connect') return connectingFrom
            ? 'Click the second node on this floor to complete the connection.'
            : 'Click the first node to start a connection (same floor only).';
        if (mode === 'stairs') return connectingFrom
            ? `Switch to another floor and click a Stairs node there (first node from: ${getCardName(connectingFrom.cardId)}).`
            : 'Click a Stairs node on this floor. Then switch to the target floor and click its corresponding Stairs node.';
        return statusMessages[mode] ?? '';
    };

    return (
        <div className="p-4 space-y-4">
            <Toaster position="top-right" toastOptions={{
                duration: 3500,
                style: {background: '#1f2937', color: '#f9fafb', fontSize: '13px', borderRadius: '8px'},
            }}/>

            <StairConnectionModal
                isOpen={showStairConnectionModal}
                onClose={() => { setShowStairConnectionModal(false); setStairConnectionData(null); setConnectingFrom(null); }}
                onConfirm={handleCreateStairConnection}
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.nodeId === startNodeId ? 'Delete Start Node' : 'Delete Node'}
                message={confirmDialog.nodeId === startNodeId
                    ? 'This is the current start node. Deleting it will remove the navigation entry point for all users. This action cannot be undone.'
                    : 'Delete this node? All connections involving this node will also be removed. This action cannot be undone.'
                }
                confirmText="Delete" cancelText="Cancel" variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({isOpen: false})}
            />

            <ConfirmDialog
                isOpen={replaceStartDialog.isOpen}
                title="Replace Start Node"
                message={`A start node already exists on floor "${replaceStartDialog.existingCardName}". Only one start node is allowed per tenant. Replacing it will move the navigation entry point to the selected node.`}
                confirmText="Replace" cancelText="Cancel" variant="danger"
                onConfirm={async () => {
                    if (replaceStartDialog.pendingNodeId) await applySetStartNode(replaceStartDialog.pendingNodeId);
                    setReplaceStartDialog({isOpen: false});
                }}
                onCancel={() => setReplaceStartDialog({isOpen: false})}
            />

            {/* Info panel */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                    onClick={() => setShowInfo(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FaInfoCircle className="text-purple-500" size={14}/>
                        Node Types — Reference
                    </div>
                    {showInfo ? <IoChevronUp size={16} className="text-gray-400"/> : <IoChevronDown size={16} className="text-gray-400"/>}
                </button>
                {showInfo && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid md:grid-cols-4 gap-3 pt-4">
                            {[
                                {dot: 'bg-purple-600',                          label: 'Normal',     desc: 'Standard waypoints in rooms or secondary areas.'},
                                {dot: 'bg-green-500',                           label: 'Hallway',    desc: 'Corridor nodes. Preferred by the A* pathfinding algorithm (lower traversal cost).'},
                                {dot: 'bg-orange-500',                          label: 'Stairs',     desc: 'Staircase nodes. Used to link different floors via cross-floor stair connections.'},
                                {dot: 'bg-yellow-400 border border-yellow-600', label: 'Start Node', desc: 'Global entry point. Exactly one per tenant — defines where users begin navigation.'},
                            ].map(item => (
                                <div key={item.label} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.dot}`}/>
                                        <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Start node status */}
            {startNodeId ? (
                <div className={`px-4 py-2.5 rounded-lg text-sm border flex items-center gap-2.5 ${
                    startNodeIsOnThisCard
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"/>
                    {startNodeIsOnThisCard
                        ? `Start node is located on this floor (${card.title}).`
                        : `Start node is on floor "${getCardName(startNodeCardId!)}" — switch there to view or change it.`
                    }
                </div>
            ) : (
                <div className="px-4 py-2.5 rounded-lg text-sm border bg-red-50 border-red-200 text-red-700 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"/>
                    No start node defined. Use <strong className="mx-1">Set Start</strong> mode to set the navigation entry point.
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                {modeButtons.map(btn => (
                    <button
                        key={btn.key}
                        onClick={() => { setMode(btn.key); setConnectingFrom(null); }}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                            mode === btn.key ? btn.active : btn.inactive
                        }`}
                    >
                        {btn.label}
                    </button>
                ))}

                {mode === 'add' && !isViewer && (
                    <select
                        value={selectedNodeType}
                        onChange={e => setSelectedNodeType(e.target.value as 'HALLWAY' | 'STAIRS' | 'NORMAL')}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="HALLWAY">Hallway</option>
                        <option value="STAIRS">Stairs</option>
                    </select>
                )}

                {/* Card Switch Dropdown */}
                <select
                    value={card.id}
                    onChange={e => {
                        const selected = allCards.find(c => c.id === e.target.value);
                        if (selected) { onCardChange(selected); setConnectingFrom(null); }
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {allCards.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>

                <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                    <span>Nodes: <strong className="text-gray-700">{nodes.length}</strong></span>
                    <span>Floor: <strong className="text-gray-700">{card.title}</strong></span>
                    <span>Stair connections: <strong className="text-gray-700">{stairConnections.length}</strong></span>
                </div>
            </div>

            {/* Map canvas */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                    backgroundImage: imageBlobUrl ? `url(${imageBlobUrl})` : 'none',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: isViewer ? 'default' : mode === 'add' ? 'crosshair' : mode === 'setStart' ? 'cell' : 'default',
                    border: mode === 'setStart' && !isViewer ? '2px solid #FBBF24' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                }}
                onClick={handleMapClick}
            >
                <svg style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
                    {nodes.map(node =>
                        node.neighbors.map(neighborId => {
                            const neighbor = nodes.find(n => n.id === neighborId);
                            if (!neighbor) return null;
                            return (
                                <line
                                    key={`${node.id}-${neighborId}`}
                                    x1={`${(node.x / imageDimensions.width) * 100}%`}
                                    y1={`${(node.y / imageDimensions.height) * 100}%`}
                                    x2={`${(neighbor.x / imageDimensions.width) * 100}%`}
                                    y2={`${(neighbor.y / imageDimensions.height) * 100}%`}
                                    stroke="rgba(107,114,128,0.55)"
                                    strokeWidth="1.5"
                                    strokeDasharray="5,4"
                                />
                            );
                        })
                    )}
                </svg>

                {nodes.map(node => {
                    const isStart = node.id === startNodeId;
                    return (
                        <div
                            key={node.id}
                            onClick={e => handleNodeClick(node.id, e)}
                            title={`${node.type}${isStart ? ' — Start Node' : ''} | ${node.neighbors.length} connection(s)`}
                            style={{
                                position: 'absolute',
                                left: `${(node.x / imageDimensions.width) * 100}%`,
                                top:  `${(node.y / imageDimensions.height) * 100}%`,
                                width:  getNodeSize(node),
                                height: getNodeSize(node),
                                borderRadius: '50%',
                                backgroundColor: getNodeColor(node),
                                border: getNodeBorder(node),
                                transform: 'translate(-50%, -50%)',
                                cursor: isViewer ? 'default' : 'pointer',
                                boxShadow: isStart
                                    ? '0 0 0 3px rgba(245,158,11,0.35), 0 2px 6px rgba(0,0,0,0.3)'
                                    : '0 1px 4px rgba(0,0,0,0.25)',
                                zIndex: isStart ? 10 : 1,
                                transition: 'all 0.15s ease',
                            }}
                        />
                    );
                })}
            </div>

            {/* Status bar */}
            <div className={`px-4 py-2.5 rounded-lg text-sm border ${
                mode === 'setStart' ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : mode === 'delete' ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
                {isViewer ? 'View only — you do not have permission to edit nodes.' : getStatusMessage()}
            </div>

            {/* Stair connections list */}
            {stairConnections.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Stair Connections
                        <span className="ml-2 text-xs font-normal text-gray-400">({stairConnections.length})</span>
                    </h4>
                    <ul className="divide-y divide-gray-100">
                        {stairConnections.map(conn => (
                            <li key={conn.id} className="py-2.5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">{conn.name}</span>
                                <span className="text-xs text-gray-400">
                                    {getCardName(conn.card1Id)} &harr; {getCardName(conn.card2Id)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NodeEditor;