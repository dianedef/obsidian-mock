import { Events } from '../components/events';
export class WorkspaceItemBase extends Events {
    addChild(child, index) {
        if (Array.isArray(this.children)) {
            if (typeof index === 'number') {
                this.children.splice(index, 0, child);
            }
            else {
                this.children.push(child);
            }
        }
    }
    removeChild(child) {
        if (Array.isArray(this.children)) {
            const index = this.children.indexOf(child);
            if (index > -1) {
                this.children.splice(index, 1);
            }
        }
    }
}
