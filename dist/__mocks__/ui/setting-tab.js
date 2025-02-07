import { Events } from '../components/events';
export class SettingTab extends Events {
    constructor(app, containerEl) {
        super();
        this.app = app;
        this.containerEl = containerEl;
    }
    display() {
        this.containerEl.empty();
    }
    hide() {
        this.containerEl.empty();
    }
}
