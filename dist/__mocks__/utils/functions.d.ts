import type { CachedMetadata, FrontMatterInfo, HeadingSubpathResult, BlockSubpathResult, FootnoteSubpathResult } from 'obsidian';
export declare const htmlToMarkdown: import("vitest/dist").Mock<any, any>;
export declare const markdownToHtml: import("vitest/dist").Mock<any, any>;
export declare const stringifyYaml: import("vitest/dist").Mock<[_obj: any], string>;
export declare const parseYaml: import("vitest/dist").Mock<[_yaml: any], {}>;
export declare const moment: {
    locale: import("vitest/dist").Mock<any, any>;
};
export declare const requestUrl: import("vitest/dist").Mock<any, any>;
export declare const getAllTags: import("vitest/dist").Mock<[cache: CachedMetadata], string[] | null>;
export declare const getBlobArrayBuffer: import("vitest/dist").Mock<[blob: Blob], Promise<ArrayBuffer>>;
export declare const getFrontMatterInfo: import("vitest/dist").Mock<[content: string], FrontMatterInfo>;
export declare const getIcon: import("vitest/dist").Mock<[iconId: string], SVGSVGElement | null>;
export declare const getIconIds: import("vitest/dist").Mock<[], string[]>;
export declare const getLinkpath: import("vitest/dist").Mock<[linktext: string], string>;
export declare const hexToArrayBuffer: import("vitest/dist").Mock<[hex: string], ArrayBuffer>;
export declare const loadMathJax: import("vitest/dist").Mock<any, any>;
export declare const loadMermaid: import("vitest/dist").Mock<any, any>;
export declare const loadPdfJs: import("vitest/dist").Mock<any, any>;
export declare const loadPrism: import("vitest/dist").Mock<any, any>;
export declare const Keymap: {
    isModifier: import("vitest/dist").Mock<[_evt: MouseEvent | TouchEvent | KeyboardEvent, _modifier: string], boolean>;
    isModEvent: import("vitest/dist").Mock<[_evt?: any], string | boolean>;
};
export declare const requireApiVersion: import("vitest/dist").Mock<[version: string], boolean>;
export declare const resolveSubpath: import("vitest/dist").Mock<[cache: CachedMetadata, subpath: string], HeadingSubpathResult | BlockSubpathResult | FootnoteSubpathResult | null>;
export declare const sanitizeHTMLToDom: import("vitest/dist").Mock<[html: string], DocumentFragment>;
