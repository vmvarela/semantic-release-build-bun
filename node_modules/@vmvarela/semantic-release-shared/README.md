# @vmvarela/semantic-release-shared

Shared utilities for @vmvarela semantic-release plugins.

## Usage

```ts
import { BasePlugin, BuildZigConfigSchema } from '@vmvarela/semantic-release-shared';
import type { PluginContext, PrepareResult } from '@vmvarela/semantic-release-shared';

export class MyPlugin extends BasePlugin {
  readonly name = 'my-plugin';

  async prepare(config: unknown, context: PluginContext): Promise<PrepareResult> {
    const validated = this.validateConfig(BuildZigConfigSchema, config);
    // ... implementation
    return { artifacts: [] };
  }
}
```

## API

- `BasePlugin` — abstract class with lifecycle hooks (verifyConditions, prepare, publish) + utilities (validateConfig, exec, getArtifacts, computeChecksums, getEnv, renderTemplate)
- Config schemas — Zod schemas for all plugin configs (BuildZigConfigSchema, NfpmConfigSchema, HomebrewConfigSchema, etc.)
- `exec` — execa wrapper for shell commands
- `github` — Octokit wrapper for releases, dispatches, contents API
- `template` — Handlebars template rendering

## Requirements

- Node >= 24
- semantic-release ^24
