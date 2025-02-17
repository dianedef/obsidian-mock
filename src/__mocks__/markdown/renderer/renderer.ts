import { vi } from 'vitest';
import type { App, Component, HoverParent, HoverPopover, MarkdownPreviewEvents, TFile } from 'obsidian';
import { MarkdownRenderChild } from './render-child';
import { HoverPopover } from '../components/hover-popover';


export abstract class MarkdownRenderer extends MarkdownRenderChild implements MarkdownPreviewEvents, HoverParent {
    app: App;
    hoverPopover: HoverPopover;


    constructor(app: App, containerEl: HTMLElement) {
        super(containerEl);
        this.app = app;
        this.hoverPopover = new MockHoverPopover(this, null);
    }

    abstract get file(): TFile;

    static renderMarkdown = vi.fn(async (
        markdown: string,
        el: HTMLElement,
        sourcePath: string,
        component: Component & { app?: App }
    ): Promise<void> => {
        if (!component.app) {
            throw new Error('Component must have an app property');
        }
        await MarkdownRenderer.render(component.app, markdown, el, sourcePath, component);
    });

    static render = vi.fn(async (
        app: App,
        markdown: string,
        el: HTMLElement,
        sourcePath: string,
        component: Component
    ): Promise<void> => {
        // Mock simple : convertit le markdown en HTML basique
        el.innerHTML = markdown
            .split('\n')
            .map(line => `<p>${line}</p>`)
            .join('');
    });
} 