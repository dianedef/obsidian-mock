import { vi } from 'vitest';
import type { MarkdownView as IMarkdownView, Editor, TFile, WorkspaceLeaf, HoverPopover, Menu, MarkdownViewModeType } from 'obsidian';
import { EditorImpl } from '../components/editor';
import { MarkdownPreviewView } from './markdown-preview-view';
import { View } from '../core/view';

export class MarkdownView extends View implements IMarkdownView {
    editor: Editor;
    previewMode: MarkdownPreviewView;
    file: TFile | null = null;
    hoverPopover: HoverPopover | null = null;
    data = '';
    private currentMode: MarkdownViewModeType = 'source';

    // Déclaration des méthodes supplémentaires
    getScroll!: () => { top: number; left: number };
    applyScroll!: (scroll: { top: number; left: number }) => void;
    canAcceptExtension!: () => boolean;
    getContext!: () => Record<string, any>;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.editor = new EditorImpl(this as any);
        this.previewMode = new MarkdownPreviewView(null);

        // Configuration des événements de l'éditeur
        this.editor.on('change', () => {
            this.trigger('content-modified');
        });

        // Méthodes de cycle de vie
        this.onOpen = vi.fn().mockResolvedValue(undefined);
        this.onClose = vi.fn().mockResolvedValue(undefined);
        this.onunload = vi.fn().mockImplementation(() => {
            this.file = null;
            return Promise.resolve();
        });
        this.onload = vi.fn();

        // Méthodes de gestion des fichiers
        this.onUnloadFile = vi.fn().mockImplementation(async (file: TFile) => {
            this.file = null;
            return Promise.resolve();
        });
        this.onLoadFile = vi.fn().mockImplementation(async (file: TFile) => {
            this.file = file;
            this.previewMode = new MarkdownPreviewView(file);
            this.trigger('file-changed', file);
            return Promise.resolve();
        });
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
        this.setMode = (mode: MarkdownViewModeType) => {
            this.currentMode = mode;
            this.trigger('mode-change', mode);
        };
        this.setViewData = (data: string, clear: boolean) => {
            if (clear) {
                this.clear();
            }
            this.data = data;
            this.editor.setValue(data);
        };

        // Méthodes de gestion du mode
        this.getMode = () => this.currentMode;
        this.showPreview = () => {
            this.setMode('preview');
        };
        this.showEdit = () => {
            this.setMode('source');
        };
        this.toggleSourceAndPreview = () => {
            if (this.currentMode === 'source') {
                this.showPreview();
            } else {
                this.showEdit();
            }
        };

        // Méthodes de gestion des références
        this.extractReferences = () => {
            const content = this.editor.getValue();
            const links = content.match(/\[\[(.*?)\]\]/g)?.map(link => link.slice(2, -2)) || [];
            const tags = content.match(/#[^\s#]+/g) || [];
            const embeds = content.match(/!\[\[(.*?)\]\]/g)?.map(embed => embed.slice(3, -2)) || [];
            return { links, tags, embeds };
        };

        // Méthodes de gestion des événements
        this.editor.on('change', () => {
            this.trigger('content-changed');
        });

        // Méthodes de gestion des processeurs markdown
        this.registerMarkdownPostProcessor = (processor: (el: HTMLElement) => void | Promise<void>) => {
            this.previewMode.registerProcessor(processor);
        };

        this.getViewData = () => {
            return this.editor.getValue();
        };
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

    get sourcePath(): string {
        return this.file?.path || '';
    }

    onPaneMenu(menu: Menu, source: string): void {
        menu.addItem((item) => {
            item.setTitle('Toggle Preview');
        });
    }

    createInternalLink(path: string): string {
        return `[[${path}]]`;
    }

    resolveLink(path: string): { path: string } {
        return { path };
    }
}