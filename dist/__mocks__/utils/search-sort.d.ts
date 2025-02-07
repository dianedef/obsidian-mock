import type { SearchResultContainer as BaseSearchResultContainer } from 'obsidian';
interface SearchResultContainer extends BaseSearchResultContainer {
    score?: number;
}
export declare function prepareQuery(query: string): string[];
export declare function fuzzySearch(query: string, text: string): boolean;
export declare function sortSearchResults(results: SearchResultContainer[]): SearchResultContainer[];
export {};
