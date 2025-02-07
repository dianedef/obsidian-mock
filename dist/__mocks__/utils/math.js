import { vi } from 'vitest';
export const renderMath = vi.fn((source, display) => {
    const container = document.createElement('div');
    container.addClass(display ? 'math-block' : 'math-inline');
    const mathEl = document.createElement('span');
    mathEl.addClass('math');
    mathEl.textContent = source;
    container.appendChild(mathEl);
    return container;
});
