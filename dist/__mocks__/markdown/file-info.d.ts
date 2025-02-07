import type { App, Editor, HoverPopover, MarkdownFileInfo as IMarkdownFileInfo, TFile } from 'obsidian';
export declare class MarkdownFileInfo implements IMarkdownFileInfo {
    app: App;
    private _file;
    editor?: Editor;
    hoverPopover: HoverPopover | null;
    constructor(app: App, file?: TFile | null, editor?: Editor);
    get file(): TFile | null;
    clear(): void;
    getSelection(): string;
}
