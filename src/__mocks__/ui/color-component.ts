import { vi } from 'vitest';
import type { ColorComponent as IColorComponent, RGB, HSL } from 'obsidian';

export class ColorComponent implements IColorComponent {
    containerEl: HTMLElement;
    inputEl: HTMLInputElement;
    disabled: boolean = false;
    private changeCallback: ((value: string) => any) | null = null;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'color';
        this.inputEl.className = 'color-input';
        containerEl.appendChild(this.inputEl);
        this.inputEl.addEventListener('input', this.onChanged.bind(this));
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        if (this.changeCallback) {
            this.changeCallback(value);
        }
        return this;
    }

    getValueRgb(): RGB {
        const hex = this.getValue().substring(1);
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    getValueHsl(): HSL {
        const { r, g, b } = this.getValueRgb();
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const delta = max - min;
        
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        
        if (delta !== 0) {
            s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            
            switch (max) {
                case rNorm:
                    h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
                    break;
                case gNorm:
                    h = (bNorm - rNorm) / delta + 2;
                    break;
                case bNorm:
                    h = (rNorm - gNorm) / delta + 4;
                    break;
            }
            h *= 60;
        }
        
        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    setValueRgb(rgb: RGB): this {
        const hex = '#' + 
            rgb.r.toString(16).padStart(2, '0') +
            rgb.g.toString(16).padStart(2, '0') +
            rgb.b.toString(16).padStart(2, '0');
        return this.setValue(hex);
    }

    setValueHsl(hsl: HSL): this {
        const h = hsl.h;
        const s = hsl.s / 100;
        const l = hsl.l / 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r = 0, g = 0, b = 0;
        
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else if (h >= 300 && h < 360) {
            r = c; g = 0; b = x;
        }
        
        return this.setValueRgb({
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        });
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }

    onChanged(): void {
        const value = this.getValue();
        if (this.changeCallback) {
            this.changeCallback(value);
        }
    }

    onChange(callback: (value: string) => any): this {
        this.changeCallback = callback;
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
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
} 