export function createHeadingCache(heading, level, position) {
    return {
        heading,
        level,
        position
    };
}
export function createHeadingSubpathResult(current, next, start, end) {
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
