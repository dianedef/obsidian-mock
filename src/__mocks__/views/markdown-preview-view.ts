import { vi } from 'vitest';
import type { MarkdownPreviewView as IMarkdownPreviewView, TFile, App, HoverPopover } from 'obsidian';

export class MarkdownPreviewView implements IMarkdownPreviewView {
    containerEl: HTMLElement = document.createElement('div');
    file: TFile;
    app: App;
    hoverPopover: HoverPopover;
    private processors: ((el: HTMLElement) => void | Promise<void>)[] = [];

    constructor(file: TFile | null) {
        this.file = file as TFile;
        this.app = (window as any).app;
        this.hoverPopover = {} as HoverPopover;
        this.processors = [];
    }

    registerProcessor = vi.fn().mockImplementation((processor: (el: HTMLElement) => void | Promise<void>) => {
        this.processors.push(processor);
    });

    triggerOnCreate = vi.fn().mockImplementation((section: HTMLElement) => {
        this.processors.forEach(processor => processor(section));
    });

    get = vi.fn().mockReturnValue('');
    set = vi.fn();
    clear = vi.fn();
    rerender = vi.fn();
    getScroll = vi.fn().mockReturnValue(0);
    applyScroll = vi.fn();
    onload = vi.fn();
    onunload = vi.fn();
} 