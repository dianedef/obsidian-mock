import { vi } from 'vitest';
import type { Component } from 'obsidian';
import { Component as BaseComponent } from '../components/component';

export class MarkdownRenderChild extends BaseComponent {
    containerEl: HTMLElement;

    constructor(containerEl: HTMLElement) {
        super();
        this.containerEl = containerEl;
    }

    onunload = vi.fn().mockImplementation((): void => {
        if (!this.containerEl.isConnected) {
            BaseComponent.prototype.onunload.call(this);
        }
    });
} 