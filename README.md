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

## Agent Skills compatibility for Claude Code, Roo Code, Zoo Code, Kiro, and other agents

MaveCode users should continue installing skills from the built-in MaveCode Marketplace. That path uses the signed `package.maveskill.json` packages and verified catalogs in this repository.

For other Agent Skills-compatible tools, every Marketplace skill directory also includes a standard `SKILL.md` file. This file is a portability mirror only:

- `name` comes from the skill directory ID and `skill.json.id`.
- `description` comes from `skill.json.description`.
- the Markdown body is copied from `instructions.md`.
- supporting files remain in the existing `references/`, `templates/`, and `scripts/` directories.

Do not edit `SKILL.md` as the source of truth. Update `skill.json` and `instructions.md` first, then regenerate or manually sync the matching `SKILL.md` before publishing.

### Install all skills

If your Agent Skills installer supports installing all skills from a GitHub repository, use the repository URL and the installer option for all skills. For example, with a compatible `skills` CLI version:

```sh
npx skills add arkofheavean/MaveCode-MarketPlace --all
```

This should install every directory under `skills/` that contains a `SKILL.md` file:

- `iterable-handlebars`
- `klaviyo-email-operations`
- `klaviyo-liquid-personalisations`
- `sfmc-ampscript`
- `sfmc-automation`
- `sfmc-journey`
- `sfmc-sql`

If the installer does not understand nested repository layouts, use the manual method below and copy the contents of this repository's `skills/` directory into the target agent's skills directory.

### Install one skill

If your Agent Skills installer supports selecting a single skill, pass the skill ID. For example:

```sh
npx skills add arkofheavean/MaveCode-MarketPlace --skill sfmc-ampscript
```

Use the exact IDs listed above. Do not shorten them to ambiguous names like `sfmc` or `klaviyo`, because multiple Marketplace skills share those brands.

### Install multiple selected skills

Some installer versions support repeating `--skill`:

```sh
npx skills add arkofheavean/MaveCode-MarketPlace --skill sfmc-ampscript --skill sfmc-sql
```

If repeated flags are not supported by your installer version, run the single-skill install command once per skill.

### Manual install fallback

Manual installation works for any agent that reads standard Agent Skills folders:

1. Clone or download this repository.
2. Open the `skills/` directory.
3. Copy the complete skill directory or directories you want.
4. Paste them into your agent's documented skills directory.
5. Confirm the final path ends with `<skill-id>/SKILL.md`.
6. Restart or refresh the agent if needed.

For example, installing all skills into a Roo-compatible project directory should produce this shape:

```text
your-project/
  .roo/
    skills/
      iterable-handlebars/
        SKILL.md
      klaviyo-email-operations/
        SKILL.md
      klaviyo-liquid-personalisations/
        SKILL.md
      sfmc-ampscript/
        SKILL.md
      sfmc-automation/
        SKILL.md
      sfmc-journey/
        SKILL.md
      sfmc-sql/
        SKILL.md
```

For agents that support the shared Agent Skills location, the same directories can be copied under `.agents/skills/` instead. Claude Code, Roo Code, Zoo Code, Kiro, and OpenCode may each have product/version-specific locations or import behavior, so follow the documentation for the exact version you use.

### Security and scripts

Marketplace skill scripts are distributed only as supporting resources. They must not run automatically during install. Only execute a script after explicit user review and consent.

## Publishing workflow

1. Edit persona/MCP/skill source files in this repo (in VS Code).
2. Bump the version for every content change.
3. For every skill content change, keep `SKILL.md` synchronized with `skill.json` and `instructions.md` for Agent Skills compatibility.
4. Run marketplace validation and build (`node scripts/validate-marketplace.mjs`, `node scripts/build-marketplace.mjs`).
5. Commit with a clear message and push to `main` (no new branch).
6. CI validates/signs/publishes the catalogs and packages.
7. Clients receive updates through the cache-first background refresh (every 2 hours) or a manual Marketplace refresh.

## Signing

Packages and catalogs are signed with an ed25519 key (`signingKeyId: mavecode-marketplace-2026-01`). The matching public key in `keys/public-keys.json` is bundled into the extension for verification; the extension rejects any package/catalog signed by an untrusted key. The private key is never committed to the extension repository.

## Extension release notes

These notes track behavior in the MaveCode extension that affects how marketplace content and accounts are presented. Marketplace content packages are versioned independently in their own `skill.json` / persona / MCP manifests.

- **Extension `3.80.0`** — MaveChat and its stale runtime/tests are removed. MaveCode Free is now a first-class, Google-Sheet-driven provider, while MaveCode Free and MaveCode Codex use authenticated live Cloudflare streaming relays. Provider credentials and `MAVECODE_RELAY_SECRET` remain server-side and are never marketplace package content. The standalone OpenAI providers remain unchanged. The GitHub-only release includes `mave-code-3.80.0.vsix` and `mavecode-figma-plugin-0.3.31.zip` together; the extension is not published to the VS Code Marketplace. No persona, skill, or MCP package change is required for this provider-runtime release.
- **Extension `3.79.2`** — Default experience update. The default MaveCode (mave-gateway) model is now `gpt-5.5` (previously `gpt-5.6-sol`); this affects only the MaveCode provider default and leaves the separate OpenAI Codex and OpenAI Native provider defaults unchanged. Sound effects are now enabled by default on a fresh install, while any explicit user preference (including turning sound off) is still respected. No marketplace content changes were required for this release.
- **Extension `3.79.1`** — Account avatar fix. Google profile photos are served from several `*.googleusercontent.com` hosts (for example `lh3`, `lh4`, `lh5`, `lh6`, and `lh3-rc`). The webview Content-Security-Policy `img-src` previously allow-listed only `https://lh3.googleusercontent.com`, so accounts whose photo resolved to any other Google host fell back to the initial/`!` placeholder in the account button. The CSP now allows `https://*.googleusercontent.com`, so all Google account avatars render. No marketplace content changes were required for this release.
- **Extension `3.77.0`** — Chat `/` resolves to skills only; see "Slash `/` invokes skills" above.
