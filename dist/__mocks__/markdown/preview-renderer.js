export class MarkdownPreviewRenderer {
    static registerPostProcessor(postProcessor, sortOrder = 0) {
        this.postProcessors.push({ processor: postProcessor, sortOrder });
        this.postProcessors.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    static unregisterPostProcessor(postProcessor) {
        const index = this.postProcessors.findIndex(p => p.processor === postProcessor);
        if (index > -1) {
            this.postProcessors.splice(index, 1);
        }
    }
    static createCodeBlockPostProcessor(language, handler) {
        return (el, ctx) => {
            const pre = el.querySelector('pre');
            const code = pre?.querySelector(`code.language-${language}`);
            if (code) {
                const source = code.textContent || '';
                handler(source, el, ctx);
            }
        };
    }
    static async processMarkdown(el, ctx) {
        for (const { processor } of this.postProcessors) {
            await processor(el, ctx);
        }
    }
}
MarkdownPreviewRenderer.postProcessors = [];
