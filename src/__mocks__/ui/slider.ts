import { vi } from 'vitest';
import type { SliderComponent as ISliderComponent } from 'obsidian';

export class SliderComponent implements ISliderComponent {
    sliderEl: HTMLInputElement;
    disabled: boolean = false;
    private changeCallback: ((value: number) => any) | null = null;
    private instant: boolean = false;

    constructor(containerEl: HTMLElement) {
        this.sliderEl = document.createElement('input');
        this.sliderEl.type = 'range';
        this.sliderEl.className = 'slider';
        containerEl.appendChild(this.sliderEl);
        this.sliderEl.addEventListener('input', () => {
            if (this.instant) {
                this.onChanged();
            }
        });
        this.sliderEl.addEventListener('change', this.onChanged.bind(this));
    }

    getValue(): number {
        return Number(this.sliderEl.value);
    }

    setValue(value: number): this {
        this.sliderEl.value = String(value);
        if (this.changeCallback) {
            this.changeCallback(value);
        }
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.sliderEl.disabled = disabled;
        return this;
    }

    setLimits(min: number, max: number, step: number): this {
        this.sliderEl.min = String(min);
        this.sliderEl.max = String(max);
        this.sliderEl.step = String(step);
        return this;
    }

    setInstant(instant: boolean): this {
        this.instant = instant;
        return this;
    }

    onChanged(): void {
        const value = this.getValue();
        if (this.changeCallback) {
            this.changeCallback(value);
        }
    }

    onChange(callback: (value: number) => any): this {
        this.changeCallback = callback;
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: number) => number>, key: string): this {
        this.onChange((value) => {
            if (listeners[key]) {
                return listeners[key](value);
            }
            return value;
        });
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    getValuePretty = vi.fn().mockImplementation((): string => {
        return this.getValue().toString();
    });

    setDynamicTooltip = vi.fn().mockImplementation((): this => {
        this.sliderEl.title = this.getValuePretty();
        return this;
    });

    showTooltip = vi.fn().mockImplementation((): void => {
        this.setDynamicTooltip();
    });
} 