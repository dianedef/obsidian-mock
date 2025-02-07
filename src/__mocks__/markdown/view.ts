import { MarkdownView as BaseMarkdownView } from '../views/markdown-view';
import type { WorkspaceLeaf } from 'obsidian';
import { MarkdownPreviewView } from './preview-view';
import { MockEditor } from '../components/editor';
import { vi } from 'vitest';

export class MockMarkdownView extends BaseMarkdownView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.editor = new MockEditor(this);
    }

    load = vi.fn().mockImplementation((): void => {
        if (this.file) {
            this.previewMode = new MarkdownPreviewView(this.file);
            this.currentMode = this.previewMode;
        }
    });

    unload = vi.fn().mockImplementation((): void => {
        this.previewMode?.unload();
    });
} 