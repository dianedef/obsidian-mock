interface DomElementInfo {
    cls?: string | string[];
    text?: string;
    attr?: Record<string, string | number | boolean>;
    title?: string;
}
declare global {
    interface Element {
        addClass(cls: string): void;
        removeClass(cls: string): void;
        toggleClass(cls: string, value: boolean): void;
        setText(text: string): void;
        empty(): void;
        detach(): void;
        createDiv(options?: {
            cls?: string;
        }): HTMLDivElement;
        createSpan(options?: {
            cls?: string;
        }): HTMLSpanElement;
        createEl<K extends keyof HTMLElementTagNameMap>(tag: K, options?: {
            cls?: string;
            attr?: Record<string, string>;
        }): HTMLElementTagNameMap[K];
    }
}
export declare function isDOMSupported(): boolean;
import type { TooltipOptions } from 'obsidian';
export declare const setIcon: import("vitest/dist").Mock<[parent: HTMLElement, iconId: string], void>;
export declare const setTooltip: import("vitest/dist").Mock<[el: HTMLElement, tooltip: string, options?: TooltipOptions | undefined], void>;
export { DomElementInfo };
declare global {
    interface HTMLElement {
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string, value?: boolean): void;
        hasClass(className: string): boolean;
        empty(): void;
        detach(): void;
    }
}
