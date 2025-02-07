import type { App, Component, HoverParent, HoverPopover, MarkdownPreviewEvents, TFile } from 'obsidian';
import { MockMarkdownRenderChild } from './render-child';
export declare abstract class MockMarkdownRenderer extends MockMarkdownRenderChild implements MarkdownPreviewEvents, HoverParent {
    app: App;
    hoverPopover: HoverPopover;
    constructor(app: App, containerEl: HTMLElement);
    abstract get file(): TFile;
    static renderMarkdown: import("vitest/dist").Mock<[markdown: string, el: HTMLElement, sourcePath: string, component: Component & {
        app?: App;
    }], Promise<void>>;
    static render: import("vitest/dist").Mock<[app: App, markdown: string, el: HTMLElement, sourcePath: string, component: Component], Promise<void>>;
}
