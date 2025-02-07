import type { SearchResult } from 'obsidian';
export declare const prepareFuzzySearch: import("vitest/dist").Mock<[query: string], (text: string) => SearchResult | null>;
export declare const prepareSimpleSearch: import("vitest/dist").Mock<[query: string], (text: string) => SearchResult | null>;
