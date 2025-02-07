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
    ownerSVGElement: SVGElement | null = null;
    viewportElement: SVGElement | null = null;
    
    addClass = vi.fn((cls: string) => {
        this.classList.add(cls);
        return this;
    });
    
    removeClass = vi.fn((cls: string) => {
        this.classList.remove(cls);
        return this;
    });
    
    toggleClass = vi.fn((cls: string, value?: boolean) => {
        if (value !== undefined) {
            this.classList.toggle(cls, value);
        } else {
            this.classList.toggle(cls);
        }
        return this;
    });
    
    hasClass = vi.fn((cls: string) => {
        return this.classList.contains(cls);
    });
    
    setAttribute = vi.fn((name: string, value: string) => {
        super.setAttribute(name, value);
        return this;
    });
    
    getAttribute = vi.fn((name: string) => {
        return super.getAttribute(name);
    });
    
    removeAttribute = vi.fn((name: string) => {
        super.removeAttribute(name);
        return this;
    });

    setAttrs = vi.fn((attrs: { [key: string]: string | number | boolean | null }) => {
        Object.entries(attrs).forEach(([key, value]) => {
            if (value === null) {
                this.removeAttribute(key);
            } else {
                this.setAttribute(key, value.toString());
            }
        });
        return this;
    });

    empty = vi.fn(() => {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        return this;
    });
}

// Mock document methods
document.createElementNS = vi.fn((_namespaceURI: string | null, _qualifiedName: string): SVGElement => {
    const element = document.createElement('svg') as unknown as SVGElement;
    Object.defineProperties(element, {
        ownerSVGElement: { value: element, writable: true },
        viewportElement: { value: element, writable: true }
    });
    return element;
}); 