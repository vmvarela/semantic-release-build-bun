import { describe, it, expect } from 'vitest';
import { verifyConditions } from '../src/index.js';
import type { PluginContext } from '@vmvarela/semantic-release-shared';

const validConfig = {
  targets: [{ target: 'bun', asset: 'my-bundle.js' }],
  bun_version: '1.0',
  entry: 'src/index.ts',
};

const context: PluginContext = {
  logger: { log: () => {}, error: () => {} },
  nextRelease: { version: '1.0.0' },
  branch: { name: 'main' },
  repositoryUrl: 'https://github.com/vmvarela/my-cli',
  env: {},
  cwd: '/tmp/test',
};

describe('build-bun', () => {
  it('passes valid config', async () => {
    await expect(verifyConditions(validConfig, context)).resolves.toBeUndefined();
  });
  it('rejects missing targets', async () => {
    await expect(verifyConditions({ ...validConfig, targets: [] }, context)).rejects.toThrow();
  });
  it('rejects missing entry', async () => {
    const { entry, ...rest } = validConfig;
    await expect(verifyConditions(rest, context)).rejects.toThrow();
  });
  it('rejects empty targets', async () => {
    await expect(verifyConditions({ ...validConfig, targets: [] }, context)).rejects.toThrow();
  });
});
