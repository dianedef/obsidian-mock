import { vi } from 'vitest';
// Mock du module obsidian
class View {
    constructor(leaf) {
        this.icon = '';
        this.navigation = false;
        this.leaf = leaf;
        this.app = leaf.app;
        this.containerEl = document.createElement('div');
        this.scope = { register: vi.fn(), unregister: vi.fn() };
    }
    onOpen() { return Promise.resolve(); }
    onClose() { return Promise.resolve(); }
    getViewType() { return ''; }
    getDisplayText() { return ''; }
    getIcon() { return this.icon; }
    onResize() { }
    onPaneMenu(_menu, _source) { }
    onHeaderMenu(_menu) { }
    getState() { return {}; }
    setState(_state, _result) { return Promise.resolve(); }
    getEphemeralState() { return {}; }
    setEphemeralState(_state) { }
    load() { }
    unload() { }
    onload() { }
    onunload() { }
    addChild(child) { return child; }
    removeChild(child) { return child; }
    register(cb) { cb(); }
    registerEvent(_eventRef) { }
    registerDomEvent(_el, _type, _callback) { }
    registerInterval(id) { return id; }
}
class ItemView extends View {
    constructor(leaf) {
        super(leaf);
        this.contentEl = document.createElement('div');
        this.containerEl.appendChild(this.contentEl);
    }
}
class MarkdownView extends View {
    constructor(leaf) {
        super(leaf);
        this.file = null;
        this.editor = {};
        this.previewMode = {};
        this.currentMode = {};
    }
    getViewType() {
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
