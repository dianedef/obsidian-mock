import { setIcon } from 'obsidian';
import { BaseComponent } from '../components/component';
export class ButtonComponent extends BaseComponent {
    /**
     * @public
     */
    constructor(containerEl) {
        super();
        this.disabled = false;
        this.buttonEl = containerEl.createEl('button');
    }
    /**
     * @public
     */
    setDisabled(disabled) {
        this.disabled = disabled;
        this.buttonEl.disabled = disabled;
        return this;
    }
    /**
     * @public
     */
    setCta() {
        this.buttonEl.addClass('mod-cta');
        return this;
    }
    /**
     * @public
     */
    removeCta() {
        this.buttonEl.removeClass('mod-cta');
        return this;
    }
    /**
     * @public
     */
    setWarning() {
        this.buttonEl.addClass('mod-warning');
        return this;
    }
    /**
     * @public
     */
    setTooltip(tooltip) {
        this.buttonEl.setAttribute('aria-label', tooltip);
        return this;
    }
    /**
     * @public
     */
    setButtonText(text) {
        this.buttonEl.textContent = text;
        return this;
    }
    /**
     * @public
     */
    setClass(cls) {
        this.buttonEl.className = cls;
        return this;
    }
    /**
     * @public
     */
    setIcon(icon) {
        setIcon(this.buttonEl, icon);
        return this;
    }
    /**
     * @public
     */
    onClick(callback) {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
}
