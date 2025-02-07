import { WorkspaceParent, App, WorkspaceSidedock as IWorkspaceSidedock, WorkspaceContainer as IWorkspaceContainer } from 'obsidian';
import { WorkspaceContainer } from './workspace-components';
import { MockEventRef } from '../components/events';
export declare class WorkspaceSidedock extends WorkspaceContainer implements IWorkspaceSidedock {
    side: 'left' | 'right';
    collapsed: boolean;
    private events;
    constructor(side: 'left' | 'right', parent: WorkspaceParent, app: App);
    toggle(): void;
    expand(): void;
    collapse(): void;
    getRoot(): WorkspaceParent;
    getContainer(): IWorkspaceContainer;
    on(name: string, callback: (...data: any[]) => any, ctx?: any): MockEventRef;
    off(name: string, callback: (...data: any[]) => any): void;
    offref(ref: MockEventRef): void;
    trigger(name: string, ...data: any[]): void;
}
