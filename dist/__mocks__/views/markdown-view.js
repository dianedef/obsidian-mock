import { vi } from 'vitest';
import { MarkdownView as BaseMarkdownView } from 'obsidian';
import { EditorImpl } from '../components/editor';
export class MarkdownView extends BaseMarkdownView {
    constructor(leaf) {
        super(leaf);
        this.file = null;
        this.hoverPopover = null;
        this.data = '';
        this.requestSave = vi.fn();
        this.editor = new EditorImpl(this);
        this.previewMode = {
            containerEl: document.createElement('div'),
            file: this.file,
            app: this.app,
            hoverPopover: {},
            get: () => '',
            set: vi.fn(),
            clear: vi.fn(),
            rerender: vi.fn(),
            getScroll: () => 0,
            applyScroll: vi.fn(),
            onload: vi.fn(),
            onunload: vi.fn()
        };
        // Méthodes de cycle de vie
        this.onOpen = vi.fn().mockResolvedValue(undefined);
        this.onClose = vi.fn().mockResolvedValue(undefined);
        this.onunload = vi.fn();
        this.onload = vi.fn();
        // Méthodes de gestion des fichiers
        this.onUnloadFile = vi.fn().mockResolvedValue(undefined);
        this.onLoadFile = vi.fn().mockResolvedValue(undefined);
        this.save = vi.fn().mockResolvedValue(undefined);
        this.onRename = vi.fn();
        // Méthodes utilitaires
        this.clear = vi.fn();
        this.getScroll = vi.fn().mockReturnValue({ top: 0, left: 0 });
        this.applyScroll = vi.fn();
        this.canAcceptExtension = vi.fn().mockReturnValue(true);
        this.getContext = vi.fn().mockReturnValue({});
        // Méthodes d'état
        const defaultState = {
            mode: 'source',
            source: false,
            history: false
        };
        this.getState = vi.fn().mockReturnValue(defaultState);
        this.setState = vi.fn();
        this.setMode = vi.fn();
        this.setViewData = vi.fn();
    }
    showSearch() {
        // Mock implementation
    }
    getViewType() {
        return 'markdown';
    }
    getDisplayText() {
        return this.file?.basename || 'Markdown View';
    }
    getIcon() {
        return 'document';
    }
    getMode() {
        return (this.getState()?.mode || 'source');
    }
    getViewData() {
        return this.editor.getValue();
    }
    setViewData(data, clear) {
        if (clear) {
            this.editor.setValue(data);
        }
        this.editor.refresh();
    }
    get sourcePath() {
        return this.file?.path || '';
    }
    setMode(mode) {
        const state = this.getState() || {
            mode: 'source',
            source: false,
            history: false
        };
        state.mode = mode;
        this.setState(state, { history: false });
    }
    showPreview() {
        this.setMode('preview');
    }
    showEdit() {
        this.setMode('source');
    }
    onPaneMenu(menu, source) {
        menu.addItem((item) => {
            item.setTitle('Toggle Preview');
        });
    }
    toggleSourceAndPreview() {
        const currentMode = this.getMode();
        const newMode = currentMode === 'source' ? 'preview' : 'source';
        this.setMode(newMode);
    }
}
