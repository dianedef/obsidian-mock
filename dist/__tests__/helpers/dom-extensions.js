"use strict";
// Implémentation des méthodes d'extension
HTMLElement.prototype.createDiv = function (className) {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    this.appendChild(div);
    return div;
};
HTMLElement.prototype.addClass = function (className) {
    this.classList.add(className);
};
HTMLElement.prototype.removeClass = function (className) {
    this.classList.remove(className);
};
HTMLElement.prototype.toggleClass = function (className, force) {
    this.classList.toggle(className, force);
};
