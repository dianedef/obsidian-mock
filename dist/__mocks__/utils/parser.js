import { vi } from 'vitest';
export const parseLinktext = vi.fn((linktext) => {
    // Handle links with aliases (format: [[path|alias]])
    const pipeSplit = linktext.split('|')[0];
    // Split path and subpath (format: path#subpath)
    const [path, ...subpathParts] = pipeSplit.split('#');
    const subpath = subpathParts.join('#');
    return {
        path: path.trim(),
        subpath: subpath.trim()
    };
});
export const parseYaml = vi.fn((yaml) => {
    try {
        // Simple implementation for tests
        const result = {};
        const lines = yaml.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#'))
                continue;
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex === -1)
                continue;
            const key = trimmedLine.slice(0, colonIndex).trim();
            let value = trimmedLine.slice(colonIndex + 1).trim();
            // Basic list handling
            if (value.startsWith('-')) {
                value = value.slice(1).trim();
                if (!result[key])
                    result[key] = [];
                result[key].push(value);
            }
            else {
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                result[key] = value;
            }
        }
        return result;
    }
    catch (e) {
        console.error('Error parsing YAML:', e);
        return {};
    }
});
