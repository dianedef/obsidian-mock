import type { Component as ObsidianComponent } from 'obsidian';
import { Events } from '../components/events';
import type { CanvasData } from 'obsidian/canvas';
export type { CanvasNodeData, CanvasColor, NodeSide, EdgeEnd, BackgroundStyle } from 'obsidian/canvas';
export declare class Canvas extends Events implements ObsidianComponent {
    data: CanvasData;
    containerEl: HTMLElement;
    constructor();
    load(): void;
    unload(): void;
    addChild<T extends ObsidianComponent>(component: T): T;
    removeChild<T extends ObsidianComponent>(component: T): T;
    register: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerInterval(id: number): number;
    addNode: import("vitest/dist").Mock<any, any>;
    getNodeById: import("vitest/dist").Mock<any, any>;
    removeNode: import("vitest/dist").Mock<any, any>;
    updateNode: import("vitest/dist").Mock<any, any>;
    private isValidCanvasNode;
    addEdge: import("vitest/dist").Mock<any, any>;
    getEdgeById: import("vitest/dist").Mock<any, any>;
    removeEdge: import("vitest/dist").Mock<any, any>;
    updateEdge: import("vitest/dist").Mock<any, any>;
    setData: import("vitest/dist").Mock<any, any>;
    getData: import("vitest/dist").Mock<any, any>;
    createGroup: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    onResize: import("vitest/dist").Mock<any, any>;
    onPaneMenu: import("vitest/dist").Mock<any, any>;
    onHeaderMenu: import("vitest/dist").Mock<any, any>;
    getViewType: import("vitest/dist").Mock<any, any>;
    getDisplayText: import("vitest/dist").Mock<any, any>;
    getIcon: import("vitest/dist").Mock<any, any>;
    selectElement: import("vitest/dist").Mock<any, any>;
    deselectElement: import("vitest/dist").Mock<any, any>;
    clearSelection: import("vitest/dist").Mock<any, any>;
    getSelection: import("vitest/dist").Mock<any, any>;
    zoomToSelection: import("vitest/dist").Mock<any, any>;
    zoomToFit: import("vitest/dist").Mock<any, any>;
    zoomBy: import("vitest/dist").Mock<any, any>;
    setZoom: import("vitest/dist").Mock<any, any>;
    getZoom: import("vitest/dist").Mock<any, any>;
    getViewport: import("vitest/dist").Mock<any, any>;
    undo: import("vitest/dist").Mock<any, any>;
    redo: import("vitest/dist").Mock<any, any>;
    canUndo: import("vitest/dist").Mock<any, any>;
    canRedo: import("vitest/dist").Mock<any, any>;
}
