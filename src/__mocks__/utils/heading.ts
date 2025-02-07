import type { HeadingCache, HeadingSubpathResult, Pos, Loc } from 'obsidian';

export function createHeadingCache(heading: string, level: number, position: Pos): HeadingCache {
    return {
        heading,
        level,
        position
    };
}

export function createHeadingSubpathResult(
    current: HeadingCache,
    next: HeadingCache,
    start: Loc,
    end: Loc
): HeadingSubpathResult {
    return {
        type: 'heading',
        current,
        next,
        start: {
            line: start.line,
            col: start.col,
            offset: start.offset
        },
        end: {
            line: end.line,
            col: end.col,
            offset: end.offset
        }
    };
} 