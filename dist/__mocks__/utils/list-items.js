import { vi } from 'vitest';
export function createListItemCache(id, task, parent, position) {
    return {
        id,
        task,
        parent,
        position
    };
}
export function iterateListItems(items, callback) {
    for (const item of items) {
        if (callback(item) === true) {
            return true;
        }
    }
    return false;
}
export const getListItemsInRange = vi.fn((items, startLine, endLine) => {
    return items.filter(item => item.position.start.line >= startLine &&
        item.position.start.line <= endLine);
});
