import { BuildBunConfigSchema, exec } from '@vmvarela/semantic-release-shared';
export async function verifyConditions(config, context) {
    const parsed = BuildBunConfigSchema.parse(config);
    const { stdout } = await exec('bun', ['--version'], { cwd: context.cwd, timeoutMs: 10000 });
    context.logger.log(`[build-bun] Bun version: ${stdout.trim()}`);
}
export async function prepare(config, context) {
    const { targets, entry } = config;
    const artifacts = [];
    for (const target of targets) {
        const ext = target.ext ?? '';
        const assetName = `${target.asset}${ext}`;
        context.logger.log(`[build-bun] Building target ${target.target} -> ${assetName}`);
        await exec('bun', ['build', `--target=${target.target}`, `--outfile=dist/${assetName}`, entry], {
            cwd: context.cwd,
        });
        artifacts.push({ path: `dist/${assetName}`, name: assetName, type: 'binary', target: target.target });
    }
    return { artifacts, version: context.nextRelease.version };
}
//# sourceMappingURL=index.js.map