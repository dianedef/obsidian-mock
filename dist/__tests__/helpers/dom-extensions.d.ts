declare global {
    interface HTMLElement {
        createDiv(className?: string): HTMLDivElement;
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string, force?: boolean): void;
    }
}
