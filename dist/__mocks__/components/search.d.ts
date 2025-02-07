import type { SearchComponent } from 'obsidian';
export declare class MockSearchComponent implements SearchComponent {
    inputEl: HTMLInputElement;
    clearButtonEl: HTMLElement;
    disabled: boolean;
    private onChangeCallback;
    constructor(containerEl: HTMLElement);
    getValue: import("vitest/dist").Mock<any, any>;
    setValue: import("vitest/dist").Mock<any, any>;
    setPlaceholder: import("vitest/dist").Mock<any, any>;
    onChanged: import("vitest/dist").Mock<any, any>;
    onChange: import("vitest/dist").Mock<any, any>;
    clear: import("vitest/dist").Mock<any, any>;
    setDisabled: import("vitest/dist").Mock<any, any>;
    registerOptionListener: import("vitest/dist").Mock<any, any>;
    then: import("vitest/dist").Mock<any, any>;
}
