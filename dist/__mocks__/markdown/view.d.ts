import { MarkdownView as BaseMarkdownView } from '../views/markdown-view';
import type { WorkspaceLeaf } from 'obsidian';
export declare class MockMarkdownView extends BaseMarkdownView {
    constructor(leaf: WorkspaceLeaf);
    load: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
}
