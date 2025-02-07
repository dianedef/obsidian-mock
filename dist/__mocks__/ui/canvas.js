import { vi } from 'vitest';
import { Events } from '../components/events';
export class Canvas extends Events {
    constructor() {
        super();
        this.data = {
            nodes: [],
            edges: []
        };
        this.register = vi.fn();
        this.registerEvent = vi.fn();
        // Gestion des nœuds
        this.addNode = vi.fn().mockImplementation((node) => {
            this.data.nodes.push(node);
            return node;
        });
        this.getNodeById = vi.fn().mockImplementation((id) => {
            return this.data.nodes.find(node => node.id === id);
        });
        this.removeNode = vi.fn().mockImplementation((id) => {
            this.data.nodes = this.data.nodes.filter(node => node.id !== id);
            this.data.edges = this.data.edges.filter(edge => edge.fromNode !== id && edge.toNode !== id);
        });
        this.updateNode = vi.fn().mockImplementation((id, data) => {
            const nodeIndex = this.data.nodes.findIndex(node => node.id === id);
            if (nodeIndex !== -1) {
                const updatedNode = { ...this.data.nodes[nodeIndex], ...data };
                if (this.isValidCanvasNode(updatedNode)) {
                    this.data.nodes[nodeIndex] = updatedNode;
                }
            }
        });
        // Gestion des arêtes
        this.addEdge = vi.fn().mockImplementation((edge) => {
            this.data.edges.push(edge);
            return edge;
        });
        this.getEdgeById = vi.fn().mockImplementation((id) => {
            return this.data.edges.find(edge => edge.id === id);
        });
        this.removeEdge = vi.fn().mockImplementation((id) => {
            this.data.edges = this.data.edges.filter(edge => edge.id !== id);
        });
        this.updateEdge = vi.fn().mockImplementation((id, data) => {
            const edgeIndex = this.data.edges.findIndex(edge => edge.id === id);
            if (edgeIndex !== -1) {
                this.data.edges[edgeIndex] = { ...this.data.edges[edgeIndex], ...data };
            }
        });
        // Gestion du canvas
        this.setData = vi.fn().mockImplementation((data) => {
            this.data = data;
        });
        this.getData = vi.fn().mockImplementation(() => {
            return this.data;
        });
        // Gestion des groupes
        this.createGroup = vi.fn().mockImplementation((_nodes) => { });
        // Gestion de la vue
        this.onload = vi.fn();
        this.onunload = vi.fn();
        this.onResize = vi.fn();
        this.onPaneMenu = vi.fn();
        this.onHeaderMenu = vi.fn();
        // Gestion de l'état
        this.getViewType = vi.fn().mockReturnValue('canvas');
        this.getDisplayText = vi.fn().mockReturnValue('Canvas');
        this.getIcon = vi.fn().mockReturnValue('document');
        // Gestion de la sélection
        this.selectElement = vi.fn();
        this.deselectElement = vi.fn();
        this.clearSelection = vi.fn();
        this.getSelection = vi.fn().mockReturnValue([]);
        // Gestion du zoom et de la position
        this.zoomToSelection = vi.fn();
        this.zoomToFit = vi.fn();
        this.zoomBy = vi.fn();
        this.setZoom = vi.fn();
        this.getZoom = vi.fn().mockReturnValue(1);
        this.getViewport = vi.fn().mockReturnValue({ x: 0, y: 0, width: 800, height: 600 });
        // Gestion de l'historique
        this.undo = vi.fn();
        this.redo = vi.fn();
        this.canUndo = vi.fn().mockReturnValue(false);
        this.canRedo = vi.fn().mockReturnValue(false);
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('canvas-wrapper');
    }
    // Méthodes de Component
    load() {
        this.onload();
    }
    unload() {
        this.onunload();
    }
    addChild(component) {
        return component;
    }
    removeChild(component) {
        return component;
    }
    registerDomEvent(_el, _type, _callback, _options) { }
    registerInterval(id) {
        return id;
    }
    isValidCanvasNode(node) {
        return (node.id &&
            typeof node.x === 'number' &&
            typeof node.y === 'number' &&
            typeof node.width === 'number' &&
            typeof node.height === 'number' &&
            ((node.type === 'file' && typeof node.file === 'string') ||
                (node.type === 'text' && typeof node.text === 'string') ||
                (node.type === 'link' && typeof node.url === 'string') ||
                (node.type === 'group')));
    }
}
