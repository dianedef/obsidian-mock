import { View, WorkspaceLeaf } from 'obsidian';

export class DefaultView extends View {
    navigation: boolean = false;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return 'default';
    }

    getDisplayText(): string {
        return 'Default View';
    }

    async onOpen(): Promise<void> {
        // Nothing to do
    }

    async onClose(): Promise<void> {
        // Nothing to do
    }

    getState(): any {
        return {};
    }

    async setState(state: any, result: any): Promise<void> {
        // Nothing to do
    }
} 