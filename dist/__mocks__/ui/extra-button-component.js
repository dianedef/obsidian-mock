import { BaseComponent } from '../components/base-component';
/**
 * @public
 */
export class ExtraButtonComponent extends BaseComponent {
    /**
     * @public
     */
    constructor(containerEl) {
        super();
        /**
         * @public
         */
        this.extraSettingsEl = document.createElement('div');
        this.extraSettingsEl = containerEl.createDiv('extra-settings-button');
    }
    /**
     * @public
     */
    setDisabled(disabled) {
        super.setDisabled(disabled);
        this.extraSettingsEl.toggleClass('is-disabled', disabled);
        return this;
    }
    /**
     * @public
     */
    setTooltip(tooltip, _options) {
        this.extraSettingsEl.setAttribute('aria-label', tooltip);
        return this;
    }
    /**
     * @param icon - ID de l'icône
     * @public
     */
    setIcon(icon) {
        this.extraSettingsEl.addClass(`${icon}-icon`);
        return this;
    }
    /**
     * @public
     */
    onClick(callback) {
        this.extraSettingsEl.addEventListener('click', callback);
        return this;
    }
}
