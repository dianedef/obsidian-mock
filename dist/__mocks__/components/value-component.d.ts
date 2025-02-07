import { BaseComponent } from './base-component';
export declare abstract class ValueComponent<T> extends BaseComponent {
    protected containerEl: HTMLElement;
    protected value: T;
    constructor(value: T);
    getValue(): T;
    setValue(value: T): this;
    load: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    addChild: import("vitest/dist").Mock<any, any>;
    removeChild: import("vitest/dist").Mock<any, any>;
    register: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent: import("vitest/dist").Mock<any, any>;
    registerInterval: import("vitest/dist").Mock<any, any>;
    getContainerEl(): HTMLElement;
    registerOptionListener(listeners: Record<string, (value?: T) => T>, key: string): this;
}
