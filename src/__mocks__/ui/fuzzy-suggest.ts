import { vi } from 'vitest';
import type { App, FuzzyMatch, Instruction, SearchMatches, SearchMatchPart } from 'obsidian';
import { Events } from '../components/events';
import { Scope } from '../core/scope';

export abstract class FuzzySuggestModal<T> extends Events {
    app: App;
    scope: Scope;
    inputEl: HTMLInputElement;
    resultContainerEl: HTMLElement;
    items: T[] = [];
    limit: number = 50;
    emptyStateText: string = 'No results found.';
    containerEl: HTMLElement;
    modalEl: HTMLElement;
    titleEl: HTMLElement;
    contentEl: HTMLElement;
    shouldRestoreSelection: boolean = true;
    private openCallback: (() => void) | null = null;
    private closeCallback: (() => void) | null = null;
    private instructions: Instruction[] = [];
    private activeSuggestion: number = 0;
    suggestions: T[] = [];
    selectedItem: T | null = null;

    constructor(app: App) {
        super();
        this.app = app;
        this.scope = new Scope();
        this.containerEl = document.createElement('div');
        this.modalEl = document.createElement('div');
        this.titleEl = document.createElement('div');
        this.contentEl = document.createElement('div');
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.className = 'prompt-input';
        this.resultContainerEl = document.createElement('div');
        this.resultContainerEl.className = 'suggestion-container';

        this.containerEl.appendChild(this.modalEl);
        this.modalEl.appendChild(this.titleEl);
        this.modalEl.appendChild(this.contentEl);
        this.contentEl.appendChild(this.inputEl);
        this.contentEl.appendChild(this.resultContainerEl);
    }

    setTitle(title: string | DocumentFragment): this {
        while (this.titleEl.firstChild) {
            this.titleEl.removeChild(this.titleEl.firstChild);
        }
        if (title instanceof DocumentFragment) {
            this.titleEl.appendChild(title);
        } else {
            this.titleEl.textContent = title;
        }
        return this;
    }

    setContent(content: string | DocumentFragment): this {
        while (this.contentEl.firstChild) {
            this.contentEl.removeChild(this.contentEl.firstChild);
        }
        if (content instanceof DocumentFragment) {
            this.contentEl.appendChild(content);
        } else {
            this.contentEl.textContent = content;
        }
        return this;
    }

    setInstructions(instructions: Instruction[]): void {
        this.instructions = instructions;
    }

    onNoSuggestion(): void {
        this.resultContainerEl.textContent = this.emptyStateText;
    }

    selectActiveSuggestion(evt: MouseEvent | KeyboardEvent): void {
        const suggestions = this.getSuggestions(this.inputEl.value);
        if (suggestions.length > 0 && this.activeSuggestion >= 0 && this.activeSuggestion < suggestions.length) {
            this.onChooseSuggestion(suggestions[this.activeSuggestion], evt);
        }
    }

    setItems(items: T[]): void {
        this.items = items;
        this.updateSuggestions();
    }

    getItems(): T[] {
        return this.items;
    }

    getSuggestions(query: string): FuzzyMatch<T>[] {
        if (!query) {
            return this.items.map(item => ({
                item,
                match: { score: 0, matches: [] }
            }));
        }

        const suggestions: FuzzyMatch<T>[] = [];
        const lowerQuery = query.toLowerCase();

        for (const item of this.items) {
            const text = this.getItemText(item).toLowerCase();
            const matches = this.findMatches(text, lowerQuery);
            if (matches.length > 0) {
                const score = this.calculateScore(matches, text.length);
                if (score > 0) {
                    suggestions.push({
                        item,
                        match: { score, matches }
                    });
                }
            }
        }

        return suggestions
            .sort((a, b) => b.match.score - a.match.score)
            .slice(0, this.limit);
    }

    private findMatches(text: string, query: string): SearchMatches {
        const matches: SearchMatchPart[] = [];
        let lastIndex = 0;
        let queryIndex = 0;

        while (queryIndex < query.length) {
            const char = query[queryIndex];
            const index = text.indexOf(char, lastIndex);
            
            if (index === -1) {
                return [];
            }

            matches.push({
                start: index,
                end: index + 1
            });

            lastIndex = index + 1;
            queryIndex++;
        }

        return matches;
    }

    private calculateScore(matches: SearchMatches, textLength: number): number {
        if (matches.length === 0) return 0;

        // Calcul du score basé sur :
        // 1. La longueur des correspondances par rapport à la longueur totale
        // 2. La continuité des correspondances
        // 3. La position des correspondances (préférence pour le début)

        let totalLength = 0;
        let continuityBonus = 0;
        let positionScore = 0;

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            totalLength += match.end - match.start;

            // Bonus pour les correspondances au début
            positionScore += 1 / (match.start + 1);

            // Bonus pour les correspondances continues
            if (i > 0 && matches[i - 1].end === match.start) {
                continuityBonus += 0.5;
            }
        }

        const lengthScore = totalLength / textLength;
        const score = (lengthScore + continuityBonus + positionScore) / 2;

        return Math.min(Math.max(score, 0), 1);
    }

    abstract getItemText(item: T): string;
    abstract onChooseItem(item: T, evt: MouseEvent | KeyboardEvent): void;

    selectSuggestion(value: FuzzyMatch<T>, evt: MouseEvent | KeyboardEvent): void {
        if (value && value.item) {
            this.onChooseItem(value.item, evt);
        }
    }

    onChooseSuggestion(item: FuzzyMatch<T>, evt: MouseEvent | KeyboardEvent): void {
        this.selectSuggestion(item, evt);
    }

    renderSuggestion(value: FuzzyMatch<T>, el: HTMLElement): void {
        el.textContent = this.getItemText(value.item);
    }

    open(): void {
        document.body.appendChild(this.containerEl);
        this.inputEl.focus();
        if (this.openCallback) {
            this.openCallback();
        }
    }

    close(): void {
        this.containerEl.remove();
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }
        if (this.closeCallback) {
            this.closeCallback();
        }
    }

    onOpen(): void {
        this.items = this.getItems();
        this.updateSuggestions();
    }

    onClose(): void {
        this.items = [];
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }
    }

    private updateSuggestions(): void {
        const suggestions = this.getSuggestions(this.inputEl.value);
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }

        if (suggestions.length === 0) {
            this.onNoSuggestion();
            return;
        }

        suggestions.slice(0, this.limit).forEach((suggestion, index) => {
            const el = document.createElement('div');
            el.className = 'suggestion-item';
            this.renderSuggestion(suggestion, el);
            el.addEventListener('click', (evt) => {
                this.onChooseSuggestion(suggestion, evt);
            });
            this.resultContainerEl.appendChild(el);
        });
    }

    setPlaceholder(placeholder: string): void {
        this.inputEl.placeholder = placeholder;
    }

    addInstruction(instruction: Instruction): void {
        this.instructions.push(instruction);
    }
} 