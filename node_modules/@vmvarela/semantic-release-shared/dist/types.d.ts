/** Extended plugin context with branch and repository info. */
export interface PluginContext {
    logger: {
        log: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
    };
    nextRelease: {
        version: string;
        channel?: string;
        gitHead?: string;
        gitTag?: string;
        notes?: string;
    };
    branch: {
        name: string;
        channel?: string;
    };
    repositoryUrl: string;
    env: Record<string, string | undefined>;
    cwd: string;
}
/** A discovered or produced artifact file. */
export interface Artifact {
    path: string;
    name: string;
    type: 'binary' | 'man' | 'license' | 'package' | 'checksum';
    target?: string;
}
/** Returned by prepare() to pass data to subsequent steps. */
export interface PrepareResult {
    artifacts: Artifact[];
    version?: string;
    notes?: string;
}
//# sourceMappingURL=types.d.ts.map