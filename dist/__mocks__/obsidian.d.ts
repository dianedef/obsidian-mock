import type { Workspace as IWorkspace, WorkspaceLeaf as IWorkspaceLeaf, WorkspaceSidedock as IWorkspaceSidedock, WorkspaceItem as IWorkspaceItem, WorkspaceRoot as IWorkspaceRoot, MarkdownFileInfo as IMarkdownFileInfo, Debouncer, Events as IEvents, EventRef, App as ObsidianApp, Scope as IScope } from 'obsidian';
import { vi } from 'vitest';
import { Events } from './components/events';
import { Scope } from 'obsidian';
export * from './components/component';
export * from './components/value-component';
export * from './components/closeable-component';
export * from './core/abstract-file';
export * from './core/app';
export * from './core/data-adapter';
export * from './core/file-manager';
export * from './core/file-system-adapter';
export * from './core/folder';
export * from './core/metadata-cache';
export * from './core/vault';
export * from './ui/canvas';
export * from './ui/color-component';
export * from './ui/dropdown-component';
export * from './ui/extra-button-component';
export * from './ui/fuzzy-suggest';
export * from './ui/menu';
export * from './ui/modal';
export * from './ui/notice';
export * from './ui/plugin-setting-tab';
export * from './ui/setting';
export * from './ui/setting-tab';
export * from './ui/slider';
export * from './ui/suggest-modal';
export interface IMockScope {
    register: ReturnType<typeof vi.fn>;
    unregister: ReturnType<typeof vi.fn>;
}
export declare const createMockScope: () => IMockScope;
export interface MockEventRef extends EventRef {
    id: string;
}
export declare class Events implements IEvents {
    private eventRefs;
    private nextEventId;
    on(name: string, callback: (...data: any) => any, ctx?: any): MockEventRef;
    off(name: string, callback: (...data: any) => any): void;
    offref(ref: MockEventRef): void;
    trigger(name: string, ...data: any[]): void;
    tryTrigger(name: string, ...data: any[]): void;
}
export declare class Scope implements IScope {
    register: import("vitest/dist").Mock<any, any>;
    unregister: import("vitest/dist").Mock<any, any>;
}
export declare class MockWorkspace extends Events implements IWorkspace {
    containerEl: HTMLElement;
    activeLeaf: IWorkspaceLeaf | null;
    leftSplit: IWorkspaceSidedock;
    rightSplit: IWorkspaceSidedock;
    leftRibbon: any;
    rightRibbon: any;
    rootSplit: IWorkspaceRoot;
    floatingSplit: IWorkspaceItem | null;
    activeEditor: IMarkdownFileInfo | null;
    layoutReady: boolean;
    constructor(app?: ObsidianApp);
    getActiveViewOfType: import("vitest/dist").Mock<any, any>;
    on: import("vitest/dist").Mock<any, any>;
    off: import("vitest/dist").Mock<any, any>;
    onLayoutReady: import("vitest/dist").Mock<any, any>;
    requestSaveLayout: Debouncer<[], Promise<void>>;
    requestSaveHistory: import("vitest/dist").Mock<any, any>;
    setActiveLeaf: import("vitest/dist").Mock<any, any>;
    getLeftLeaf: import("vitest/dist").Mock<any, any>;
    getRightLeaf: import("vitest/dist").Mock<any, any>;
    getLeaf: import("vitest/dist").Mock<any, any>;
    getUnpinnedLeaf: import("vitest/dist").Mock<any, any>;
    openLinkText: import("vitest/dist").Mock<any, any>;
    setActiveGroup: import("vitest/dist").Mock<any, any>;
    getActiveFile: import("vitest/dist").Mock<any, any>;
    getLastOpenFiles: import("vitest/dist").Mock<any, any>;
    iterateLeaves: import("vitest/dist").Mock<any, any>;
    getLeavesOfType: import("vitest/dist").Mock<any, any>;
    getFirstLeafOfType: import("vitest/dist").Mock<any, any>;
    changeLayout: import("vitest/dist").Mock<any, any>;
    getLayout: import("vitest/dist").Mock<any, any>;
    createLeafInParent: import("vitest/dist").Mock<any, any>;
    createLeafBySplit: import("vitest/dist").Mock<any, any>;
    splitLeaf: import("vitest/dist").Mock<any, any>;
    splitActiveLeaf: import("vitest/dist").Mock<any, any>;
    duplicateLeaf: import("vitest/dist").Mock<any, any>;
    getLeafById: import("vitest/dist").Mock<any, any>;
    getGroupLeaves: import("vitest/dist").Mock<any, any>;
    getMostRecentLeaf: import("vitest/dist").Mock<any, any>;
    getLeftSplit: import("vitest/dist").Mock<any, any>;
    getRightSplit: import("vitest/dist").Mock<any, any>;
    iterateAllLeaves: import("vitest/dist").Mock<any, any>;
    detachLeavesOfType: import("vitest/dist").Mock<any, any>;
    revealLeaf: import("vitest/dist").Mock<any, any>;
    moveLeafToPopout: import("vitest/dist").Mock<any, any>;
    duplicateLeafToPopout: import("vitest/dist").Mock<any, any>;
    openPopoutLeaf: import("vitest/dist").Mock<any, any>;
    ensureSideLeaf: import("vitest/dist").Mock<any, any>;
    toggleLeafPinned: import("vitest/dist").Mock<any, any>;
    setGroupVisibility: import("vitest/dist").Mock<any, any>;
    toggleMobileDrawer: import("vitest/dist").Mock<any, any>;
    pushHistory: import("vitest/dist").Mock<any, any>;
    popHistory: import("vitest/dist").Mock<any, any>;
    recordHistory: import("vitest/dist").Mock<any, any>;
    getCurrentLayout: import("vitest/dist").Mock<any, any>;
    loadLayout: import("vitest/dist").Mock<any, any>;
    iterateRootLeaves: import("vitest/dist").Mock<any, any>;
    getDropLocation: import("vitest/dist").Mock<any, any>;
    handleDrop: import("vitest/dist").Mock<any, any>;
    getWindow: import("vitest/dist").Mock<any, any>;
    updateOptions: import("vitest/dist").Mock<any, any>;
    trigger: import("vitest/dist").Mock<any, any>;
}
export interface IApp {
    workspace: IWorkspace;
    scope: IScope;
    vault: any;
    metadataCache: any;
    fileManager: any;
    keymap: any;
    lastEvent: any;
}
export declare class App implements ObsidianApp {
    workspace: IWorkspace;
    vault: any;
    metadataCache: any;
    fileManager: any;
    keymap: any;
    scope: IScope;
    lastEvent: any;
    constructor();
}
export declare class View {
    app: App;
    leaf: WorkspaceLeaf;
    containerEl: HTMLElement;
    constructor(leaf: WorkspaceLeaf);
    onload(): void;
    onunload(): void;
    protected onOpen(): Promise<void>;
    protected onClose(): Promise<void>;
}
export declare class Component extends Events {
    containerEl: HTMLElement;
    onload(): void;
    onunload(): void;
}
export declare class Modal extends Component {
    app: App;
    scope: IScope;
    constructor(app: App);
    open(): void;
    close(): void;
}
export declare class Plugin extends Component {
    app: App;
    manifest: any;
    constructor(app: App, manifest: any);
    onUserEnable(): void;
    onExternalSettingsChange(): void;
}
export declare class WorkspaceLeaf extends Events {
    view: View | null;
    containerEl: HTMLElement;
    app: App;
    private _isDeferred;
    constructor(app: App);
    get isDeferred(): boolean;
    loadIfDeferred(): Promise<void>;
}
export declare class Workspace extends Events {
    app: App;
    containerEl: HTMLElement;
    constructor(app: App);
}
export declare class Vault extends Events {
    adapter: {
        read: import("vitest/dist").Mock<any, any>;
        write: import("vitest/dist").Mock<any, any>;
        exists: import("vitest/dist").Mock<any, any>;
        stat: import("vitest/dist").Mock<any, any>;
        list: import("vitest/dist").Mock<any, any>;
        mkdir: import("vitest/dist").Mock<any, any>;
        rmdir: import("vitest/dist").Mock<any, any>;
        remove: import("vitest/dist").Mock<any, any>;
        rename: import("vitest/dist").Mock<any, any>;
        copy: import("vitest/dist").Mock<any, any>;
    };
}
export declare class MetadataCache extends Events {
    getFileCache: import("vitest/dist").Mock<any, any>;
    getCache: import("vitest/dist").Mock<any, any>;
    fileToLinktext: import("vitest/dist").Mock<any, any>;
    getFirstLinkpathDest: import("vitest/dist").Mock<any, any>;
    getFrontMatterInfo: import("vitest/dist").Mock<any, any>;
    resolvedLinks: {};
    unresolvedLinks: {};
    frontmatterLinks: Map<string, LinkCache[]>;
}
export interface Scope {
    register(cb: () => any): void;
    unregister(cb: () => any): void;
}
export interface TFile {
    path: string;
    name: string;
    vault: Vault;
    basename: string;
    extension: string;
}
export interface TFolder {
    path: string;
    name: string;
    vault: Vault;
    children: TAbstractFile[];
    parent: TFolder | null;
    isRoot(): boolean;
}
export type TAbstractFile = TFile | TFolder;
export interface Instruction {
    command: string;
    purpose: string;
}
export interface SearchMatchPart extends Array<number> {
    0: number;
    1: number;
}
export type SearchMatches = SearchMatchPart[];
export interface FuzzyMatch<T> {
    item: T;
    match: {
        score: number;
        matches: SearchMatches;
    };
}
export interface TooltipOptions {
    placement?: string;
    delay?: number;
}
export declare function setTooltip(el: HTMLElement, tooltip: string, options?: TooltipOptions): void;
export interface LinkCache {
    link: string;
    displayText?: string;
    position: {
        start: {
            line: number;
            col: number;
            offset: number;
        };
        end: {
            line: number;
            col: number;
            offset: number;
        };
    };
}
export declare class ProgressBarComponent extends Component {
    containerEl: HTMLElement;
    progressEl: HTMLElement;
    value: number;
    constructor(containerEl: HTMLElement);
    setValue(value: number): this;
    getValue(): number;
}
export interface MarkdownPostProcessor {
    (el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> | void;
    sortOrder?: number;
}
export interface MarkdownPostProcessorContext {
    docId: string;
    sourcePath: string;
    frontmatter: any | null | undefined;
    addChild(child: Component): void;
    getSectionInfo(el: HTMLElement): MarkdownSectionInformation | null;
}
export interface MarkdownSectionInformation {
    text: string;
    lineStart: number;
    lineEnd: number;
}
export declare class Publish extends Events {
    private currentFile;
    private postProcessors;
    get currentFilepath(): string;
    registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): MarkdownPostProcessor;
    registerMarkdownCodeBlockProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, sortOrder?: number): MarkdownPostProcessor;
}
declare global {
    var publish: Publish;
}
export { FuzzySuggestModal } from './ui/fuzzy-suggest';
export declare abstract class BaseFuzzySuggestModal<T> extends Events {
    app: App;
    scope: Scope;
    inputEl: HTMLInputElement;
    resultContainerEl: HTMLElement;
    items: T[];
    limit: number;
    emptyStateText: string;
    containerEl: HTMLElement;
    modalEl: HTMLElement;
    titleEl: HTMLElement;
    contentEl: HTMLElement;
    constructor(app: App);
    abstract getItems(): T[];
    abstract getItemText(item: T): string;
    abstract onChooseItem(item: T, evt: MouseEvent | KeyboardEvent): void;
    abstract renderSuggestion(item: T, el: HTMLElement): void;
}
