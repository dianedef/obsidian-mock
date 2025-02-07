import { vi } from 'vitest';
import { Component, type HoverParent } from 'obsidian';

export enum PopoverState {
    Showing = 'showing',
    Hiding = 'hiding'
}

export class HoverPopover extends Component {
    hoverEl: HTMLElement;
    state: PopoverState;
    private targetEl: HTMLElement | null;

    constructor(parent: HoverParent, targetEl: HTMLElement | null, waitTime: number = 300) {
        super();
        this.targetEl = targetEl;
        this.hoverEl = document.createElement('div');
        this.hoverEl.addClass('hover-popover');
        this.state = PopoverState.Showing;
    }

    onload(): void {
        if (this.targetEl) {
            this.targetEl.addEventListener('mouseleave', this.hide);
        }
    }

    onunload(): void {
        if (this.targetEl) {
            this.targetEl.removeEventListener('mouseleave', this.hide);
        }
        this.hoverEl.remove();
    }

    hide = vi.fn().mockImplementation((): void => {
        this.state = PopoverState.Hiding;
        this.onunload();
    });

    show = vi.fn().mockImplementation((): void => {
        this.state = PopoverState.Showing;
        this.onload();
    });
}

export function createHoverLinkSource(display: string, defaultMod: boolean = false) {
    return {
        display,
        defaultMod
    };
} 