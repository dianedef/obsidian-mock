import { vi } from 'vitest';

export const parseFrontMatterAliases = vi.fn((frontmatter: any | null): string[] | null => {
    if (!frontmatter) return null;

    const aliases = frontmatter.aliases || frontmatter.alias;
    if (!aliases) return null;

    if (typeof aliases === 'string') {
        return [aliases];
    }

    if (Array.isArray(aliases)) {
        return aliases.filter(alias => typeof alias === 'string');
    }

    return null;
});

export const parseFrontMatterEntry = vi.fn((frontmatter: any | null, key: string | RegExp): any | null => {
    if (!frontmatter) return null;

    if (key instanceof RegExp) {
        for (const [k, v] of Object.entries(frontmatter)) {
            if (key.test(k)) {
                return v;
            }
        }
        return null;
    }

    return frontmatter[key] ?? null;
});

export const parseFrontMatterStringArray = vi.fn((
    frontmatter: any | null,
    key: string | RegExp,
    nospaces: boolean = false
): string[] | null => {
    const value = parseFrontMatterEntry(frontmatter, key);
    if (!value) return null;

    if (typeof value === 'string') {
        const items = value.split(',').map(item => item.trim());
        return nospaces ? items.map(item => item.replace(/\s+/g, '-')) : items;
    }

    if (Array.isArray(value)) {
        const items = value.filter(item => typeof item === 'string').map(item => item.trim());
        return nospaces ? items.map(item => item.replace(/\s+/g, '-')) : items;
    }

    return null;
});

export const parseFrontMatterTags = vi.fn((frontmatter: any | null): string[] | null => {
    if (!frontmatter) return null;

    const tags = frontmatter.tags || frontmatter.tag;
    if (!tags) return null;

    if (typeof tags === 'string') {
        return tags.split(/[,\s]+/).filter(tag => tag.length > 0);
    }

    if (Array.isArray(tags)) {
        return tags.filter(tag => typeof tag === 'string' && tag.length > 0);
    }

    return null;
}); 