import { App, WorkspaceRoot as IWorkspaceRoot, WorkspaceParent } from 'obsidian';
import { WorkspaceContainer } from './workspace-components';
export declare class WorkspaceRoot extends WorkspaceContainer implements IWorkspaceRoot {
    direction: 'horizontal' | 'vertical';
    constructor(app: App, parent: WorkspaceParent);
    getContainer(): WorkspaceContainer;
}
