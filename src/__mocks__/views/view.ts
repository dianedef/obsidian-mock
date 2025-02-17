import { BaseComponent } from '../components/base-component';
import { WorkspaceLeaf } from './workspace-leaf';
import { App } from '../core/app';

export abstract class View extends BaseComponent {
    leaf: WorkspaceLeaf;
    navigation: boolean;
    
    constructor(leaf: WorkspaceLeaf) {
        super();
        this.leaf = leaf;
        this.navigation = false;
    }

    abstract getViewType(): string;

    getDisplayText(): string {
        return this.getViewType();
    }

    getIcon(): string {
        return 'document';
    }

    onload(): void {
        // À implémenter par les classes dérivées
    }

    onunload(): void {
        // À implémenter par les classes dérivées
    }

    getState(): any {
        return {};
    }

    setState(state: any, result: any): void {
        // À implémenter par les classes dérivées
    }

    getEphemeralState(): any {
        return {};
    }

    setEphemeralState(state: any): void {
        // À implémenter par les classes dérivées
    }

    getScroll(): number {
        return 0;
    }

    get app(): App {
        return this.leaf.app;
    }
} 