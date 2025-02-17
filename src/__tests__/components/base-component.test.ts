import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
    BaseComponent,
    arrayBufferToBase64,
    arrayBufferToHex,
    base64ToArrayBuffer
} from '../../__mocks__/components/base-component';

describe('Utility Functions', () => {
    describe('arrayBufferToBase64', () => {
        it('should correctly convert an ArrayBuffer to Base64', () => {
            const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // "Hello" in ASCII
            const result = arrayBufferToBase64(buffer);
            expect(result).toBe('SGVsbG8='); // "Hello" in Base64
        });
    });

    describe('arrayBufferToHex', () => {
        it('should correctly convert an ArrayBuffer to hexadecimal', () => {
            const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // "Hello" in ASCII
            const result = arrayBufferToHex(buffer);
            expect(result).toBe('48656c6c6f'); // "Hello" in hexadecimal
        });
    });

    describe('base64ToArrayBuffer', () => {
        it('should correctly convert a Base64 string to ArrayBuffer', () => {
            const base64 = 'SGVsbG8='; // "Hello" in Base64
            const result = base64ToArrayBuffer(base64);
            const bytes = new Uint8Array(result);
            expect(Array.from(bytes)).toEqual([72, 101, 108, 108, 111]); // "Hello" in ASCII
        });
    });
});

describe('BaseComponent', () => {
    let component: BaseComponent;

    beforeEach(() => {
        component = new BaseComponent();
    });

    describe('Constructor', () => {
        it('should initialize with disabled set to false', () => {
            expect(component.isDisabled()).toBe(false);
        });
    });

    describe('setDisabled', () => {
        it('should update the disabled property', () => {
            component.setDisabled(true);
            expect(component.isDisabled()).toBe(true);

            component.setDisabled(false);
            expect(component.isDisabled()).toBe(false);
        });

        it('should return this for chaining', () => {
            const result = component.setDisabled(true);
            expect(result).toBe(component);
        });
    });

    describe('then', () => {
        it('should execute the callback with the component', () => {
            let called = false;
            let passedComponent: BaseComponent | null = null;

            component.then((comp) => {
                called = true;
                passedComponent = comp;
            });

            expect(called).toBe(true);
            expect(passedComponent).toBe(component);
        });

        it('should return this for chaining', () => {
            const result = component.then(() => {});
            expect(result).toBe(component);
        });

        it('should allow chaining with other methods', () => {
            let called = false;
            
            component
                .setDisabled(true)
                .then(() => {
                    called = true;
                })
                .setDisabled(false);

            expect(called).toBe(true);
            expect(component.isDisabled()).toBe(false);
        });
    });

    describe('Event Management', () => {
        it('should be able to register and trigger events', () => {
            let called = false;
            const handler = () => { called = true; };

            component.on('test', handler);
            component.trigger('test');

            expect(called).toBe(true);
        });

        it('should be able to remove event handlers', () => {
            let count = 0;
            const handler = () => { count++; };

            component.on('test', handler);
            component.trigger('test');
            component.off('test', handler);
            component.trigger('test');

            expect(count).toBe(1);
        });

        it('should be able to register events once', () => {
            let count = 0;
            const handler = () => { count++; };

            component.once('test', handler);
            component.trigger('test');
            component.trigger('test');

            expect(count).toBe(1);
        });

        it('should transmit arguments to handlers', () => {
            let receivedArgs: any[] = [];
            const handler = (...args: any[]) => { receivedArgs = args; };

            component.on('test', handler);
            component.trigger('test', 1, 'string', { obj: true });

            expect(receivedArgs).toEqual([1, 'string', { obj: true }]);
        });
    });

    describe('DOM Management', () => {
        it('should be able to create elements with attributes', () => {
            const el = component.createEl('div', {
                cls: ['class1', 'class2'],
                attr: { 'data-test': 'value' },
                text: 'Test content'
            });

            expect(el.classList.contains('class1')).toBe(true);
            expect(el.classList.contains('class2')).toBe(true);
            expect(el.getAttribute('data-test')).toBe('value');
            expect(el.textContent).toBe('Test content');
        });

        it('should be able to manipulate CSS classes', () => {
            const el = component.createEl('div');
            
            component.toggleClass(el, 'test-class', true);
            expect(el.classList.contains('test-class')).toBe(true);
            
            component.toggleClass(el, 'test-class', false);
            expect(el.classList.contains('test-class')).toBe(false);
        });

        it('should be able to manage styles', () => {
            const el = component.createEl('div');
            
            component.setStyle(el, {
                backgroundColor: 'red',
                fontSize: '16px',
                display: 'flex'
            });

            expect(el.style.backgroundColor).toBe('red');
            expect(el.style.fontSize).toBe('16px');
            expect(el.style.display).toBe('flex');
        });

        it('should be able to manipulate the element hierarchy', () => {
            const parent = component.createEl('div');
            const child1 = component.createEl('span');
            const child2 = component.createEl('span');

            component.appendChildren(parent, [child1, child2]);
            expect(parent.children.length).toBe(2);
            expect(parent.contains(child1)).toBe(true);
            expect(parent.contains(child2)).toBe(true);
        });
    });

    describe('Lifecycle Management', () => {
        it('should call onload during initialization', () => {
            let called = false;
            class TestComponent extends BaseComponent {
                onload() {
                    called = true;
                }
            }

            const test = new TestComponent();
            test.load();
            expect(called).toBe(true);
        });

        it('should call onunload during destruction', () => {
            let called = false;
            class TestComponent extends BaseComponent {
                onunload() {
                    called = true;
                }
            }

            const test = new TestComponent();
            test.load();  // Charger d'abord
            test.unload();
            expect(called).toBe(true);
        });

        it('should clean up events during destruction', () => {
            let called = false;
            const handler = () => { called = true; };

            component.on('test', handler);
            component.unload();
            component.trigger('test');

            expect(called).toBe(false);
        });

        it('should clean up DOM elements during destruction', () => {
            const parent = document.createElement('div');
            const el = component.createEl('div');
            parent.appendChild(el);

            component.load();  // Charger d'abord
            component.unload();
            expect(parent.contains(el)).toBe(false);
        });
    });

    describe('Resource Management', () => {
        it('should be able to register resources to clean up', () => {
            let cleaned = false;
            component.register(() => {
                cleaned = true;
            });

            component.unload();
            expect(cleaned).toBe(true);
        });

        it('should be able to register DOM events', () => {
            let called = false;
            const el = document.createElement('div');
            const handler = () => { called = true; };

            component.registerDomEvent(el, 'click', handler);
            el.click();
            expect(called).toBe(true);

            component.unload();
            el.click();
            expect(called).toBe(true); // Le gestionnaire n'est pas réinitialisé
        });

        it('should be able to register intervals', () => {
            vi.useFakeTimers();
            let count = 0;
            component.registerInterval(() => {
                count++;
            }, 1000);

            // Avancer le temps de 3 secondes
            for (let i = 0; i < 3; i++) {
                vi.advanceTimersByTime(1000);
            }
            expect(count).toBe(3);

            // Nettoyer après le test
            vi.useRealTimers();
        });
    });
}); 