import { Events, Scope } from 'obsidian';
export class FuzzySuggestModal extends Events {
    constructor(app) {
        super();
        this.items = [];
        this.limit = 50;
        this.emptyStateText = 'No results found.';
        this.shouldRestoreSelection = true;
        this.openCallback = null;
        this.closeCallback = null;
        this.instructions = [];
        this.activeSuggestion = 0;
        this.suggestions = [];
        this.selectedItem = null;
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
    setTitle(title) {
        while (this.titleEl.firstChild) {
            this.titleEl.removeChild(this.titleEl.firstChild);
        }
        if (title instanceof DocumentFragment) {
            this.titleEl.appendChild(title);
        }
        else {
            this.titleEl.textContent = title;
        }
        return this;
    }
    setContent(content) {
        while (this.contentEl.firstChild) {
            this.contentEl.removeChild(this.contentEl.firstChild);
        }
        if (content instanceof DocumentFragment) {
            this.contentEl.appendChild(content);
        }
        else {
            this.contentEl.textContent = content;
        }
        return this;
    }
    setInstructions(instructions) {
        this.instructions = instructions;
    }
    onNoSuggestion() {
        this.resultContainerEl.textContent = this.emptyStateText;
    }
    selectActiveSuggestion(evt) {
        const suggestions = this.getSuggestions(this.inputEl.value);
        if (suggestions.length > 0 && this.activeSuggestion >= 0 && this.activeSuggestion < suggestions.length) {
            this.onChooseSuggestion(suggestions[this.activeSuggestion], evt);
        }
    }
    setItems(items) {
        this.items = items;
        this.updateSuggestions();
    }
    getItems() {
        return this.items;
    }
    getSuggestions(query) {
        if (!query) {
            return this.items.map(item => ({
                item,
                match: {
                    score: 0,
                    matches: []
                }
            }));
        }
        const normalizedQuery = query.toLowerCase();
        const results = [];
        for (const item of this.items) {
            const text = this.getItemText(item).toLowerCase();
            const matches = this.findMatches(text, normalizedQuery);
            if (matches.length > 0) {
                results.push({
                    item,
                    match: {
                        score: this.calculateScore(matches, text.length),
                        matches
                    }
                });
            }
        }
        return results.sort((a, b) => b.match.score - a.match.score);
    }
    findMatches(text, query) {
        const matches = [];
        let textIndex = 0;
        for (const queryChar of query) {
            let found = false;
            while (textIndex < text.length) {
                if (text[textIndex] === queryChar) {
                    const match = [textIndex, textIndex + 1];
                    matches.push(match);
                    textIndex++;
                    found = true;
                    break;
                }
                textIndex++;
            }
            if (!found)
                return [];
        }
        return matches;
    }
    calculateScore(matches, textLength) {
        if (matches.length === 0)
            return 0;
        let consecutiveCount = 1;
        let maxConsecutive = 1;
        for (let i = 1; i < matches.length; i++) {
            if (matches[i][0] === matches[i - 1][1]) {
                consecutiveCount++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
            }
            else {
                consecutiveCount = 1;
            }
        }
        const positionScore = matches.reduce((sum, match) => sum + (textLength - match[0]), 0);
        return maxConsecutive * 100 + positionScore;
    }
    selectSuggestion(value, evt) {
        if (value && value.item) {
            this.onChooseItem(value.item, evt);
        }
    }
    onChooseSuggestion(item, evt) {
        this.selectSuggestion(item, evt);
    }
    renderSuggestion(value, el) {
        el.textContent = this.getItemText(value.item);
    }
    open() {
        document.body.appendChild(this.containerEl);
        this.inputEl.focus();
        if (this.openCallback) {
            this.openCallback();
        }
    }
    close() {
        this.containerEl.remove();
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }
        if (this.closeCallback) {
            this.closeCallback();
        }
    }
    onOpen() {
        this.items = this.getItems();
        this.updateSuggestions();
    }
    onClose() {
        this.items = [];
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }
    }
    updateSuggestions() {
        const suggestions = this.getSuggestions(this.inputEl.value);
        while (this.resultContainerEl.firstChild) {
            this.resultContainerEl.removeChild(this.resultContainerEl.firstChild);
        }
        if (suggestions.length === 0) {
            this.onNoSuggestion();
            return;
        }
        suggestions.slice(0, this.limit).forEach((suggestion, _index) => {
            const el = document.createElement('div');
            el.className = 'suggestion-item';
            this.renderSuggestion(suggestion, el);
            el.addEventListener('click', (evt) => {
                this.onChooseSuggestion(suggestion, evt);
            });
            this.resultContainerEl.appendChild(el);
        });
    }
    setPlaceholder(placeholder) {
        this.inputEl.placeholder = placeholder;
    }
    addInstruction(instruction) {
        this.instructions.push(instruction);
    }
}
