import { vi } from 'vitest';
import type { Notice as INotice } from 'obsidian';

export class Notice implements INotice {
    private message: string;
    private timeout: number;
    noticeEl: HTMLElement;
    private static activeNotices: Notice[] = [];
    static maxNotices = 5;

    constructor(message: string, timeout: number = 5000) {
        this.message = message;
        this.timeout = timeout;
        this.noticeEl = document.createElement('div');
        this.noticeEl.addClass('notice');
        this.noticeEl.setText(message);

        // Ajouter cette notice à la liste des notices actives
        Notice.activeNotices.push(this);

        // Limiter le nombre de notices actives
        while (Notice.activeNotices.length > Notice.maxNotices) {
            Notice.activeNotices[0].hide();
        }

        // Configurer la disparition automatique
        if (timeout) {
            setTimeout(() => this.hide(), timeout);
        }
    }

    setMessage(message: string): this {
        this.message = message;
        this.noticeEl.setText(message);
        return this;
    }

    hide(): void {
        const index = Notice.activeNotices.indexOf(this);
        if (index > -1) {
            Notice.activeNotices.splice(index, 1);
        }
        this.noticeEl.remove();
    }

    // Méthodes utilitaires pour les tests
    static getActiveNotices(): Notice[] {
        return Notice.activeNotices;
    }

    static clearAll(): void {
        Notice.activeNotices.forEach(notice => notice.hide());
        Notice.activeNotices = [];
    }

    getMessage(): string {
        return this.message;
    }

    getTimeout(): number {
        return this.timeout;
    }
}

// Créer un spy pour pouvoir suivre la création des notices dans les tests
export const NoticeSpy = vi.fn().mockImplementation((message: string, timeout?: number) => {
    return new Notice(message, timeout);
}); 