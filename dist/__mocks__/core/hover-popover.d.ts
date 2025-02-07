import { Component, type HoverParent } from 'obsidian';
export declare enum PopoverState {
    Showing = "showing",
    Hiding = "hiding"
}
export declare class HoverPopover extends Component {
    hoverEl: HTMLElement;
    state: PopoverState;
    private targetEl;
    constructor(parent: HoverParent, targetEl: HTMLElement | null, waitTime?: number);
    onload(): void;
    onunload(): void;
    hide: import("vitest/dist").Mock<any, any>;
    show: import("vitest/dist").Mock<any, any>;
}
export declare function createHoverLinkSource(display: string, defaultMod?: boolean): {
    display: string;
    defaultMod: boolean;
};
