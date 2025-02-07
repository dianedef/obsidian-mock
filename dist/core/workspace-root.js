import { WorkspaceContainer } from './workspace-components';
export class WorkspaceRoot extends WorkspaceContainer {
    constructor(app, parent) {
        super(parent);
        this.direction = 'horizontal';
        this.containerEl.addClass('workspace-root');
    }
    getContainer() {
        return this;
    }
}
