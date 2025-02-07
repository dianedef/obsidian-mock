import { vi } from 'vitest';
import { MarkdownView as BaseMarkdownView, type Editor, type TFile, type WorkspaceLeaf, type HoverPopover, type Menu, type MarkdownPreviewView, type MarkdownViewModeType, type ViewStateResult } from 'obsidian';
import { EditorImpl } from '../components/editor';

export class MarkdownView extends BaseMarkdownView {
    editor: Editor;
    previewMode: MarkdownPreviewView;
    file: TFile | null = null;
    hoverPopover: HoverPopover | null = null;
    data = '';

    // Déclaration des méthodes supplémentaires
    getScroll!: () => { top: number; left: number };
    applyScroll!: (scroll: { top: number; left: number }) => void;
    canAcceptExtension!: () => boolean;
    getContext!: () => Record<string, any>;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.editor = new EditorImpl(this as any);

        this.previewMode = {
            containerEl: document.createElement('div'),
            file: this.file as TFile,
            app: this.app,
            hoverPopover: {} as HoverPopover,
            get: () => '',
            set: vi.fn(),
            clear: vi.fn(),
            rerender: vi.fn(),
            getScroll: () => 0,
            applyScroll: vi.fn(),
            onload: vi.fn(),
            onunload: vi.fn()
        } as unknown as MarkdownPreviewView;

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
            mode: 'source' as MarkdownViewModeType,
            source: false,
            history: false
        };
        this.getState = vi.fn().mockReturnValue(defaultState);
        this.setState = vi.fn();
        this.setMode = vi.fn();
        this.setViewData = vi.fn();
    }

    showSearch(): void {
        // Mock implementation
    }

    requestSave = vi.fn();

    getViewType(): string {
        return 'markdown';
    }

    getDisplayText(): string {
        return this.file?.basename || 'Markdown View';
    }

    getIcon(): string {
        return 'document';
    }

    getMode(): MarkdownViewModeType {
        return (this.getState()?.mode || 'source') as MarkdownViewModeType;
    }

    getViewData(): string {
        return this.editor.getValue();
    }

    setViewData(data: string, clear: boolean): void {
        if (clear) {
            this.editor.setValue(data);
        }
        this.editor.refresh();
    }

    get sourcePath(): string {
        return this.file?.path || '';
    }

    setMode(mode: MarkdownViewModeType): void {
        const state = this.getState() || {
            mode: 'source' as MarkdownViewModeType,
            source: false,
            history: false
        };
        state.mode = mode;
        this.setState(state, { history: false });
    }

    showPreview(): void {
        this.setMode('preview');
    }

    showEdit(): void {
        this.setMode('source');
    }

    onPaneMenu(menu: Menu, source: string): void {
        menu.addItem((item) => {
            item.setTitle('Toggle Preview');
        });
    }

    toggleSourceAndPreview(): void {
        const currentMode = this.getMode();
        const newMode = currentMode === 'source' ? 'preview' : 'source';
        this.setMode(newMode);
    }
}