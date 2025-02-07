import { vi } from 'vitest';
import type { Component as ObsidianComponent, EventRef } from 'obsidian';
import { Events } from '../components/events';
import type { 
    CanvasData,
    CanvasNodeData,
    CanvasEdgeData,
    AllCanvasNodeData,
    CanvasColor,
    NodeSide,
    EdgeEnd,
    BackgroundStyle
} from 'obsidian/canvas';

export type { 
    CanvasNodeData,
    CanvasColor,
    NodeSide,
    EdgeEnd,
    BackgroundStyle
} from 'obsidian/canvas';

export class Canvas extends Events implements ObsidianComponent {
    data: CanvasData = {
        nodes: [],
        edges: []
    };

    containerEl: HTMLElement;

    constructor() {
        super();
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('canvas-wrapper');
    }

    // Méthodes de Component
    load(): void {
        this.onload();
    }

    unload(): void {
        this.onunload();
    }

    addChild<T extends ObsidianComponent>(component: T): T {
        return component;
    }

    removeChild<T extends ObsidianComponent>(component: T): T {
        return component;
    }

    register = vi.fn();

    registerEvent = vi.fn();

    registerDomEvent<K extends keyof WindowEventMap>(
        el: Window,
        type: K,
        callback: (this: HTMLElement, ev: WindowEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof DocumentEventMap>(
        el: Document,
        type: K,
        callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(
        el: HTMLElement,
        type: K,
        callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent(_el: any, _type: string, _callback: any, _options?: boolean | AddEventListenerOptions): void {}

    registerInterval(id: number): number {
        return id;
    }

    // Gestion des nœuds
    addNode = vi.fn().mockImplementation((node: AllCanvasNodeData) => {
        this.data.nodes.push(node);
        return node;
    });

    getNodeById = vi.fn().mockImplementation((id: string): AllCanvasNodeData | undefined => {
        return this.data.nodes.find(node => node.id === id);
    });

    removeNode = vi.fn().mockImplementation((id: string): void => {
        this.data.nodes = this.data.nodes.filter(node => node.id !== id);
        this.data.edges = this.data.edges.filter(
            edge => edge.fromNode !== id && edge.toNode !== id
        );
    });

    updateNode = vi.fn().mockImplementation((id: string, data: Partial<AllCanvasNodeData>): void => {
        const nodeIndex = this.data.nodes.findIndex(node => node.id === id);
        if (nodeIndex !== -1) {
            const updatedNode = { ...this.data.nodes[nodeIndex], ...data };
            if (this.isValidCanvasNode(updatedNode)) {
                this.data.nodes[nodeIndex] = updatedNode;
            }
        }
    });

    private isValidCanvasNode(node: any): node is AllCanvasNodeData {
        return (
            node.id &&
            typeof node.x === 'number' &&
            typeof node.y === 'number' &&
            typeof node.width === 'number' &&
            typeof node.height === 'number' &&
            (
                (node.type === 'file' && typeof node.file === 'string') ||
                (node.type === 'text' && typeof node.text === 'string') ||
                (node.type === 'link' && typeof node.url === 'string') ||
                (node.type === 'group')
            )
        );
    }

    // Gestion des arêtes
    addEdge = vi.fn().mockImplementation((edge: CanvasEdgeData) => {
        this.data.edges.push(edge);
        return edge;
    });

    getEdgeById = vi.fn().mockImplementation((id: string): CanvasEdgeData | undefined => {
        return this.data.edges.find(edge => edge.id === id);
    });

    removeEdge = vi.fn().mockImplementation((id: string): void => {
        this.data.edges = this.data.edges.filter(edge => edge.id !== id);
    });

    updateEdge = vi.fn().mockImplementation((id: string, data: Partial<CanvasEdgeData>): void => {
        const edgeIndex = this.data.edges.findIndex(edge => edge.id === id);
        if (edgeIndex !== -1) {
            this.data.edges[edgeIndex] = { ...this.data.edges[edgeIndex], ...data };
        }
    });

    // Gestion du canvas
    setData = vi.fn().mockImplementation((data: CanvasData): void => {
        this.data = data;
    });

    getData = vi.fn().mockImplementation((): CanvasData => {
        return this.data;
    });

    // Gestion des groupes
    createGroup = vi.fn().mockImplementation((_nodes: AllCanvasNodeData[]): void => {});

    // Gestion de la vue
    onload = vi.fn();
    onunload = vi.fn();
    onResize = vi.fn();
    onPaneMenu = vi.fn();
    onHeaderMenu = vi.fn();

    // Gestion de l'état
    getViewType = vi.fn().mockReturnValue('canvas');
    getDisplayText = vi.fn().mockReturnValue('Canvas');
    getIcon = vi.fn().mockReturnValue('document');

    // Gestion de la sélection
    selectElement = vi.fn();
    deselectElement = vi.fn();
    clearSelection = vi.fn();
    getSelection = vi.fn().mockReturnValue([]);

    // Gestion du zoom et de la position
    zoomToSelection = vi.fn();
    zoomToFit = vi.fn();
    zoomBy = vi.fn();
    setZoom = vi.fn();
    getZoom = vi.fn().mockReturnValue(1);
    getViewport = vi.fn().mockReturnValue({ x: 0, y: 0, width: 800, height: 600 });

    // Gestion de l'historique
    undo = vi.fn();
    redo = vi.fn();
    canUndo = vi.fn().mockReturnValue(false);
    canRedo = vi.fn().mockReturnValue(false);
} 