import type { SearchResult, SearchMatches } from 'obsidian';
export declare const createSearchResult: (score: number, matches?: SearchMatches) => SearchResult;
export declare const searchContent: import("vitest/dist").Mock<[content: string, query: string], SearchResult>;
export declare const searchHeadings: import("vitest/dist").Mock<[headings: string[], query: string], SearchResult[]>;
export declare const searchTags: import("vitest/dist").Mock<[tags: string[], query: string], SearchResult[]>;
export declare const highlightMatches: import("vitest/dist").Mock<[text: string, matches: SearchMatches], string>;
