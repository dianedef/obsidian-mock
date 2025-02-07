import type { ISuggestOwner } from 'obsidian';
export declare class MockSuggestOwner<T> implements ISuggestOwner<T> {
    limit: number;
    emptyStateText: string;
    inputEl: HTMLInputElement;
    resultContainerEl: HTMLElement;
    setPlaceholder: import("vitest/dist").Mock<any, any>;
    setInstructions: import("vitest/dist").Mock<any, any>;
    onNoSuggestion: import("vitest/dist").Mock<any, any>;
    selectSuggestion: import("vitest/dist").Mock<any, any>;
    selectActiveSuggestion: import("vitest/dist").Mock<any, any>;
    getSuggestions: import("vitest/dist").Mock<any, any>;
    renderSuggestion: import("vitest/dist").Mock<any, any>;
    onChooseSuggestion: import("vitest/dist").Mock<any, any>;
}
