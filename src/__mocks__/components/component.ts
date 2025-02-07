import { vi } from 'vitest';
import type { Component } from 'obsidian';

export class BaseComponent implements Component {
    private loaded: boolean = false;
    private children: Component[] = [];
    private cleanupCallbacks: (() => any)[] = [];
    private intervals: number[] = [];
    containerEl: HTMLElement = document.createElement('div');

    onload = vi.fn();
    onunload = vi.fn();

    load = vi.fn().mockImplementation((): void => {
        if (this.loaded) return;
        this.onload();
        this.children.forEach(child => child.load());
        this.loaded = true;
    });

    unload = vi.fn().mockImplementation((): void => {
        if (!this.loaded) return;
        this.children.forEach(child => child.unload());
        this.intervals.forEach(id => window.clearInterval(id));
        this.cleanupCallbacks.forEach(cb => cb());
        this.children = [];
        this.cleanupCallbacks = [];
        this.intervals = [];
        this.onunload();
        this.loaded = false;
    });

    addChild = vi.fn().mockImplementation((child: Component) => child);
    removeChild = vi.fn().mockImplementation((child: Component) => child);
    register = vi.fn().mockImplementation((cb: () => any) => cb());
    registerEvent = vi.fn();
    registerDomEvent = vi.fn();
    registerInterval = vi.fn().mockImplementation((id: number) => id);
}

export class MockComponent extends BaseComponent {} 