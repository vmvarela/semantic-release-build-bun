import { z } from 'zod';
import type { PluginContext, Artifact, PrepareResult } from './types.js';
export type { PluginContext, Artifact, PrepareResult };
export declare abstract class BasePlugin {
    abstract readonly name: string;
    verifyConditions<T>(config: unknown, schema: z.ZodSchema<T>, _context: PluginContext): Promise<T>;
    prepare<T>(_config: T, _context: PluginContext): Promise<PrepareResult>;
    publish<T>(_config: T, _context: PluginContext): Promise<void>;
    protected validateConfig<T>(schema: z.ZodSchema<T>, config: unknown): T;
    /**
     * Discover files matching one or more glob patterns inside a directory.
     * Each pattern can be a filename (exact match) or a simple glob.
     */
    protected getArtifacts(dir: string, patterns: string[]): Artifact[];
    /**
     * Compute SHA-256 checksums for a list of files.
     * Returns a Map<filename, hex-digest>.
     */
    protected computeChecksums(files: string[]): Map<string, string>;
    /**
     * Run a shell command.
     */
    protected exec(command: string, argsOrOpts?: string[] | Record<string, unknown>, opts?: Record<string, unknown>): Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
    }>;
    /**
     * Render a Handlebars template file.
     */
    protected renderTemplate(path: string, data: Record<string, unknown>): string;
    /**
     * Get an environment variable, optionally required.
     */
    protected getEnv(key: string, required?: boolean): string | undefined;
    /**
     * Assert multiple required environment variables are set.
     */
    protected assertRequiredEnvs(keys: string[]): void;
    /**
     * Log a message via the semantic-release logger.
     */
    protected log(context: PluginContext, message: string): void;
    /**
     * Log an error via the semantic-release logger.
     */
    protected logError(context: PluginContext, message: string): void;
}
//# sourceMappingURL=base-plugin.d.ts.map