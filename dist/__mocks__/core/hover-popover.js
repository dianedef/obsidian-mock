import { vi } from 'vitest';
import { Component } from 'obsidian';
export var PopoverState;
(function (PopoverState) {
    PopoverState["Showing"] = "showing";
    PopoverState["Hiding"] = "hiding";
})(PopoverState || (PopoverState = {}));
export class HoverPopover extends Component {
    constructor(parent, targetEl, waitTime = 300) {
        super();
        this.hide = vi.fn().mockImplementation(() => {
            this.state = PopoverState.Hiding;
            this.onunload();
        });
        this.show = vi.fn().mockImplementation(() => {
            this.state = PopoverState.Showing;
            this.onload();
        });
        this.targetEl = targetEl;
        this.hoverEl = document.createElement('div');
        this.hoverEl.addClass('hover-popover');
        this.state = PopoverState.Showing;
    }
    onload() {
        if (this.targetEl) {
            this.targetEl.addEventListener('mouseleave', this.hide);
        }
    }
    onunload() {
        if (this.targetEl) {
            this.targetEl.removeEventListener('mouseleave', this.hide);
        }
        this.hoverEl.remove();
    }
}
export function createHoverLinkSource(display, defaultMod = false) {
    return {
        display,
        defaultMod
    };
}
