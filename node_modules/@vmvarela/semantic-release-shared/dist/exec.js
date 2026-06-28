import { execa } from 'execa';
/**
 * Run a command.
 *
 * If `command` contains shell metacharacters (|, >, <, &&, etc.) it is
 * run via `sh -c`.  Otherwise the process is spawned directly.
 */
export async function exec(command, args = [], opts = {}) {
    const { timeoutMs, ...execaOpts } = opts;
    const runOpts = { ...execaOpts, reject: false };
    const child = shellNeeded(command)
        ? execa(command, { ...runOpts, shell: true })
        : execa(command, args, runOpts);
    if (timeoutMs !== undefined) {
        const timer = setTimeout(() => {
            child.kill('SIGTERM');
        }, timeoutMs);
        const result = await child;
        clearTimeout(timer);
        if (result.exitCode === undefined) {
            throw new Error(`exec timed out after ${timeoutMs}ms`);
        }
        return {
            stdout: String(result.stdout ?? ''),
            stderr: String(result.stderr ?? ''),
            exitCode: result.exitCode ?? 0,
        };
    }
    const result = await child;
    return {
        stdout: String(result.stdout ?? ''),
        stderr: String(result.stderr ?? ''),
        exitCode: result.exitCode ?? 0,
    };
}
function shellNeeded(cmd) {
    return /[|><&;`$(){}\n]/.test(cmd) || cmd.includes(' && ') || cmd.includes(' || ');
}
//# sourceMappingURL=exec.js.map