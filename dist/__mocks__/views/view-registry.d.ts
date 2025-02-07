import type { ViewCreator } from 'obsidian';
export declare class ViewRegistry {
    private viewCreators;
    registerView(type: string, viewCreator: ViewCreator): void;
    getViewCreator(type: string): ViewCreator | null;
    isExtensionRegistered(type: string): boolean;
    unregisterView(type: string): void;
    getRegisteredViews(): string[];
    createView: import("vitest/dist").Mock<any, any>;
}
