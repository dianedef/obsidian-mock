import { vi } from 'vitest';
import type { ISuggestOwner } from 'obsidian';

export class SuggestOwner<T> implements ISuggestOwner<T> {
    suggestions: T[] = [];
    selectedItem: number = 0;

    renderSuggestion = vi.fn();
    selectSuggestion = vi.fn();
} 