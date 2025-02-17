import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Events } from '../__mocks__/components/events';
import type { MarkdownPostProcessor, MarkdownPostProcessorContext } from 'obsidian';

class Publish extends Events {
    private currentFile: string = '';
    private postProcessors: MarkdownPostProcessor[] = [];

    get currentFilepath(): string {
        return this.currentFile;
    }

    registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): MarkdownPostProcessor {
        if (typeof sortOrder === 'number') {
            postProcessor.sortOrder = sortOrder;
        }
        this.postProcessors.push(postProcessor);
        this.postProcessors.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return postProcessor;
    }

    registerMarkdownCodeBlockProcessor(
        language: string,
        handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void,
        sortOrder?: number
    ): MarkdownPostProcessor {
        const processor: MarkdownPostProcessor = async (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
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
    let publish: Publish;

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
            const processor: MarkdownPostProcessor = async () => {};
            const registeredProcessor = publish.registerMarkdownPostProcessor(processor);
            expect(registeredProcessor).toBe(processor);
        });

        it('should register a post processor with sort order', () => {
            const processor: MarkdownPostProcessor = async () => {};
            const registeredProcessor = publish.registerMarkdownPostProcessor(processor, 100);
            expect(registeredProcessor.sortOrder).toBe(100);
        });

        it('should register a code block processor', async () => {
            const handler = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
                el.textContent = source;
            };
            const processor = publish.registerMarkdownCodeBlockProcessor('test', handler);
            
            // Simulate a code block
            const el = document.createElement('div');
            const pre = el.appendChild(document.createElement('pre'));
            const code = pre.appendChild(document.createElement('code'));
            code.classList.add('language-test');
            code.textContent = 'test content';

            // Test the processor
            await processor(el, {
                docId: 'test',
                sourcePath: 'test.md',
                frontmatter: null,
                addChild: () => {},
                getSectionInfo: () => null
            });

            // Verify that the pre has been replaced by a div with the content
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
