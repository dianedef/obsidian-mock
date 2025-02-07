import type { SearchMatches, SearchResult } from 'obsidian';
export declare const renderMatches: import("vitest/dist").Mock<[el: HTMLElement | DocumentFragment, text: string, matches: SearchMatches | null, offset?: number | undefined], void>;
export declare const renderResults: import("vitest/dist").Mock<[el: HTMLElement, text: string, result: SearchResult, offset?: number | undefined], void>;
