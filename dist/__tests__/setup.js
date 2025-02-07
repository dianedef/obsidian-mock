import '../__mocks__/utils/dom';
import { vi } from 'vitest';
// Mock des méthodes globales du DOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
// Mock des méthodes de sélection
document.getSelection = vi.fn().mockReturnValue({
    removeAllRanges: vi.fn(),
    addRange: vi.fn(),
    getRangeAt: vi.fn(),
    toString: vi.fn(),
});
// Mock SVGElement methods
class SVGElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.addClass = vi.fn();
        this.removeClass = vi.fn();
        this.toggleClass = vi.fn();
        this.hasClass = vi.fn();
        this.setAttribute = vi.fn();
        this.getAttribute = vi.fn();
        this.removeAttribute = vi.fn();
    }
}
// Mock document methods
document.createElementNS = vi.fn((namespaceURI, qualifiedName) => {
    return new SVGElement();
});
