import type { Component as IComponent } from 'obsidian';
/** @public */
export declare function arrayBufferToBase64(buffer: ArrayBuffer): string;
/** @public */
export declare function arrayBufferToHex(data: ArrayBuffer): string;
/** @public */
export declare function base64ToArrayBuffer(base64: string): ArrayBuffer;
/**
 * @public
 */
export declare class BaseComponent implements IComponent {
    /** @public */
    disabled: boolean;
    load: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent: import("vitest/dist").Mock<any, any>;
    registerInterval: import("vitest/dist").Mock<any, any>;
    addChild: import("vitest/dist").Mock<any, any>;
    removeChild: import("vitest/dist").Mock<any, any>;
    register: import("vitest/dist").Mock<any, any>;
    /**
     * Facilitates chaining
     * @public
     */
    then(cb: (component: this) => any): this;
    /**
     * @public
     */
    setDisabled(disabled: boolean): this;
}
