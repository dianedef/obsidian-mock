/**
 * Prepares headings for links by removing certain special character combinations that could break links.
 * @public
 */
export function stripHeadingForLink(heading) {
    return heading
        // Remove special characters that could break links
        .replace(/[\[\]#|^]/g, '')
        // Replace multiple spaces with a single space
        .replace(/\s+/g, ' ')
        // Remove spaces at the beginning and end
        .trim();
}
/**
 * Normalizes headings for link matching by removing special characters
 * and reducing consecutive spaces.
 * @public
 */
export function stripHeading(heading) {
    return heading
        .toLowerCase()
        // Remove special characters
        .replace(/[^a-z0-9\s]/g, '')
        // Replace multiple spaces with a single space
        .replace(/\s+/g, ' ')
        // Remove spaces at the beginning and end
        .trim();
}
/**
 * Converts an object to YAML string
 * @public
 */
export function stringifyYaml(obj) {
    if (obj === null || obj === undefined)
        return '';
    const convertValue = (value) => {
        if (Array.isArray(value)) {
            return value.map(item => `\n  - ${convertValue(item)}`).join('');
        }
        if (typeof value === 'object' && value !== null) {
            return '\n' + stringifyYaml(value).split('\n').map(line => '  ' + line).join('\n');
        }
        if (typeof value === 'string') {
            // Escape special characters if needed
            if (value.includes('\n') || value.includes('"') || value.includes("'") || value.includes(':')) {
                return `"${value.replace(/"/g, '\\"')}"`;
            }
            return value;
        }
        return String(value);
    };
    return Object.entries(obj)
        .map(([key, value]) => {
        if (value === null || value === undefined)
            return '';
        if (Array.isArray(value) && value.length === 0)
            return `${key}: []`;
        if (typeof value === 'object' && Object.keys(value).length === 0)
            return `${key}: {}`;
        return `${key}:${convertValue(value)}`;
    })
        .filter(line => line)
        .join('\n');
}
