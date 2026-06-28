import { readdirSync, statSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { exec as execCmd } from './exec.js';
export class BasePlugin {
    // ─── Lifecycle hooks ──────────────────────────────────────────────
    async verifyConditions(config, schema, _context) {
        return schema.parse(config);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async prepare(_config, _context) {
        throw new Error(`${this.name}: prepare not implemented`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async publish(_config, _context) {
        // no-op default
    }
    // ─── Shared utilities ──────────────────────────────────────────────
    validateConfig(schema, config) {
        return schema.parse(config);
    }
    /**
     * Discover files matching one or more glob patterns inside a directory.
     * Each pattern can be a filename (exact match) or a simple glob.
     */
    getArtifacts(dir, patterns) {
        const files = [];
        for (const pattern of patterns) {
            // simple glob: * matches anything
            const regex = new RegExp('^' + pattern.replace(/\//g, '\\/').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$');
            for (const entry of readdirSync(resolve(dir))) {
                const full = resolve(dir, entry);
                if (statSync(full).isFile() && regex.test(entry)) {
                    files.push({ path: full, name: entry, type: 'binary' });
                }
            }
        }
        return files;
    }
    /**
     * Compute SHA-256 checksums for a list of files.
     * Returns a Map<filename, hex-digest>.
     */
    computeChecksums(files) {
        const map = new Map();
        for (const file of files) {
            const hash = createHash('sha256');
            hash.update(readFileSync(file));
            map.set(file, hash.digest('hex'));
        }
        return map;
    }
    /**
     * Run a shell command.
     */
    async exec(command, argsOrOpts, opts) {
        const args = Array.isArray(argsOrOpts) ? argsOrOpts : [];
        const options = { ...((!Array.isArray(argsOrOpts) && argsOrOpts) || opts) };
        return execCmd(command, args, options);
    }
    /**
     * Render a Handlebars template file.
     */
    renderTemplate(path, data) {
        return '';
        // This is a stub — for now plugins use template.renderFile directly.
    }
    /**
     * Get an environment variable, optionally required.
     */
    getEnv(key, required) {
        const val = process.env[key];
        if (required && !val)
            throw new Error(`Required env var ${key} is not set`);
        return val;
    }
    /**
     * Assert multiple required environment variables are set.
     */
    assertRequiredEnvs(keys) {
        const missing = keys.filter((k) => !process.env[k]);
        if (missing.length > 0) {
            throw new Error(`Missing required env vars: ${missing.join(', ')}`);
        }
    }
    /**
     * Log a message via the semantic-release logger.
     */
    log(context, message) {
        context.logger.log(`[${this.name}] ${message}`);
    }
    /**
     * Log an error via the semantic-release logger.
     */
    logError(context, message) {
        context.logger.error(`[${this.name}] ${message}`);
    }
}
//# sourceMappingURL=base-plugin.js.map