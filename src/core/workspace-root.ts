import { App, WorkspaceRoot as IWorkspaceRoot, WorkspaceParent } from 'obsidian';
import { WorkspaceContainer } from './workspace-components';

export class WorkspaceRoot extends WorkspaceContainer implements IWorkspaceRoot {
    direction: 'horizontal' | 'vertical' = 'horizontal';

    constructor(app: App, parent: WorkspaceParent) {
        super(parent);
        this.containerEl.addClass('workspace-root');
    }

    getContainer(): WorkspaceContainer {
        return this;
    }
} 