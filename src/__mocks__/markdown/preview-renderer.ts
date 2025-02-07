import { vi } from 'vitest';
import type { MarkdownPostProcessor, MarkdownPostProcessorContext as IMarkdownPostProcessorContext } from 'obsidian';

export class MarkdownPreviewRenderer {
    private static postProcessors: Array<{ processor: MarkdownPostProcessor; sortOrder: number }> = [];

    static registerPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder: number = 0): void {
        this.postProcessors.push({ processor: postProcessor, sortOrder });
        this.postProcessors.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    static unregisterPostProcessor(postProcessor: MarkdownPostProcessor): void {
        const index = this.postProcessors.findIndex(p => p.processor === postProcessor);
        if (index > -1) {
            this.postProcessors.splice(index, 1);
        }
    }

    static createCodeBlockPostProcessor(
        language: string,
        handler: (source: string, el: HTMLElement, ctx: IMarkdownPostProcessorContext) => Promise<any> | void
    ): (el: HTMLElement, ctx: IMarkdownPostProcessorContext) => void {
        return (el: HTMLElement, ctx: IMarkdownPostProcessorContext) => {
            const pre = el.querySelector('pre');
            const code = pre?.querySelector(`code.language-${language}`);
            if (code) {
                const source = code.textContent || '';
                handler(source, el, ctx);
            }
        };
    }

    static async processMarkdown(el: HTMLElement, ctx: IMarkdownPostProcessorContext): Promise<void> {
        for (const { processor } of this.postProcessors) {
            await processor(el, ctx);
        }
    }
} 