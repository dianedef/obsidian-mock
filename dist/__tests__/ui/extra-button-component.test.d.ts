import '../helpers/dom-extensions';
declare global {
    interface HTMLElement {
        createDiv(className?: string): HTMLDivElement;
    }
}
