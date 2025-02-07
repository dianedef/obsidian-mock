import { Events } from '../components/events';
export class PluginSettingTab extends Events {
    constructor(app, plugin) {
        super();
        this.app = app;
        this.plugin = plugin;
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'plugin-settings-tab';
    }
    display() {
        this.containerEl.empty();
    }
    hide() {
        this.containerEl.empty();
    }
}
