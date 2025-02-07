import type { HeadingCache, HeadingSubpathResult, Pos, Loc } from 'obsidian';
export declare function createHeadingCache(heading: string, level: number, position: Pos): HeadingCache;
export declare function createHeadingSubpathResult(current: HeadingCache, next: HeadingCache, start: Loc, end: Loc): HeadingSubpathResult;
