import type { Reference } from 'obsidian';

export function createReference(options: Partial<Reference> = {}): Reference {
    return {
        link: options.link || '',
        original: options.original || options.link || '',
        displayText: options.displayText
    };
} 