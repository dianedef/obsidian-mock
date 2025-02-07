import { vi } from 'vitest';
import type { Notice as INotice } from 'obsidian';

export class Notice implements INotice {
    noticeEl: HTMLElement;
    private duration: number;
    private hideCallback: (() => void) | null = null;

    constructor(message: string | DocumentFragment, duration?: number) {
        this.duration = duration ?? 5000;
        this.noticeEl = document.createElement('div');
        this.noticeEl.className = 'notice';
        
        if (message instanceof DocumentFragment) {
            this.noticeEl.appendChild(message);
        } else {
            this.noticeEl.textContent = message;
        }

        document.body.appendChild(this.noticeEl);
        
        if (this.duration > 0) {
            setTimeout(() => {
                this.hide();
            }, this.duration);
        }
    }

    setMessage(message: string | DocumentFragment): this {
        this.noticeEl.textContent = '';
        if (message instanceof DocumentFragment) {
            this.noticeEl.appendChild(message);
        } else {
            this.noticeEl.textContent = message;
        }
        return this;
    }

    hide(): void {
        if (this.noticeEl.parentElement) {
            this.noticeEl.remove();
        }
        if (this.hideCallback) {
            this.hideCallback();
        }
    }
}