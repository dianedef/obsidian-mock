// Extension of HTMLElement to simulate Obsidian methods
declare global {
    interface HTMLElement {
        createDiv(className?: string): HTMLDivElement;
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string, force?: boolean): void;
    }
}

// Implementation of extension methods
HTMLElement.prototype.createDiv = function(className?: string): HTMLDivElement {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    this.appendChild(div);
    return div;
};

HTMLElement.prototype.addClass = function(className: string): void {
    this.classList.add(className);
};

HTMLElement.prototype.removeClass = function(className: string): void {
    this.classList.remove(className);
};

HTMLElement.prototype.toggleClass = function(className: string, force?: boolean): void {
    this.classList.toggle(className, force);
}; 