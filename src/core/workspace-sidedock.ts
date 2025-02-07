import { WorkspaceItem, WorkspaceParent, App, WorkspaceSidedock as IWorkspaceSidedock, Events, WorkspaceContainer as IWorkspaceContainer } from 'obsidian';
import { WorkspaceContainer } from './workspace-components';
import { MockEventRef } from '../components/events';

export class WorkspaceSidedock extends WorkspaceContainer implements IWorkspaceSidedock {
    side: 'left' | 'right';
    collapsed: boolean = false;
    private events = new Events();

    constructor(side: 'left' | 'right', parent: WorkspaceParent, app: App) {
        super(parent);
        this.side = side;
    }

    toggle(): void {
        this.collapsed = !this.collapsed;
        this.trigger('toggle');
    }

    expand(): void {
        this.collapsed = false;
        this.trigger('expand');
    }

    collapse(): void {
        this.collapsed = true;
        this.trigger('collapse');
    }

    getRoot(): WorkspaceParent {
        return this.parent;
    }

    getContainer(): IWorkspaceContainer {
        return this.parent as IWorkspaceContainer;
    }

    on(name: string, callback: (...data: any[]) => any, ctx?: any): MockEventRef {
        return this.events.on(name, callback, ctx) as MockEventRef;
    }

    off(name: string, callback: (...data: any[]) => any): void {
        this.events.off(name, callback);
    }

    offref(ref: MockEventRef): void {
        this.events.offref(ref);
    }

    trigger(name: string, ...data: any[]): void {
        this.events.trigger(name, ...data);
    }
} 