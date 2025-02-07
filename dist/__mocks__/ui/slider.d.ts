import type { SliderComponent as ISliderComponent } from 'obsidian';
export declare class SliderComponent implements ISliderComponent {
    sliderEl: HTMLInputElement;
    disabled: boolean;
    private changeCallback;
    private instant;
    constructor(containerEl: HTMLElement);
    getValue(): number;
    setValue(value: number): this;
    setDisabled(disabled: boolean): this;
    setLimits(min: number, max: number, step: number): this;
    setInstant(instant: boolean): this;
    onChanged(): void;
    onChange(callback: (value: number) => any): this;
    registerOptionListener(listeners: Record<string, (value?: number) => number>, key: string): this;
    then(cb: (component: this) => any): this;
    getValuePretty: import("vitest/dist").Mock<any, any>;
    setDynamicTooltip: import("vitest/dist").Mock<any, any>;
    showTooltip: import("vitest/dist").Mock<any, any>;
}
