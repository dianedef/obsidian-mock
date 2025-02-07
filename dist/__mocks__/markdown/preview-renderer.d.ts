import type { MarkdownPostProcessor, MarkdownPostProcessorContext as IMarkdownPostProcessorContext } from 'obsidian';
export declare class MarkdownPreviewRenderer {
    private static postProcessors;
    static registerPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): void;
    static unregisterPostProcessor(postProcessor: MarkdownPostProcessor): void;
    static createCodeBlockPostProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: IMarkdownPostProcessorContext) => Promise<any> | void): (el: HTMLElement, ctx: IMarkdownPostProcessorContext) => void;
    static processMarkdown(el: HTMLElement, ctx: IMarkdownPostProcessorContext): Promise<void>;
}
