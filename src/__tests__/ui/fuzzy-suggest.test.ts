import { describe, it, expect, beforeEach } from 'vitest';
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
        // Implementation for the test
    }
}

describe('FuzzySuggestModal', () => {
    let app: IApp;
    let modal: TestFuzzySuggestModal;

    beforeEach(() => {
        app = new App();
        modal = new TestFuzzySuggestModal(app);
    });

    describe('Item Management', () => {
        it('should handle an empty list', () => {
            modal.setItems([]);
            expect(modal.getItems()).toEqual([]);
        });

        it('should allow adding items', () => {
            const items = ['test1', 'test2', 'test3'];
            modal.setItems(items);
            expect(modal.getItems()).toEqual(items);
        });
    });

    describe('Fuzzy Search', () => {
        beforeEach(() => {
            modal.setItems(['Apple', 'Banana', 'Orange', 'Pear', 'Grape']);
        });

        it('should return all items if the query is empty', () => {
            const suggestions = modal.getSuggestions('');
            expect(suggestions).toHaveLength(5);
        });

        it('should find items with an exact match', () => {
            const suggestions = modal.getSuggestions('Apple');
            expect(suggestions[0].item).toBe('Apple');
            expect(suggestions).toHaveLength(1);
        });

        it('should find items with a partial match', () => {
            const suggestions = modal.getSuggestions('Pe');
            const matches = suggestions.filter(s => s.match.score >= 0.8);
            expect(matches[0].item).toBe('Pear');
            expect(matches).toHaveLength(1);
        });

        it('should find items with non-consecutive letters', () => {
            const suggestions = modal.getSuggestions('Apl');
            expect(suggestions[0].item).toBe('Apple');
            expect(suggestions).toHaveLength(1);
        });

        it('should be case-insensitive', () => {
            const suggestions = modal.getSuggestions('apple');
            expect(suggestions[0].item).toBe('Apple');
            expect(suggestions).toHaveLength(1);
        });
    });
}); 