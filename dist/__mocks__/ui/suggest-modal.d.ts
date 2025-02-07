import type { App } from 'obsidian';
import { Modal } from './modal';
/**
 * @public
 */
export declare abstract class SuggestModal<T> extends Modal {
    private suggestOwner;
    /**
     * @public
     */
    constructor(app: App);
    get limit(): number;
    set limit(value: number);
    get emptyStateText(): string;
    set emptyStateText(value: string);
    get inputEl(): HTMLInputElement;
    set inputEl(value: HTMLInputElement);
    get resultContainerEl(): HTMLElement;
    set resultContainerEl(value: HTMLElement);
    setPlaceholder: import("vitest/dist").Mock<any, any>;
    setInstructions: import("vitest/dist").Mock<any, any>;
    onNoSuggestion: import("vitest/dist").Mock<any, any>;
    selectSuggestion: import("vitest/dist").Mock<any, any>;
    selectActiveSuggestion: import("vitest/dist").Mock<any, any>;
    abstract getSuggestions(query: string): T[] | Promise<T[]>;
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract onChooseSuggestion(item: T, evt: MouseEvent | KeyboardEvent): void;
}
