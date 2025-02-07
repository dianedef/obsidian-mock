import { vi } from 'vitest';
import { Events } from './components/events';
import { Scope } from 'obsidian';
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
export const createMockScope = () => ({
    register: vi.fn(),
    unregister: vi.fn()
});
export class Events {
    constructor() {
        this.eventRefs = new Map();
        this.nextEventId = 1;
    }
    on(name, callback, ctx) {
        const eventSet = this.eventRefs.get(name) || new Set();
        if (!this.eventRefs.has(name)) {
            this.eventRefs.set(name, eventSet);
        }
        const id = `evt_${this.nextEventId++}`;
        const ref = { callback, ctx, id };
        eventSet.add(ref);
        return { id };
    }
    off(name, callback) {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const ref of eventSet) {
                if (ref.callback === callback) {
                    eventSet.delete(ref);
                    break;
                }
            }
        }
    }
    offref(ref) {
        for (const [name, eventSet] of this.eventRefs.entries()) {
            for (const eventRef of eventSet) {
                if (eventRef.id === ref.id) {
                    eventSet.delete(eventRef);
                    return;
                }
            }
        }
    }
    trigger(name, ...data) {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const { callback, ctx } of eventSet) {
                callback.apply(ctx, data);
            }
        }
    }
    tryTrigger(name, ...data) {
        this.trigger(name, ...data);
    }
}
export class Scope {
    constructor() {
        this.register = vi.fn().mockImplementation((modifiers, key, func) => {
            return {
                scope: this,
                modifiers: modifiers || '',
                key: key || '',
                func
            };
        });
        this.unregister = vi.fn().mockImplementation((handler) => {
            // Mock implementation
        });
    }
}
export class MockWorkspace extends Events {
    constructor(app) {
        super();
        this.containerEl = document.createElement('div');
        this.activeLeaf = null;
        this.leftSplit = {};
        this.rightSplit = {};
        this.leftRibbon = {};
        this.rightRibbon = {};
        this.floatingSplit = null;
        this.activeEditor = null;
        this.layoutReady = true;
        // Event methods
        this.getActiveViewOfType = vi.fn();
        this.on = vi.fn().mockImplementation((name, callback) => ({ id: Math.random().toString(36).substr(2, 9) }));
        this.off = vi.fn();
        this.onLayoutReady = vi.fn();
        this.requestSaveLayout = (() => {
            function debouncer() {
                return debouncer;
            }
            debouncer.cancel = vi.fn();
            debouncer.run = () => Promise.resolve();
            return debouncer;
        })();
        this.requestSaveHistory = vi.fn();
        // Leaf management
        this.setActiveLeaf = vi.fn();
        this.getLeftLeaf = vi.fn().mockReturnValue({});
        this.getRightLeaf = vi.fn().mockReturnValue({});
        this.getLeaf = vi.fn().mockReturnValue({});
        this.getUnpinnedLeaf = vi.fn().mockReturnValue({});
        this.openLinkText = vi.fn();
        this.setActiveGroup = vi.fn();
        this.getActiveFile = vi.fn();
        this.getLastOpenFiles = vi.fn();
        this.iterateLeaves = vi.fn();
        this.getLeavesOfType = vi.fn();
        this.getFirstLeafOfType = vi.fn();
        // Layout management
        this.changeLayout = vi.fn();
        this.getLayout = vi.fn();
        this.createLeafInParent = vi.fn().mockReturnValue({});
        this.createLeafBySplit = vi.fn().mockReturnValue({});
        this.splitLeaf = vi.fn().mockReturnValue({});
        this.splitActiveLeaf = vi.fn().mockReturnValue({});
        this.duplicateLeaf = vi.fn().mockReturnValue(Promise.resolve({}));
        this.getLeafById = vi.fn().mockReturnValue(null);
        this.getGroupLeaves = vi.fn().mockReturnValue([]);
        this.getMostRecentLeaf = vi.fn().mockReturnValue(null);
        this.getLeftSplit = vi.fn().mockReturnValue(this.leftSplit);
        this.getRightSplit = vi.fn().mockReturnValue(this.rightSplit);
        this.iterateAllLeaves = vi.fn();
        this.detachLeavesOfType = vi.fn();
        this.revealLeaf = vi.fn();
        this.moveLeafToPopout = vi.fn();
        this.duplicateLeafToPopout = vi.fn();
        this.openPopoutLeaf = vi.fn().mockReturnValue({});
        this.ensureSideLeaf = vi.fn().mockReturnValue({});
        // State management
        this.toggleLeafPinned = vi.fn();
        this.setGroupVisibility = vi.fn();
        this.toggleMobileDrawer = vi.fn();
        this.pushHistory = vi.fn();
        this.popHistory = vi.fn();
        this.recordHistory = vi.fn();
        this.getCurrentLayout = vi.fn();
        this.loadLayout = vi.fn();
        this.iterateRootLeaves = vi.fn();
        this.getDropLocation = vi.fn();
        this.handleDrop = vi.fn();
        this.getWindow = vi.fn().mockReturnValue(window);
        // Additional required methods
        this.updateOptions = vi.fn();
        this.trigger = vi.fn();
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
        };
    }
}
export class App {
    constructor() {
        this.vault = {};
        this.metadataCache = {};
        this.fileManager = {};
        this.keymap = {};
        this.lastEvent = null;
        this.workspace = new MockWorkspace(this);
        this.scope = new MockScope();
    }
}
export class View {
    constructor(leaf) {
        this.leaf = leaf;
        this.app = leaf.app;
        this.containerEl = document.createElement('div');
    }
    onload() { }
    onunload() { }
    onOpen() {
        return Promise.resolve();
    }
    onClose() {
        return Promise.resolve();
    }
}
export class Component extends Events {
    constructor() {
        super(...arguments);
        this.containerEl = document.createElement('div');
    }
    onload() { }
    onunload() { }
}
export class Modal extends Component {
    constructor(app) {
        super();
        this.app = app;
        this.scope = new MockScope();
    }
    open() { }
    close() { }
}
export class Plugin extends Component {
    constructor(app, manifest) {
        super();
        this.app = app;
        this.manifest = manifest;
    }
    onUserEnable() { }
    onExternalSettingsChange() { }
}
export class WorkspaceLeaf extends Events {
    constructor(app) {
        super();
        this.view = null;
        this._isDeferred = false;
        this.app = app;
        this.containerEl = document.createElement('div');
    }
    get isDeferred() {
        return this._isDeferred;
    }
    async loadIfDeferred() {
        if (this._isDeferred) {
            this._isDeferred = false;
            return Promise.resolve();
        }
    }
}
export class Workspace extends Events {
    constructor(app) {
        super();
        this.app = app;
        this.containerEl = document.createElement('div');
    }
}
export class Vault extends Events {
    constructor() {
        super(...arguments);
        this.adapter = {
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
}
export class MetadataCache extends Events {
    constructor() {
        super(...arguments);
        this.getFileCache = vi.fn();
        this.getCache = vi.fn();
        this.fileToLinktext = vi.fn();
        this.getFirstLinkpathDest = vi.fn();
        this.getFrontMatterInfo = vi.fn().mockReturnValue({
            position: { start: { line: 0, col: 0 }, end: { line: 0, col: 0 } },
            frontmatter: {},
            content: ''
        });
        this.resolvedLinks = {};
        this.unresolvedLinks = {};
        this.frontmatterLinks = new Map();
    }
}
export function setTooltip(el, tooltip, options) {
    el.setAttribute('aria-label', tooltip);
    if (options?.placement) {
        el.setAttribute('data-tooltip-position', options.placement);
    }
}
export class ProgressBarComponent extends Component {
    constructor(containerEl) {
        super();
        this.value = 0;
        this.containerEl = containerEl;
        this.progressEl = containerEl.createDiv({ cls: 'progress-bar' });
    }
    setValue(value) {
        this.value = Math.min(1, Math.max(0, value));
        this.progressEl.style.width = `${this.value * 100}%`;
        return this;
    }
    getValue() {
        return this.value;
    }
}
export class Publish extends Events {
    constructor() {
        super(...arguments);
        this.currentFile = '';
        this.postProcessors = [];
    }
    get currentFilepath() {
        return this.currentFile;
    }
    registerMarkdownPostProcessor(postProcessor, sortOrder) {
        if (typeof sortOrder === 'number') {
            postProcessor.sortOrder = sortOrder;
        }
        this.postProcessors.push(postProcessor);
        this.postProcessors.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return postProcessor;
    }
    registerMarkdownCodeBlockProcessor(language, handler, sortOrder) {
        const processor = async (el, ctx) => {
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
// Initialisation de l'instance globale
globalThis.publish = new Publish();
export { FuzzySuggestModal } from './ui/fuzzy-suggest';
export class BaseFuzzySuggestModal extends Events {
    constructor(app) {
        super();
        this.items = [];
        this.limit = 50;
        this.emptyStateText = 'No results found.';
        this.app = app;
        this.scope = new Scope();
        this.containerEl = document.createElement('div');
        this.modalEl = document.createElement('div');
        this.titleEl = document.createElement('div');
        this.contentEl = document.createElement('div');
        this.inputEl = document.createElement('input');
        this.resultContainerEl = document.createElement('div');
    }
}
