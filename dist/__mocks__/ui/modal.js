import { vi } from 'vitest';
import { Events } from '../components/events';
export class Modal extends Events {
    constructor(app) {
        super();
        this.shouldRestoreSelection = true;
        this.setTitle = vi.fn().mockImplementation((title) => {
            this.titleEl.setText(title);
            return this;
        });
        this.setContent = vi.fn().mockImplementation((content) => {
            if (content instanceof DocumentFragment) {
                this.contentEl.empty();
                this.contentEl.appendChild(content);
            }
            else {
                this.contentEl.setText(content);
            }
            return this;
        });
        this.app = app;
        this.scope = {
            register: vi.fn(),
            unregister: vi.fn()
        };
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'modal-container';
        this.modalEl = document.createElement('div');
        this.modalEl.className = 'modal';
        this.containerEl.appendChild(this.modalEl);
        this.titleEl = document.createElement('div');
        this.titleEl.className = 'modal-title';
        this.modalEl.appendChild(this.titleEl);
        this.contentEl = document.createElement('div');
        this.contentEl.className = 'modal-content';
        this.modalEl.appendChild(this.contentEl);
    }
    open() {
        document.body.appendChild(this.containerEl);
        this.trigger('open');
    }
    close() {
        if (this.containerEl.parentElement) {
            this.containerEl.remove();
        }
        this.trigger('close');
    }
    onOpen() {
        // Override in subclass
    }
    onClose() {
        // Override in subclass
    }
}
