export function prepareQuery(query) {
    return query.toLowerCase().split(/\s+/g);
}
export function fuzzySearch(query, text) {
    const queryParts = prepareQuery(query);
    const textLower = text.toLowerCase();
    return queryParts.every(part => textLower.includes(part));
}
export function sortSearchResults(results) {
    return results.sort((a, b) => {
        // Mock simple sort by score
        return (b.score || 0) - (a.score || 0);
    });
}
