/**
 * Render a template file with the given data.
 * Template syntax: {{variable}}, {{#if}} {{#each}} helpers.
 */
export declare function renderFile(templatePath: string, data: Record<string, unknown>): string;
/**
 * Render a template string directly.
 */
export declare function renderString(templateSource: string, data: Record<string, unknown>): string;
//# sourceMappingURL=template.d.ts.map