import { vi } from 'vitest';
import { MockValueComponent } from '../components/value-component';
export class ProgressBarComponent extends MockValueComponent {
    constructor(containerEl) {
        super();
        this.value = 0;
        this.getValue = vi.fn().mockImplementation(() => {
            return this.value;
        });
        this.setValue = vi.fn().mockImplementation((value) => {
            this.value = Math.max(0, Math.min(100, value));
            this.updateProgressBar();
            return this;
        });
        this.progressEl = document.createElement('div');
        this.progressEl.addClass('progress-bar');
        containerEl.appendChild(this.progressEl);
        this.updateProgressBar();
    }
    updateProgressBar() {
        this.progressEl.style.width = `${this.value}%`;
    }
}
