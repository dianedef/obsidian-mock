import type { MarkdownPreviewView as IMarkdownPreviewView, TFile, App, HoverPopover } from 'obsidian';
import { Component } from '../components/component';
/**
 * Implementation of Obsidian's MarkdownPreviewView interface.
 * Can be used for testing or as a base implementation for custom preview views.
 */
export declare class MarkdownPreviewView extends Component implements IMarkdownPreviewView {
    containerEl: HTMLElement;
    private _file;
    private content;
    app: App;
    hoverPopover: HoverPopover;
    constructor(file: TFile);
    get file(): TFile;
    get(): string;
    set(data: string, clear: boolean): void;
    clear(): void;
    rerender(full?: boolean): Promise<void>;
    getScroll(): number;
    applyScroll(scroll: number): void;
}
