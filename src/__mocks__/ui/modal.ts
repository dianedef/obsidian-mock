import { vi } from 'vitest';
import type { Modal as IModal } from 'obsidian';
import { Events } from '../components/events';

export class Modal extends Events implements IModal {
    app: any;
    scope: any;
    containerEl: HTMLElement;
    modalEl: HTMLElement;
    titleEl: HTMLElement;
    contentEl: HTMLElement;
    shouldRestoreSelection: boolean = true;

    constructor(app: any) {
        super();
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

    open(): void {
        document.body.appendChild(this.containerEl);
        this.trigger('open');
    }

    close(): void {
        if (this.containerEl.parentElement) {
            this.containerEl.remove();
        }
        this.trigger('close');
    }

    onOpen(): void {
        // Override in subclass
    }

    onClose(): void {
        // Override in subclass
    }

    setTitle = vi.fn().mockImplementation((title: string): this => {
        this.titleEl.setText(title);
        return this;
    });

    setContent = vi.fn().mockImplementation((content: string | DocumentFragment): this => {
        if (content instanceof DocumentFragment) {
            this.contentEl.empty();
            this.contentEl.appendChild(content);
        } else {
            this.contentEl.setText(content);
        }
        return this;
    });
}
