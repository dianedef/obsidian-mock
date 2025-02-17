import type { MarkdownRenderer, MarkdownPreviewView as IMarkdownPreviewView, TFile, App, HoverPopover } from 'obsidian';
import { Component } from '../components/component';
import { MarkdownPreviewRenderer } from './preview-renderer';
import { MarkdownPostProcessorContext } from './post-processor';

/**
 * Implementation of Obsidian's MarkdownPreviewView interface.
 * Can be used for testing or as a base implementation for custom preview views.
 */
export class MarkdownPreviewView extends Component implements IMarkdownPreviewView {
    containerEl: HTMLElement;
    private _file: TFile;
    private content: string = '';
    app: App;
    hoverPopover: HoverPopover = {} as HoverPopover;

    constructor(file: TFile) {
        super();
        this._file = file;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('markdown-preview-view');
        this.app = (file as any).vault.app;
    }

    get file(): TFile {
        return this._file;
    }

    get(): string {
        return this.content;
    }

    set(data: string, clear: boolean): void {
        if (clear) {
            this.clear();
        }
        this.content = data;
        this.rerender();
    }

    clear(): void {
        this.content = '';
        this.containerEl.empty();
    }

    async rerender(full: boolean = false): Promise<void> {
        if (full) {
            this.containerEl.empty();
        }
        const ctx = new MarkdownPostProcessorContext(
            this._file.path,
            this._file.path,
            null
        );
        await MarkdownPreviewRenderer.processMarkdown(this.containerEl, ctx);
    }

    getScroll(): number {
        return this.containerEl.scrollTop;
    }

    applyScroll(scroll: number): void {
        this.containerEl.scrollTop = scroll;
    }
} 