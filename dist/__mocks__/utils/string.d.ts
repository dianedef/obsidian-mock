/**
 * Prepares headings for links by removing certain special character combinations that could break links.
 * @public
 */
export declare function stripHeadingForLink(heading: string): string;
/**
 * Normalizes headings for link matching by removing special characters
 * and reducing consecutive spaces.
 * @public
 */
export declare function stripHeading(heading: string): string;
/**
 * Converts an object to YAML string
 * @public
 */
export declare function stringifyYaml(obj: any): string;
