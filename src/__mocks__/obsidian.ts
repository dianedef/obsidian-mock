import type { 
    Workspace as IWorkspace, 
    WorkspaceLeaf as IWorkspaceLeaf, 
    WorkspaceSidedock as IWorkspaceSidedock, 
    WorkspaceMobileDrawer as IWorkspaceMobileDrawer,
    WorkspaceParent as IWorkspaceParent,
    WorkspaceItem as IWorkspaceItem,
    WorkspaceRoot as IWorkspaceRoot,
    MarkdownFileInfo as IMarkdownFileInfo,
    Debouncer,
    Events as IEvents,
    EventRef,
    View as IView,
    App as ObsidianApp,
    KeymapEventHandler,
    Modifier,
    KeymapEventListener,
    Scope as IScope,
    Workspace as ObsidianWorkspace,
    WorkspaceLeaf as ObsidianWorkspaceLeaf,
    WorkspaceSidedock as ObsidianWorkspaceSidedock,
    WorkspaceMobileDrawer as ObsidianWorkspaceMobileDrawer,
    View as ObsidianView,
    Component as ObsidianComponent,
    Plugin as ObsidianPlugin
} from 'obsidian';

// Import des types depuis @types/obsidian
import type { DomElementInfo, SvgElementInfo } from '@types/obsidian';

import { Events } from './components/events';
import { vi } from 'vitest';
import { MockScope, createMockScope } from './types/base';

// Export de tous les mocks
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

export const createMockScope = (): IMockScope => ({
    register: vi.fn(),
    unregister: vi.fn()
});

export interface MockEventRef extends EventRef {
    id: string;
}

export class MockWorkspace extends Events implements IWorkspace {
    containerEl: HTMLElement = document.createElement('div');
    activeLeaf: IWorkspaceLeaf | null = null;
    leftSplit: IWorkspaceSidedock = {} as IWorkspaceSidedock;
    rightSplit: IWorkspaceSidedock = {} as IWorkspaceSidedock;
    leftRibbon: any = {};
    rightRibbon: any = {};
    rootSplit: IWorkspaceRoot;
    floatingSplit: IWorkspaceItem | null = null;
    activeEditor: IMarkdownFileInfo | null = null;
    layoutReady: boolean = true;

    constructor(app?: ObsidianApp) {
        super();
        this.rootSplit = {
            win: window,
            doc: document,
            parent: null,
            children: [],
            getRoot: () => this.rootSplit,
            getContainer: () => this.rootSplit,
            on: vi.fn(),
            off: vi.fn(),
            trigger: vi.fn(),
            onLayoutReady: vi.fn(),
            registerEvent: vi.fn()
        } as unknown as IWorkspaceRoot;
    }

    // Event methods
    getActiveViewOfType = vi.fn();
    on = vi.fn().mockImplementation((name: string, callback: Function) => ({ id: Math.random().toString(36).substr(2, 9) }));
    off = vi.fn();
    onLayoutReady = vi.fn();
    requestSaveLayout = (() => {
        function debouncer() {
            return debouncer;
        }
        debouncer.cancel = vi.fn();
        debouncer.run = () => Promise.resolve();
        return debouncer;
    })() as Debouncer<[], Promise<void>>;
    requestSaveHistory = vi.fn();

    // Leaf management
    setActiveLeaf = vi.fn();
    getLeftLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    getRightLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    getLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    getUnpinnedLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    openLinkText = vi.fn();
    setActiveGroup = vi.fn();
    getActiveFile = vi.fn();
    getLastOpenFiles = vi.fn();
    iterateLeaves = vi.fn();
    getLeavesOfType = vi.fn();
    getFirstLeafOfType = vi.fn();

    // Layout management
    changeLayout = vi.fn();
    getLayout = vi.fn();
    createLeafInParent = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    createLeafBySplit = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    splitLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    splitActiveLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    duplicateLeaf = vi.fn().mockReturnValue(Promise.resolve({} as IWorkspaceLeaf));
    getLeafById = vi.fn().mockReturnValue(null);
    getGroupLeaves = vi.fn().mockReturnValue([]);
    getMostRecentLeaf = vi.fn().mockReturnValue(null);
    getLeftSplit = vi.fn().mockReturnValue(this.leftSplit);
    getRightSplit = vi.fn().mockReturnValue(this.rightSplit);
    iterateAllLeaves = vi.fn();
    detachLeavesOfType = vi.fn();
    revealLeaf = vi.fn();
    moveLeafToPopout = vi.fn();
    duplicateLeafToPopout = vi.fn();
    openPopoutLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);
    ensureSideLeaf = vi.fn().mockReturnValue({} as IWorkspaceLeaf);

    // State management
    toggleLeafPinned = vi.fn();
    setGroupVisibility = vi.fn();
    toggleMobileDrawer = vi.fn();
    pushHistory = vi.fn();
    popHistory = vi.fn();
    recordHistory = vi.fn();
    getCurrentLayout = vi.fn();
    loadLayout = vi.fn();
    iterateRootLeaves = vi.fn();
    getDropLocation = vi.fn();
    handleDrop = vi.fn();
    getWindow = vi.fn().mockReturnValue(window);

    // Additional required methods
    updateOptions = vi.fn();
    trigger = vi.fn();
}

// Implémentation de Scope
export class Scope implements IScope {
    register(modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler {
        return func;
    }

    unregister(cb: KeymapEventHandler): void {}
}

export class App implements ObsidianApp {
    workspace: IWorkspace;
    vault: any = {};
    metadataCache: any = {};
    fileManager: any = {};
    keymap: any = {};
    scope: any = { register: vi.fn(), unregister: vi.fn() };
    lastEvent: any = null;

    constructor() {
        this.workspace = new MockWorkspace(this);
    }
}

export class View {
    app: App;
    leaf: WorkspaceLeaf;
    containerEl: HTMLElement;
    
    constructor(leaf: WorkspaceLeaf) {
        this.leaf = leaf;
        this.app = leaf.app;
        this.containerEl = document.createElement('div');
    }

    onload(): void {}
    onunload(): void {}
    
    protected onOpen(): Promise<void> {
        return Promise.resolve();
    }
    
    protected onClose(): Promise<void> {
        return Promise.resolve();
    }
}

export class Component extends Events {
    containerEl: HTMLElement = document.createElement('div');
    
    onload(): void {}
    onunload(): void {}
}

export class Modal extends Component {
    app: App;
    scope: any = { register: vi.fn(), unregister: vi.fn() };
    
    constructor(app: App) {
        super();
        this.app = app;
    }
    
    open(): void {}
    close(): void {}
}

export class Plugin extends Component {
    app: App;
    manifest: any;
    
    constructor(app: App, manifest: any) {
        super();
        this.app = app;
        this.manifest = manifest;
    }

    onUserEnable(): void {}
    
    onExternalSettingsChange(): void {}
}

export class WorkspaceLeaf extends Events {
    view: View | null = null;
    containerEl: HTMLElement;
    app: App;
    private _isDeferred: boolean = false;
    
    constructor(app: App) {
        super();
        this.app = app;
        this.containerEl = document.createElement('div');
    }

    get isDeferred(): boolean {
        return this._isDeferred;
    }

    async loadIfDeferred(): Promise<void> {
        if (this._isDeferred) {
            this._isDeferred = false;
            return Promise.resolve();
        }
    }
}

export class Workspace extends Events {
    app: App;
    containerEl: HTMLElement;
    
    constructor(app: App) {
        super();
        this.app = app;
        this.containerEl = document.createElement('div');
    }
}

export class Vault extends Events {
    adapter = {
        read: vi.fn(),
        write: vi.fn(),
        exists: vi.fn(),
        stat: vi.fn(),
        list: vi.fn(),
        mkdir: vi.fn(),
        rmdir: vi.fn(),
        remove: vi.fn(),
        rename: vi.fn(),
        copy: vi.fn()
    };
}

export class MetadataCache extends Events {
    getFileCache = vi.fn();
    getCache = vi.fn();
    fileToLinktext = vi.fn();
    getFirstLinkpathDest = vi.fn();
    getFrontMatterInfo = vi.fn().mockReturnValue({
        position: { start: { line: 0, col: 0 }, end: { line: 0, col: 0 } },
        frontmatter: {},
        content: ''
    });
    resolvedLinks = {};
    unresolvedLinks = {};
    frontmatterLinks: Map<string, LinkCache[]> = new Map();
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

export function setTooltip(el: HTMLElement, tooltip: string, options?: TooltipOptions): void {
    el.setAttribute('aria-label', tooltip);
    if (options?.placement) {
        el.setAttribute('data-tooltip-position', options.placement);
    }
}

export interface LinkCache {
    link: string;
    displayText?: string;
    position: {
        start: { line: number; col: number; offset: number };
        end: { line: number; col: number; offset: number };
    };
}

export class ProgressBarComponent extends Component {
    containerEl: HTMLElement;
    progressEl: HTMLElement;
    value: number = 0;

    constructor(containerEl: HTMLElement) {
        super();
        this.containerEl = containerEl;
        this.progressEl = containerEl.createDiv({ cls: 'progress-bar' });
    }

    setValue(value: number): this {
        this.value = Math.min(1, Math.max(0, value));
        this.progressEl.style.width = `${this.value * 100}%`;
        return this;
    }

    getValue(): number {
        return this.value;
    }
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

export class Publish extends Events {
    private currentFile: string = '';
    private postProcessors: MarkdownPostProcessor[] = [];

    get currentFilepath(): string {
        return this.currentFile;
    }

    registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): MarkdownPostProcessor {
        if (typeof sortOrder === 'number') {
            postProcessor.sortOrder = sortOrder;
        }
        this.postProcessors.push(postProcessor);
        this.postProcessors.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return postProcessor;
    }

    registerMarkdownCodeBlockProcessor(
        language: string,
        handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void,
        sortOrder?: number
    ): MarkdownPostProcessor {
        const processor: MarkdownPostProcessor = async (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
            const pre = el.querySelector('pre');
            const code = pre?.querySelector('code');
            if (code?.classList.contains(`language-${language}`)) {
                const source = code.textContent || '';
                const wrapper = el.createDiv();
                pre?.remove();
                await handler(source, wrapper, ctx);
            }
        };
        return this.registerMarkdownPostProcessor(processor, sortOrder);
    }
}

// Déclaration globale pour publish
declare global {
    var publish: Publish;
}

// Initialisation de l'instance globale
globalThis.publish = new Publish();

export { FuzzySuggestModal } from './ui/fuzzy-suggest';

export abstract class BaseFuzzySuggestModal<T> extends Events {
    app: App;
    scope: Scope;
    inputEl: HTMLInputElement;
    resultContainerEl: HTMLElement;
    items: T[] = [];
    limit: number = 50;
    emptyStateText: string = 'No results found.';
    containerEl: HTMLElement;
    modalEl: HTMLElement;
    titleEl: HTMLElement;
    contentEl: HTMLElement;

    constructor(app: App) {
        super();
        this.app = app;
        this.scope = new Scope();
        this.containerEl = document.createElement('div');
        this.modalEl = document.createElement('div');
        this.titleEl = document.createElement('div');
        this.contentEl = document.createElement('div');
        this.inputEl = document.createElement('input');
        this.resultContainerEl = document.createElement('div');
    }

    abstract getItems(): T[];
    abstract getItemText(item: T): string;
    abstract onChooseItem(item: T, evt: MouseEvent | KeyboardEvent): void;
    abstract renderSuggestion(item: T, el: HTMLElement): void;
}

// Définition des types localement
export interface DomElementInfo {
    cls?: string | string[];
    text?: string | DocumentFragment;
    attr?: { [key: string]: string | number | boolean | null };
    title?: string;
    parent?: Node;
    value?: string;
    type?: string;
    prepend?: boolean;
    placeholder?: string;
    href?: string;
}

export interface SvgElementInfo {
    cls?: string | string[];
    attr?: { [key: string]: string | number | boolean | null };
    parent?: Node;
    prepend?: boolean;
}