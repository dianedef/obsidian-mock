import { vi } from 'vitest';
export class MarkdownPostProcessorContext {
    constructor(docId, sourcePath, frontmatter) {
        this.children = [];
        this.docId = docId;
        this.sourcePath = sourcePath;
        this.frontmatter = frontmatter;
    }
    addChild(child) {
        this.children.push(child);
        if (child.load) {
            child.load();
        }
    }
    getSectionInfo(el) {
        return {
            text: el.textContent || '',
            lineStart: 0,
            lineEnd: 0
        };
    }
}
export function createMarkdownPostProcessor(processor, sortOrder = 0) {
    const postProcessor = processor;
    postProcessor.sortOrder = sortOrder;
    return postProcessor;
}
export const registerMarkdownPostProcessor = vi.fn((processor) => {
    // Registration mock
});
