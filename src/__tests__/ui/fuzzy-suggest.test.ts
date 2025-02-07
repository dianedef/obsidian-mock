import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { FuzzySuggestModal } from '../../__mocks__/ui/fuzzy-suggest';
import type { App as IApp } from 'obsidian';

class TestFuzzySuggestModal extends FuzzySuggestModal<string> {
    getItems(): string[] {
        return this.items;
    }

    getItemText(item: string): string {
        return item;
    }

    onChooseItem(item: string): void {
        // Mock implementation
    }

    renderSuggestion(item: string, el: HTMLElement): void {
        el.textContent = item;
    }

    onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent): void {
        // Implementation pour le test
    }
}

describe('FuzzySuggestModal', () => {
    let app: IApp;
    let modal: TestFuzzySuggestModal;

    beforeEach(() => {
        app = new App();
        modal = new TestFuzzySuggestModal(app);
    });

    describe('Gestion des éléments', () => {
        it('devrait gérer une liste vide', () => {
            modal.setItems([]);
            expect(modal.getItems()).toEqual([]);
        });

        it('devrait permettre d\'ajouter des éléments', () => {
            const items = ['test1', 'test2', 'test3'];
            modal.setItems(items);
            expect(modal.getItems()).toEqual(items);
        });
    });

    describe('Recherche floue', () => {
        beforeEach(() => {
            modal.setItems([
                'Pomme',
                'Poire',
                'Banane',
                'Orange',
                'Fraise'
            ]);
        });

        it('devrait retourner tous les éléments si la requête est vide', () => {
            const suggestions = modal.getSuggestions('');
            expect(suggestions).toHaveLength(5);
        });

        it('devrait trouver les éléments avec une correspondance exacte', () => {
            const suggestions = modal.getSuggestions('Pomme');
            expect(suggestions[0].item).toBe('Pomme');
            expect(suggestions).toHaveLength(1);
        });

        it('devrait trouver les éléments avec une correspondance partielle', () => {
            const suggestions = modal.getSuggestions('Po');
            expect(suggestions[0].item).toBe('Pomme');
            expect(suggestions[1].item).toBe('Poire');
            expect(suggestions).toHaveLength(2);
        });

        it('devrait trouver les éléments avec des lettres non consécutives', () => {
            const suggestions = modal.getSuggestions('Pme');
            expect(suggestions[0].item).toBe('Pomme');
            expect(suggestions).toHaveLength(1);
        });

        it('devrait être insensible à la casse', () => {
            const suggestions = modal.getSuggestions('pomme');
            expect(suggestions[0].item).toBe('Pomme');
            expect(suggestions).toHaveLength(1);
        });
    });
}); 