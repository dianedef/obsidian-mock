import type { KeymapEventHandler, Modifier, KeymapEventListener } from 'obsidian';
import { vi } from 'vitest';

export interface DomElementInfo {
    cls?: string | string[];
    text?: string | DocumentFragment;
    attr?: { [key: string]: string | number | boolean | null };
    title?: string;
    parent?: Node;
    value?: string;
    type?: string;
    prepend?: boolean;
    placeholder?: string;
    href?: string;
}

export interface SvgElementInfo {
    cls?: string | string[];
    attr?: { [key: string]: string | number | boolean | null };
    parent?: Node;
    prepend?: boolean;
}

export class MockScope {
    register = vi.fn().mockImplementation((modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler => {
        return func as KeymapEventHandler;
    });

    unregister = vi.fn();
}

export const createMockScope = (): MockScope => new MockScope(); 