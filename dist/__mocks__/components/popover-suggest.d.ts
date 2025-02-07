import type { App, CloseableComponent, ISuggestOwner, Scope } from 'obsidian';
export declare enum PopoverState {
    Closed = "closed",
    Open = "open",
    Loading = "loading"
}
export declare abstract class MockPopoverSuggest<T> implements ISuggestOwner<T>, CloseableComponent {
    app: App;
    scope: Scope;
    suggestEl: HTMLElement;
    isOpen: boolean;
    state: PopoverState;
    constructor(app: App, scope?: Scope);
    open(): void;
    close(): void;
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
}
