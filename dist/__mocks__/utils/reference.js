export function createReference(options = {}) {
    return {
        link: options.link || '',
        original: options.original || options.link || '',
        displayText: options.displayText
    };
}
