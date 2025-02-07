import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Events } from '../__mocks__/components/events';
class Publish extends Events {
    constructor() {
        super(...arguments);
        this.currentFile = '';
        this.postProcessors = [];
    }
    get currentFilepath() {
        return this.currentFile;
    }
    registerMarkdownPostProcessor(postProcessor, sortOrder) {
        if (typeof sortOrder === 'number') {
            postProcessor.sortOrder = sortOrder;
        }
        this.postProcessors.push(postProcessor);
        this.postProcessors.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return postProcessor;
    }
    registerMarkdownCodeBlockProcessor(language, handler, sortOrder) {
        const processor = async (el, ctx) => {
            const pre = el.querySelector('pre');
            const code = pre?.querySelector('code');
            if (code?.classList.contains(`language-${language}`)) {
                const source = code.textContent || '';
                const wrapper = document.createElement('div');
                el.appendChild(wrapper);
                pre?.remove();
                await handler(source, wrapper, ctx);
            }
        };
        return this.registerMarkdownPostProcessor(processor, sortOrder);
    }
}
describe('Publish', () => {
    let publish;
    beforeEach(() => {
        publish = new Publish();
    });
    describe('Initialization', () => {
        it('should be initialized with empty state', () => {
            expect(publish.currentFilepath).toBe('');
        });
    });
    describe('Post Processor Registration', () => {
        it('should register a markdown post processor', () => {
            const processor = async () => { };
            const registeredProcessor = publish.registerMarkdownPostProcessor(processor);
            expect(registeredProcessor).toBe(processor);
        });
        it('should register a post processor with sort order', () => {
            const processor = async () => { };
            const registeredProcessor = publish.registerMarkdownPostProcessor(processor, 100);
            expect(registeredProcessor.sortOrder).toBe(100);
        });
        it('should register a code block processor', async () => {
            const handler = async (source, el, ctx) => {
                el.textContent = source;
            };
            const processor = publish.registerMarkdownCodeBlockProcessor('test', handler);
            // Simuler un bloc de code
            const el = document.createElement('div');
            const pre = el.appendChild(document.createElement('pre'));
            const code = pre.appendChild(document.createElement('code'));
            code.classList.add('language-test');
            code.textContent = 'test content';
            // Tester le processeur
            await processor(el, {
                docId: 'test',
                sourcePath: 'test.md',
                frontmatter: null,
                addChild: () => { },
                getSectionInfo: () => null
            });
            // Vérifier que le pre a été remplacé par un div avec le contenu
            expect(el.querySelector('pre')).toBeNull();
            const wrapper = el.querySelector('div');
            expect(wrapper).not.toBeNull();
            if (wrapper) {
                expect(wrapper.textContent).toBe('test content');
            }
        });
    });
    describe('Event Handling', () => {
        it('should handle navigation events', () => {
            const callback = vi.fn();
            publish.on('navigated', callback);
            publish.trigger('navigated');
            expect(callback).toHaveBeenCalled();
        });
    });
});
