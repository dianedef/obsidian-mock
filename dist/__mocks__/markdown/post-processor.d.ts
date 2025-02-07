import type { MarkdownPostProcessor, MarkdownPostProcessorContext as IMarkdownPostProcessorContext, MarkdownRenderChild, MarkdownSectionInformation } from 'obsidian';
export declare class MarkdownPostProcessorContext implements IMarkdownPostProcessorContext {
    docId: string;
    sourcePath: string;
    frontmatter: any | null | undefined;
    private children;
    constructor(docId: string, sourcePath: string, frontmatter?: any);
    addChild(child: MarkdownRenderChild): void;
    getSectionInfo(el: HTMLElement): MarkdownSectionInformation | null;
}
export declare function createMarkdownPostProcessor(processor: (el: HTMLElement, ctx: IMarkdownPostProcessorContext) => Promise<any> | void, sortOrder?: number): MarkdownPostProcessor;
export declare const registerMarkdownPostProcessor: import("vitest/dist").Mock<[processor: MarkdownPostProcessor], void>;
