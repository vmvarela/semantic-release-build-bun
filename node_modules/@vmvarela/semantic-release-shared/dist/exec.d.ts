import { type Options as ExecaOptions } from 'execa';
export interface ExecResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export type { ExecaOptions };
/**
 * Run a command.
 *
 * If `command` contains shell metacharacters (|, >, <, &&, etc.) it is
 * run via `sh -c`.  Otherwise the process is spawned directly.
 */
export declare function exec(command: string, args?: string[], opts?: ExecaOptions & {
    timeoutMs?: number;
}): Promise<ExecResult>;
//# sourceMappingURL=exec.d.ts.map