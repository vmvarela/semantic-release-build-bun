# @vmvarela/semantic-release-build-bun

Build Bun/JS bundles for multiple targets during `semantic-release`.

## Install

```bash
npm install --save-dev @vmvarela/semantic-release-build-bun
```

## Usage

Add the plugin to your `.releaserc.yml`:

```yaml
plugins:
  - '@semantic-release/commit-analyzer'
  - '@semantic-release/release-notes-generator'
  - - '@vmvarela/semantic-release-build-bun'
    - targets:
        - target: bun
          asset: my-cli
          ext: .js
        - target: node
          asset: my-cli-node
          ext: .js
        - target: browser
          asset: my-cli-browser
          ext: .js
      bun_version: '1.0'
      entry: src/index.ts
  - '@semantic-release/github'
```

## Configuration

| Option         | Type                                                   | Required | Description                        |
|----------------|--------------------------------------------------------|----------|------------------------------------|
| `targets`      | `{ target: string; asset: string; ext?: string }[]`    | yes      | Build targets and output filenames |
| `bun_version`  | `string`                                               | yes      | Expected Bun version               |
| `entry`        | `string`                                               | yes      | Entry point file                   |

### Target

| Field    | Type     | Required | Description                       |
|----------|----------|----------|-----------------------------------|
| `target` | `string` | yes      | One of: `bun`, `node`, `browser`  |
| `asset`  | `string` | yes      | Output filename (without ext)     |
| `ext`    | `string` | no       | File extension (e.g. `.js`)       |

## What it does

- **`verifyConditions`** – validates config against `BuildBunConfigSchema` and checks that `bun --version` runs.
- **`prepare`** – runs `bun build --target=<target> --outfile dist/<asset><ext> <entry>` for each target. Returns produced artifacts for downstream plugins (packaging, publishing).

## Requirements

- Node.js >= 24.0.0
- [Bun](https://bun.sh/) installed and on `PATH`
- `semantic-release` >= 24.0.0

## Targets

Bun supports three build targets:

- **`bun`** – optimized for Bun runtime
- **`node`** – CommonJS/ESM compatible with Node.js
- **`browser`** – browser-compatible bundle
