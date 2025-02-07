import { MarkdownView as BaseMarkdownView } from '../views/markdown-view';
import { MarkdownPreviewView } from './preview-view';
import { MockEditor } from '../components/editor';
import { vi } from 'vitest';
export class MockMarkdownView extends BaseMarkdownView {
    constructor(leaf) {
        super(leaf);
        this.load = vi.fn().mockImplementation(() => {
            if (this.file) {
                this.previewMode = new MarkdownPreviewView(this.file);
                this.currentMode = this.previewMode;
            }
        });
        this.unload = vi.fn().mockImplementation(() => {
            this.previewMode?.unload();
        });
        this.editor = new MockEditor(this);
    }
}
