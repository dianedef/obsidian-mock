import { vi } from 'vitest';
import { Component as BaseComponent } from '../components/component';
export class MarkdownRenderChild extends BaseComponent {
    constructor(containerEl) {
        super();
        this.onunload = vi.fn().mockImplementation(() => {
            if (!this.containerEl.isConnected) {
                BaseComponent.prototype.onunload.call(this);
            }
        });
        this.containerEl = containerEl;
    }
}
