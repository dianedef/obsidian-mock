import { MarkdownView as BaseMarkdownView, type Editor, type TFile, type WorkspaceLeaf, type HoverPopover, type Menu, type MarkdownPreviewView, type MarkdownViewModeType } from 'obsidian';
export declare class MarkdownView extends BaseMarkdownView {
    editor: Editor;
    previewMode: MarkdownPreviewView;
    file: TFile | null;
    hoverPopover: HoverPopover | null;
    data: string;
    getScroll: () => {
        top: number;
        left: number;
    };
    applyScroll: (scroll: {
        top: number;
        left: number;
    }) => void;
    canAcceptExtension: () => boolean;
    getContext: () => Record<string, any>;
    constructor(leaf: WorkspaceLeaf);
    showSearch(): void;
    requestSave: import("vitest/dist").Mock<any, any>;
    getViewType(): string;
    getDisplayText(): string;
    getIcon(): string;
    getMode(): MarkdownViewModeType;
    getViewData(): string;
    setViewData(data: string, clear: boolean): void;
    get sourcePath(): string;
    setMode(mode: MarkdownViewModeType): void;
    showPreview(): void;
    showEdit(): void;
    onPaneMenu(menu: Menu, source: string): void;
    toggleSourceAndPreview(): void;
}
