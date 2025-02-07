import type { App, ISuggestOwner, CloseableComponent } from 'obsidian';
import { Scope } from '../components/scope';
export declare abstract class PopoverSuggest<T> implements ISuggestOwner<T>, CloseableComponent {
    app: App;
    scope: Scope;
    constructor(app: App, scope?: Scope);
    open: import("vitest/dist").Mock<[], void>;
    close: import("vitest/dist").Mock<[], void>;
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
}
export declare abstract class AbstractInputSuggest<T> extends PopoverSuggest<T> {
    limit: number;
    private textInputEl;
    private onSelectCallback;
    constructor(app: App, textInputEl: HTMLInputElement | HTMLDivElement);
    setValue: import("vitest/dist").Mock<[value: string], void>;
    getValue: import("vitest/dist").Mock<[], string>;
    protected abstract getSuggestions(query: string): T[] | Promise<T[]>;
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    selectSuggestion: import("vitest/dist").Mock<[value: T, evt: MouseEvent | KeyboardEvent], void>;
    onSelect: import("vitest/dist").Mock<[callback: (value: T, evt: MouseEvent | KeyboardEvent) => any], this>;
}
