import { vi } from 'vitest';

// Mock du module obsidian
class View {
    app: any;
    icon: string = '';
    navigation: boolean = false;
    leaf: any;
    containerEl: HTMLElement;
    scope: any;

    constructor(leaf: any) {
        this.leaf = leaf;
        this.app = leaf.app;
        this.containerEl = document.createElement('div');
        this.scope = { register: vi.fn(), unregister: vi.fn() };
    }

    onOpen(): Promise<void> { return Promise.resolve(); }
    onClose(): Promise<void> { return Promise.resolve(); }
    getViewType(): string { return ''; }
    getDisplayText(): string { return ''; }
    getIcon(): string { return this.icon; }
    onResize(): void {}
    onPaneMenu(_menu: any, _source: string): void {}
    onHeaderMenu(_menu: any): void {}
    getState(): any { return {}; }
    setState(_state: any, _result: any): Promise<void> { return Promise.resolve(); }
    getEphemeralState(): any { return {}; }
    setEphemeralState(_state: any): void {}

    load(): void {}
    unload(): void {}
    onload(): void {}
    onunload(): void {}

    addChild(child: any): any { return child; }
    removeChild(child: any): any { return child; }
    register(cb: () => any): void { cb(); }
    registerEvent(_eventRef: any): void {}
    registerDomEvent(_el: any, _type: string, _callback: any): void {}
    registerInterval(id: number): number { return id; }
}

class ItemView extends View {
    contentEl: HTMLElement;

    constructor(leaf: any) {
        super(leaf);
        this.contentEl = document.createElement('div');
        this.containerEl.appendChild(this.contentEl);
    }
}

class MarkdownView extends View {
    editor: any;
    previewMode: any;
    currentMode: any;
    file: any = null;

    constructor(leaf: any) {
        super(leaf);
        this.editor = {};
        this.previewMode = {};
        this.currentMode = {};
    }

    getViewType(): string {
        return 'markdown';
    }
}

const obsidian = {
    View,
    ItemView,
    MarkdownView
};

vi.mock('obsidian', () => obsidian);

export default obsidian; 
