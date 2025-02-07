import { vi } from 'vitest';
export class ViewRegistry {
    constructor() {
        this.viewCreators = new Map();
        this.createView = vi.fn().mockImplementation((leaf) => {
            const type = leaf.getViewState().type;
            const creator = this.getViewCreator(type);
            if (creator) {
                return creator(leaf);
            }
            return null;
        });
    }
    registerView(type, viewCreator) {
        this.viewCreators.set(type, viewCreator);
    }
    getViewCreator(type) {
        return this.viewCreators.get(type) || null;
    }
    isExtensionRegistered(type) {
        return this.viewCreators.has(type);
    }
    unregisterView(type) {
        this.viewCreators.delete(type);
    }
    getRegisteredViews() {
        return Array.from(this.viewCreators.keys());
    }
}
