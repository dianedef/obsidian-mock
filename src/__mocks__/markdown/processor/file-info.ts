import type { App, Editor, HoverParent, HoverPopover, MarkdownFileInfo as IMarkdownFileInfo, TFile } from 'obsidian';

export class MarkdownFileInfo implements IMarkdownFileInfo {
    app: App;
    private _file: TFile | null;
    editor?: Editor;
    hoverPopover: HoverPopover | null;

    constructor(app: App, file: TFile | null = null, editor?: Editor) {
        this.app = app;
        this._file = file;
        this.editor = editor;
        this.hoverPopover = null;
    }

    get file(): TFile | null {
        return this._file;
    }

    clear(): void {
        this._file = null;
        this.editor = undefined;
        this.hoverPopover = null;
    }

    getSelection(): string {
        return this.editor?.getSelection() || '';
    }
} 