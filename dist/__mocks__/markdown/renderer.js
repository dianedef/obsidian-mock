var _a;
import { vi } from 'vitest';
import { MockMarkdownRenderChild } from './render-child';
import { MockHoverPopover } from '../components/hover-popover';
export class MockMarkdownRenderer extends MockMarkdownRenderChild {
    constructor(app, containerEl) {
        super(containerEl);
        this.app = app;
        this.hoverPopover = new MockHoverPopover(this, null);
    }
}
_a = MockMarkdownRenderer;
MockMarkdownRenderer.renderMarkdown = vi.fn(async (markdown, el, sourcePath, component) => {
    if (!component.app) {
        throw new Error('Component must have an app property');
    }
    await _a.render(component.app, markdown, el, sourcePath, component);
});
MockMarkdownRenderer.render = vi.fn(async (app, markdown, el, sourcePath, component) => {
    // Mock simple : convertit le markdown en HTML basique
    el.innerHTML = markdown
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');
});
