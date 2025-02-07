import type { Debouncer } from 'obsidian';
/**
 * Mock version of the standard debounce function
 * @public
 */
export declare function debounce<T extends unknown[], V>(cb: (...args: [...T]) => V, timeout?: number, resetTimer?: boolean): Debouncer<T, V>;
