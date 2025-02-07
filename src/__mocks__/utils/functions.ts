import { vi } from 'vitest';
import type { CachedMetadata, FrontMatterInfo, IconName, HeadingSubpathResult, BlockSubpathResult, FootnoteSubpathResult } from 'obsidian';

export const htmlToMarkdown = vi.fn();
export const markdownToHtml = vi.fn();
export const stringifyYaml = vi.fn(_obj => '');
export const parseYaml = vi.fn(_yaml => ({}));
export const moment = {
    locale: vi.fn()
};
export const requestUrl = vi.fn().mockResolvedValue({
    status: 200,
    text: '',
    json: {},
    arrayBuffer: new ArrayBuffer(0)
});

export const getAllTags = vi.fn((cache: CachedMetadata): string[] | null => {
    const frontmatterTags = cache.frontmatter?.tags || [];
    const inlineTags = cache.tags?.map(t => t.tag) || [];
    return [...new Set([...frontmatterTags, ...inlineTags])];
});

export const getBlobArrayBuffer = vi.fn(async (blob: Blob): Promise<ArrayBuffer> => {
    return blob.arrayBuffer();
});

export const getFrontMatterInfo = vi.fn((content: string): FrontMatterInfo => {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
        return {
            exists: false,
            frontmatter: '',
            from: 0,
            to: 0,
            contentStart: 0
        };
    }

    return {
        exists: true,
        frontmatter: match[1],
        from: 4,
        to: 4 + match[1].length,
        contentStart: match[0].length + 1
    };
});

const mockIcons = new Map<string, SVGSVGElement>();

export const getIcon = vi.fn((iconId: string): SVGSVGElement | null => {
    return mockIcons.get(iconId) || null;
});

export const getIconIds = vi.fn((): IconName[] => {
    return Array.from(mockIcons.keys()) as IconName[];
});

export const getLinkpath = vi.fn((linktext: string): string => {
    // Remove aliases and subpaths
    const parts = linktext.split('|')[0].split('#')[0];
    // Clean special characters
    return parts.replace(/[\\/:*?"<>|]/g, '');
});

export const hexToArrayBuffer = vi.fn((hex: string): ArrayBuffer => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
});

export const loadMathJax = vi.fn().mockResolvedValue(undefined);

export const loadMermaid = vi.fn().mockResolvedValue({
    initialize: vi.fn(),
    render: vi.fn()
});

export const loadPdfJs = vi.fn().mockResolvedValue({
    getDocument: vi.fn()
});

export const loadPrism = vi.fn().mockResolvedValue({
    highlightAll: vi.fn(),
    highlight: vi.fn()
});

export const Keymap = {
    isModifier: vi.fn((_evt: MouseEvent | TouchEvent | KeyboardEvent, _modifier: string): boolean => {
        return false;
    }),
    isModEvent: vi.fn((_evt?: any): string | boolean => {
        if (!_evt) return false;
        if (_evt.ctrlKey || _evt.metaKey) return 'tab';
        if (_evt instanceof MouseEvent && _evt.button === 1) return 'tab';
        return false;
    })
};

export const requireApiVersion = vi.fn((version: string): boolean => {
    // Simulated current version of Obsidian
    const currentVersion = '1.4.0'; 
    
    // Compare versions
    const current = currentVersion.split('.').map(Number);
    const required = version.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (current[i] > required[i]) return true;
        if (current[i] < required[i]) return false;
    }
    
    return true;
});

export const resolveSubpath = vi.fn((cache: CachedMetadata, subpath: string): HeadingSubpathResult | BlockSubpathResult | FootnoteSubpathResult | null => {
    if (!subpath) return null;

    // Handle headers
    if (subpath.startsWith('^')) {
        const blockId = subpath.slice(1);
        const block = cache.blocks?.[blockId];
        if (block) {
            return {
                type: 'block',
                block,
                start: block.position.start,
                end: block.position.end
            } as BlockSubpathResult;
        }
    }

    // Handle footnotes
    if (subpath.startsWith('#^')) {
        const footnoteId = subpath.slice(2);
        const footnote = cache.footnotes?.find(f => f.id === footnoteId);
        if (footnote) {
            return {
                type: 'footnote',
                footnote,
                start: footnote.position.start,
                end: footnote.position.end
            } as FootnoteSubpathResult;
        }
    }

    // Handle headings
    if (subpath.startsWith('#')) {
        const headingText = subpath.slice(1);
        const heading = cache.headings?.find(h => h.heading === headingText);
        if (heading) {
            const nextHeading = cache.headings?.find(h => 
                h.position.start.line > heading.position.start.line && 
                h.level <= heading.level
            );
            
            return {
                type: 'heading',
                current: heading,
                next: nextHeading || null,
                start: heading.position.start,
                end: nextHeading ? nextHeading.position.start : heading.position.end
            } as HeadingSubpathResult;
        }
    }

    return null;
});

export const sanitizeHTMLToDom = vi.fn((html: string): DocumentFragment => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    
    // Clean basic HTML
    const sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Remove styles
        .replace(/on\w+="[^"]*"/g, '')  // Remove inline event handlers
        .replace(/javascript:[^\s"']+/g, ''); // Remove javascript: links
    
    div.innerHTML = sanitized;
    
    // Copy cleaned nodes to fragment
    while (div.firstChild) {
        fragment.appendChild(div.firstChild);
    }
    
    return fragment;
});
// ... 