import { vi } from 'vitest';
import type { MarkdownPostProcessor, MarkdownPostProcessorContext as IMarkdownPostProcessorContext, MarkdownRenderChild, MarkdownSectionInformation } from 'obsidian';

export class MarkdownPostProcessorContext implements IMarkdownPostProcessorContext {
    docId: string;
    sourcePath: string;
    frontmatter: any | null | undefined;
    private children: MarkdownRenderChild[] = [];

    constructor(docId: string, sourcePath: string, frontmatter?: any) {
        this.docId = docId;
        this.sourcePath = sourcePath;
        this.frontmatter = frontmatter;
    }

    addChild(child: MarkdownRenderChild): void {
        this.children.push(child);
        if (child.load) {
            child.load();
        }
    }

    getSectionInfo(el: HTMLElement): MarkdownSectionInformation | null {
        return {
            text: el.textContent || '',
            lineStart: 0,
            lineEnd: 0
        };
    }
}

export function createMarkdownPostProcessor(
    processor: (el: HTMLElement, ctx: IMarkdownPostProcessorContext) => Promise<any> | void,
    sortOrder: number = 0
): MarkdownPostProcessor {
    const postProcessor: MarkdownPostProcessor = processor;
    postProcessor.sortOrder = sortOrder;
    return postProcessor;
}

export const registerMarkdownPostProcessor = vi.fn(
    (processor: MarkdownPostProcessor): void => {
        // Registration mock
    }
); 