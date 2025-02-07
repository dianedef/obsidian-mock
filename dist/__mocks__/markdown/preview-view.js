import { Component } from '../components/component';
import { MarkdownPreviewRenderer } from './preview-renderer';
import { MarkdownPostProcessorContext } from './post-processor';
/**
 * Implementation of Obsidian's MarkdownPreviewView interface.
 * Can be used for testing or as a base implementation for custom preview views.
 */
export class MarkdownPreviewView extends Component {
    constructor(file) {
        super();
        this.content = '';
        this.hoverPopover = {};
        this._file = file;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('markdown-preview-view');
        this.app = file.vault.app;
    }
    get file() {
        return this._file;
    }
    get() {
        return this.content;
    }
    set(data, clear) {
        if (clear) {
            this.clear();
        }
        this.content = data;
        this.rerender();
    }
    clear() {
        this.content = '';
        this.containerEl.empty();
    }
    async rerender(full = false) {
        if (full) {
            this.containerEl.empty();
        }
        const ctx = new MarkdownPostProcessorContext(this._file.path, this._file.path, null);
        await MarkdownPreviewRenderer.processMarkdown(this.containerEl, ctx);
    }
    getScroll() {
        return this.containerEl.scrollTop;
    }
    applyScroll(scroll) {
        this.containerEl.scrollTop = scroll;
    }
}
