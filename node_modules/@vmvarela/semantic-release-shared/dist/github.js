import { Octokit } from '@octokit/rest';
let _client = null;
function client() {
    if (!_client) {
        const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
        if (!token)
            throw new Error('GH_TOKEN or GITHUB_TOKEN not set');
        _client = new Octokit({ auth: token });
    }
    return _client;
}
/** Parse a `owner/repo` string. */
export function parseRepo(repo) {
    const [owner, name] = repo.split('/');
    if (!owner || !name)
        throw new Error(`Invalid repo format: ${repo} (expected owner/repo)`);
    return { owner, repo: name };
}
// ─── Releases ───────────────────────────────────────────────────────────
export async function getReleaseByTag(repo, tag) {
    const { owner, repo: repoName } = parseRepo(repo);
    const { data } = await client().repos.getReleaseByTag({ owner, repo: repoName, tag });
    return data;
}
export async function createRelease(repo, tag, opts = {}) {
    const { owner, repo: repoName } = parseRepo(repo);
    const { data } = await client().repos.createRelease({
        owner,
        repo: repoName,
        tag_name: tag,
        name: opts.title || tag,
        body: opts.notes || '',
        draft: opts.draft ?? false,
        prerelease: opts.prerelease ?? false,
    });
    return data;
}
export async function uploadAsset(repo, releaseId, filePath, name) {
    const { owner, repo: repoName } = parseRepo(repo);
    const fs = await import('node:fs');
    const stat = fs.statSync(filePath);
    await client().repos.uploadReleaseAsset({
        owner,
        repo: repoName,
        release_id: releaseId,
        data: fs.readFileSync(filePath),
        name,
        headers: { 'content-length': stat.size, 'content-type': 'application/octet-stream' },
    });
}
export async function downloadAsset(repo, releaseId, assetId, dest) {
    const { owner, repo: repoName } = parseRepo(repo);
    const { data } = await client().repos.getReleaseAsset({
        owner,
        repo: repoName,
        asset_id: assetId,
        headers: { accept: 'application/octet-stream' },
    });
    const fs = await import('node:fs');
    const buffer = Buffer.from(data);
    fs.writeFileSync(dest, buffer);
}
// ─── Repository Dispatch ────────────────────────────────────────────────
export async function dispatchRepoEvent(repo, eventType, payload = {}) {
    const { owner, repo: repoName } = parseRepo(repo);
    await client().repos.createDispatchEvent({
        owner,
        repo: repoName,
        event_type: eventType,
        client_payload: payload,
    });
}
// ─── Contents API ────────────────────────────────────────────────────────
export async function getFileContent(repo, path) {
    const { owner, repo: repoName } = parseRepo(repo);
    try {
        const { data } = await client().repos.getContent({ owner, repo: repoName, path });
        if ('content' in data) {
            return {
                content: Buffer.from(data.content, 'base64').toString('utf8'),
                sha: data.sha,
            };
        }
        return null;
    }
    catch {
        return null;
    }
}
export async function putFileContent(repo, path, content, message, sha) {
    const { owner, repo: repoName } = parseRepo(repo);
    await client().repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
    });
}
//# sourceMappingURL=github.js.map