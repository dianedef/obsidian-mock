import { MockValueComponent } from '../components/value-component';
export declare class ProgressBarComponent extends MockValueComponent<number> {
    private value;
    private progressEl;
    constructor(containerEl: HTMLElement);
    getValue: import("vitest").Mock<any, any>;
    setValue: import("vitest").Mock<any, any>;
    private updateProgressBar;
}
