import { BuildBunConfigSchema, exec } from '@vmvarela/semantic-release-shared';
import type { BuildBunConfig, PluginContext, PrepareResult } from '@vmvarela/semantic-release-shared';

export async function verifyConditions(config: unknown, context: PluginContext): Promise<void> {
  const parsed = BuildBunConfigSchema.parse(config);
  const { stdout } = await exec('bun', ['--version'], { cwd: context.cwd, timeoutMs: 10000 });
  context.logger.log(`[build-bun] Bun version: ${stdout.trim()}`);
}

export async function prepare(config: unknown, context: PluginContext): Promise<PrepareResult> {
  const { targets, entry } = config as BuildBunConfig;
  const artifacts: PrepareResult['artifacts'] = [];

  for (const target of targets) {
    const ext = target.ext ?? '';
    const assetName = `${target.asset}${ext}`;
    context.logger.log(`[build-bun] Building target ${target.target} -> ${assetName}`);
    await exec('bun', ['build', `--target=${target.target}`, `--outfile=dist/${assetName}`, entry], {
      cwd: context.cwd,
    });
    artifacts.push({ path: `dist/${assetName}`, name: assetName, type: 'binary' as const, target: target.target });
  }

  return { artifacts, version: context.nextRelease.version };
}
