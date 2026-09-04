# MaveCode-MarketPlace

Public source of truth for all live MaveCode marketplace content: signed personas, MCP servers, and skills, plus their catalogs, metadata, versions, update timestamps, signing data, and release automation.

> The exact public repository name is `MaveCode-MarketPlace`. Do not rename, re-case, or refer to it as a different repository in product copy or implementation plans.

## Why this repo exists

The MaveCode extension repository may become private later. Live marketplace content must never depend on users reading or cloning the extension repository, so all published persona/MCP/skill packages and their signed catalogs live here.

The extension ships only with runtime code and mandatory fallback assets:

- **Ask** and **Code** stay bundled and always enabled (not installable/uninstallable).
- **Standard** stays bundled as a required fallback and is always enabled; live updates come from this repo when verified.
- **Enphase** stays installed by default; live source of truth is this repo.
- **MCP** bundled YAML remains an offline fallback; live source of truth is this repo.

## Contents

| Path | Purpose |
| --- | --- |
| `marketplace.json` | Signed root manifest linking the per-category catalogs. |
| `marketplace-personas.json` / `personas.json` | Signed persona catalog. |
| `marketplace-mcps.json` / `mcps.json` | Signed MCP catalog. |
| `marketplace-skills.json` / `skills.json` | Signed skills catalog. |
| `personas/`, `mcps/`, `skills/` | Source packages for each item. |
| `keys/public-keys.json` | Public signing keys used by the extension to verify catalogs/packages. |
| `scripts/build-marketplace.mjs` | Builds and signs every package and re-signs all catalogs. |
| `scripts/validate-marketplace.mjs` | Schema-validates all assets and enforces publish-time rules. |
| `marketplace.md` | Full architecture plan and non-negotiable rules. |

## Slash `/` invokes skills (not modes, not legacy commands)

As of the extension `3.77.0` release, the chat `/` menu resolves to **skills only**. The legacy slash-command subsystem was removed from the extension in favor of skills. Skills can be authored here (see `skills/`) and, once installed and enabled, are invocable from chat via `/skill-name` and also surface as commands. There is no separate "slash command" content type in the marketplace; publish skills instead.

## Publishing workflow

1. Edit persona/MCP/skill source files in this repo (in VS Code).
2. Bump the version for every content change.
3. Run marketplace validation and build (`node scripts/validate-marketplace.mjs`, `node scripts/build-marketplace.mjs`).
4. Commit with a clear message and push to `main` (no new branch).
5. CI validates/signs/publishes the catalogs and packages.
6. Clients receive updates through the cache-first background refresh (every 2 hours) or a manual Marketplace refresh.

## Signing

Packages and catalogs are signed with an ed25519 key (`signingKeyId: mavecode-marketplace-2026-01`). The matching public key in `keys/public-keys.json` is bundled into the extension for verification; the extension rejects any package/catalog signed by an untrusted key. The private key is never committed to the extension repository.

## Extension release notes

These notes track behavior in the MaveCode extension that affects how marketplace content and accounts are presented. Marketplace content packages are versioned independently in their own `skill.json` / persona / MCP manifests.

- **Extension `3.79.2`** — Default experience update. The default MaveCode (mave-gateway) model is now `gpt-5.5` (previously `gpt-5.6-sol`); this affects only the MaveCode provider default and leaves the separate OpenAI Codex and OpenAI Native provider defaults unchanged. Sound effects are now enabled by default on a fresh install, while any explicit user preference (including turning sound off) is still respected. No marketplace content changes were required for this release.
- **Extension `3.79.1`** — Account avatar fix. Google profile photos are served from several `*.googleusercontent.com` hosts (for example `lh3`, `lh4`, `lh5`, `lh6`, and `lh3-rc`). The webview Content-Security-Policy `img-src` previously allow-listed only `https://lh3.googleusercontent.com`, so accounts whose photo resolved to any other Google host fell back to the initial/`!` placeholder in the account button. The CSP now allows `https://*.googleusercontent.com`, so all Google account avatars render. No marketplace content changes were required for this release.
- **Extension `3.77.0`** — Chat `/` resolves to skills only; see "Slash `/` invokes skills" above.
