import type { Component } from 'obsidian';
export declare class BaseComponent implements Component {
    private loaded;
    private children;
    private cleanupCallbacks;
    private intervals;
    onload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    load: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    addChild: import("vitest/dist").Mock<any, any>;
    removeChild: import("vitest/dist").Mock<any, any>;
    register: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent: import("vitest/dist").Mock<any, any>;
    registerInterval: import("vitest/dist").Mock<any, any>;
}
