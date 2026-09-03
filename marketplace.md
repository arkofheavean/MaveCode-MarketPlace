# MaveCode-MarketPlace Architecture Plan

## 1. Final product direction

`MaveCode-MarketPlace` is the exact public repository name and the source of truth for all live marketplace content. Do not rename it, re-case it, or display it as a different repository name in product copy.

The extension repository can become private later. Because of that, live marketplace content must not depend on users reading or cloning the extension repository. The public `MaveCode-MarketPlace` repo must contain the published persona and MCP source packages, catalogs, metadata, versions, update timestamps, signing data, and release automation for marketplace content.

The extension ships with only the runtime code and mandatory fallback assets needed for reliability:

- Ask and Code stay bundled and always enabled.
- Standard stays bundled as required fallback and is always enabled.
- Enphase stays bundled and installed by default, but live Enphase source of truth moves to `MaveCode-MarketPlace`.
- MCP bundled YAML stays as offline fallback, but live MCP source of truth moves to `MaveCode-MarketPlace`.

## 2. Non-negotiable rules

- `MaveCode-MarketPlace` is public and is the live source of truth.
- The extension repo may become private and must not be required for users to inspect marketplace content.
- Ask and Code remain bundled with MaveCode forever.
- Ask and Code are always enabled.
- Ask and Code are not installable/uninstallable marketplace items.
- Standard remains bundled as required fallback.
- Standard is always available and cannot be uninstalled.
- Standard must always appear installed.
- Standard live updates come from the official `MaveCode-MarketPlace` source when verified.
- Enphase live updates come from the official `MaveCode-MarketPlace` source when verified.
- Enphase must always come installed by default.
- Enphase can be disabled/removed only if the product explicitly exposes that action later, but default state is installed.
- If a source or item is removed, affected personas/MCPs must be disabled and deleted from local marketplace-managed storage in the background.
- Removed source items and removed remote items must not remain visible in Marketplace after the removal is known.
- Persona packages may contain rules, validators, Python files, helper code, references, QA definitions, and any other files required for that persona.
- Persona package scripts/code files are allowed as package assets, but execution must be explicit, permissioned, and controlled by extension code. No downloaded file auto-runs during install/update.
- Standard and Enphase rule files, references, syntax, style, QA behavior, and non-AI validators/checks must be copied word-for-word into their marketplace packages.
- Startup loads cache first, then refreshes marketplace in the background without blocking extension load.
- Lightweight background metadata-only checks run every 2 hours.
- Marketplace opens instantly with cached catalog.
- Marketplace open checks remote only if cache is older than 2 hours.
- Manual Refresh is the only forced refresh.
- Update status is shown with a MaveCode header/banner notifier, not VS Code modal dialogs.
- Installed item updates are replace-only: old active persona/MCP files must be overwritten/replaced and removed from active storage after a successful update.
- If an item is removed from remote catalogs, the 2-hour check detects removal and destroys local marketplace-managed copies in the background without freezing the extension.

## 2.1 Extension integration update: skills, DCG, Execute, and MCP settings

- Disabled marketplace skills must be absent from chat skill dropdown data and from AI-visible skill loading paths. Single and batch skill enable/disable operations refresh discovered skills and immediately post an enabled, mode-visible skill list back to the webview.
- Destructive Command Guard (DCG) is managed on by MaveCode policy and is shown in a dedicated extension Settings section below Auto-Approve. The UI shows runtime status, installed/target versions, last check time, last error, and Manual Refresh.
- DCG install/check runs in the extension background without blocking startup. Normal refresh is throttled to once per 24 hours; Manual Refresh bypasses the throttle.
- Execute auto-approval remains a user preference. Execute ON auto-runs terminal commands/scripts only when DCG is active and allows the command. Execute OFF requires approval. If DCG is unavailable, commands require approval.
- Legacy allowed command prefixes, including `*`, may remain in local settings for compatibility, but they do not bypass DCG, do not approve all scripts when DCG is unavailable, and do not override Execute OFF.
- Project MCP editing is no longer promoted in extension Settings because marketplace MCPs are managed globally. The MCP settings view keeps global MCP editing, refresh, and Marketplace access.
- Slash `/` in chat resolves to skills only. As of extension `3.77.0` the legacy slash-command subsystem was removed in favor of skills: the `/` menu no longer lists modes or legacy commands, the `run_slash_command` tool is tombstoned (retained only as a name in `@roo-code/types` for backward compatibility and never offered at runtime), and the standalone slash-command settings/services were deleted. Marketplace content therefore publishes skills, not slash commands; an installed and enabled skill is invocable from chat as `/skill-name` and also surfaces as a command. There is no separate slash-command content type in the marketplace.

## 3. Current architecture inventory

### Core built-in modes

Current built-in modes live in `packages/types/src/mode.ts`.

- `code` is a core bundled mode with read/edit/command/MCP capability.
- `ask` is a core bundled mode with read/MCP capability.
- `architect`, `debug`, and `orchestrator` currently exist in legacy defaults but are hidden as coming-soon.

Target behavior:

- Ask and Code do not depend on marketplace.
- Marketplace source failure must not affect Ask/Code.
- Marketplace UI should not present Ask/Code as removable items.
- If Marketplace shows them at all, they should be informational only as `Built-in Core`, but preferred UX is to keep them out of Marketplace.

### Current Standard persona

Current bundled Standard files:

- `src/assets/personas/standard/persona.yaml`
- `src/assets/personas/standard/rules/workflow.md`
- `src/assets/personas/standard/references/master_template_Skeleton.html`
- `src/assets/personas/standard/references/master_template_with_Blocks.html`
- `src/assets/personas/standard/references/master_template.html`
- `src/assets/personas/standard/references/master.css`

Current bundled manifest entry after QA migration:

- id: `standard`
- version: `1.2.13`
- definition: `persona.yaml`
- rules: `rules/workflow.md`
- references: all four Standard reference files above

Standard marketplace package must preserve all current Standard behavior exactly, including:

- continuous Standard persona identity
- no delegation or mode switching
- compact two-todo workflow for Figma and non-Figma email builds
- approved references only
- Standard document skeleton/head/full stylesheet
- mandatory dark-mode meta tags, CSS, and mapped dark-mode classes
- no unsupported email HTML/CSS
- no sibling HTML/CSS/template/old-output/local reference learning unless explicitly allowed
- no `colspan`
- no inline image height styles
- all layout tables use `role="presentation"`
- all `td` cells include required `align` and `valign`
- image alt rules
- VML `w:anchorlock` requires Word namespace
- mobile `em_main_table` must remain fluid, not fixed to `375px` or `320px`
- spans must not carry `font-family`
- spans should only carry narrow inline styling when needed, such as numeric `font-weight`, color, underline, italic, or nowrap
- Standard non-AI Figma/email completion-gate validators are packaged in `personas/standard/validators/figma-email-gate.json` and Standard QA prompt ownership is packaged in `personas/standard/qa/figma-email-gate.json`

Standard is required because it is the general production email foundation.

### Current Enphase persona

Current bundled Enphase files:

- `src/assets/personas/enphase/persona.yaml`
- `src/assets/personas/enphase/rules/enphase-main-rules.md`
- `src/assets/personas/enphase/rules/main_config.md`
- `src/assets/personas/enphase/references/css1.txt`
- `src/assets/personas/enphase/references/css2.txt`
- `src/assets/personas/enphase/references/Enphase_Main_Reference.html`

Current bundled manifest entry after QA migration:

- id: `enphase`
- version: `1.3.11`
- definition: `persona.yaml`
- rules: `rules/enphase-main-rules.md`, `rules/main_config.md`
- references: both CSS text references and main HTML reference

Enphase marketplace package must preserve all current Enphase behavior exactly, including:

- continuous Enphase persona identity
- no delegation or mode switching
- compact two-todo workflow for Figma and non-Figma email builds
- only Enphase rules/references as authority
- Enphase brand font/class/reference behavior
- SFMC and AMPscript tracking requirements
- every Enphase anchor includes `conversion`, `data-linkto`, `href`, `title`, and `alias`
- web links use `target="_blank"`
- static web links include exactly one `utm_campaign=%%=v(@utm_campaign)=%%`
- mailto/SMS links use `conversion="false"` and `data-linkto="other"`
- phone links use `@CallCTA`, `CloudPagesURL`, and `RedirectTo(@CallCTA)`
- spans can receive numeric styling such as `font-weight:700`
- spans must not receive `font-family`
- word font weights like `bold` should be avoided when numeric weights are required
- image alt rules
- no `colspan`
- no inline image height styles
- all layout tables use `role="presentation"`
- VML `w:anchorlock` requires Word namespace
- no sibling-source learning unless explicitly allowed
- Enphase non-AI Figma/email completion-gate validators are packaged in `personas/enphase/validators/figma-email-gate.json` and Enphase QA prompt ownership is packaged in `personas/enphase/qa/figma-email-gate.json`

Enphase is official, trusted, bundled, and installed by default. It is client-specific, but current product direction is that both Standard and Enphase come installed. If Enphase removal is exposed later, removal must delete its local marketplace-managed storage and hide it from the persona list while respecting active task snapshots.

### Current MCP marketplace

Current bundled MCP listings live in `src/assets/marketplace/mcps.yml`.

Target behavior:

- bundled MCP YAML remains offline fallback
- live MCP source of truth moves to `MaveCode-MarketPlace`
- remote official MCP entries override bundled same-ID entries when verified
- MCP cards show version and relative updated time once the remote catalog provides them
- installed MCP updates are replace-only for managed definitions
- user secrets and compatible parameters are preserved when updating

## 4. Target public repository layout

Recommended public repository name: `MaveCode-MarketPlace`.

Recommended layout:

```text
MaveCode-MarketPlace/
  marketplace.json
  personas/
    personas.json
    standard/
      persona.yaml
      package.mavepersona.json
      rules/
      references/
      validators/
      scripts/
      qa/
    enphase/
      persona.yaml
      package.mavepersona.json
      rules/
      references/
      validators/
      scripts/
      qa/
  mcps/
    mcps.json
    items/
      apify/mcp.json
      atlassian/mcp.json
      figma/mcp.json
      github/mcp.json
      playwright/mcp.json
  keys/
    public-keys.json
  scripts/
    build-marketplace.mjs
  .github/workflows/
    publish-marketplace.yml
```

Rules:

- Standard and Enphase are stored in this public repo as real source files, not only generated packages.
- Persona source files are copied word-for-word from current working bundled persona files when migrated.
- The public repo publishes signed catalogs/packages.
- Extension consumes published catalogs/packages, not raw mutable folders.
- Raw source folders are for public review and CI package generation.

## 5. Manifest, catalog, and package schemas

### Root source manifest

Every marketplace source URL points to a root manifest. As of 2 Sep 2026 the official marketplace publishes three per-category signed root manifests at the repo root alongside the legacy combined `marketplace.json` (see the dated "Per-category official sources" section below): `marketplace-personas.json` (`official-mavecode-personas`, `personasCatalogUrl` only), `marketplace-skills.json` (`official-mavecode-skills`, `skillsCatalogUrl` only), and `marketplace-mcps.json` (`official-mavecode-mcps`, `mcpsCatalogUrl` only). The legacy combined manifest below remains published for older clients:

```json
{
  "schemaVersion": 1,
  "id": "official-mavecode",
    "name": "MaveCode-MarketPlace",
  "publisher": "MaveCode",
  "publishedAt": "2026-08-31T00:00:00.000Z",
  "personasCatalogUrl": "https://.../personas/personas.json",
  "mcpsCatalogUrl": "https://.../mcps/mcps.json",
  "signingKeyId": "mavecode-marketplace-2026-01",
  "signature": "..."
}
```

### Persona catalog item

```json
{
  "id": "enphase",
  "name": "⚡ Enphase",
  "type": "persona",
  "description": "Self-contained Enphase email engineering persona",
  "version": "1.4.0",
  "updatedAt": "2026-08-31T18:30:00.000Z",
  "packageUrl": "https://.../personas/enphase/package.mavepersona.json",
  "sha256": "...",
  "packageSize": 123456,
  "minimumMaveCodeVersion": "3.76.54",
  "tags": ["email", "enphase", "sfmc"]
}
```

### Persona package

Persona packages are data packages. They can include rules, references, validators, scripts, Python files, QA metadata, and helper code.

For v1, persona packages are text-only JSON packages. Python files, scripts, validators, HTML references, CSS references, and helper files are stored as text assets. Binary assets are not allowed in v1 unless a future package schema adds explicit binary encoding, file hashes, sizes, and validation rules. If binary assets become required, move to a signed archive package format.

```json
{
  "schemaVersion": 1,
  "id": "standard",
  "version": "1.2.13",
  "definition": {
    "slug": "standard",
    "name": "🧭 Standard",
    "roleDefinition": "...",
    "groups": ["read", "edit", "command", "mcp"]
  },
  "rules": [
    { "path": "rules/workflow.md", "content": "..." }
  ],
  "references": [
    { "path": "references/master_template_Skeleton.html", "content": "..." },
    { "path": "references/master_template_with_Blocks.html", "content": "..." },
    { "path": "references/master_template.html", "content": "..." },
    { "path": "references/master.css", "content": "..." }
  ],
  "validators": [
    { "path": "validators/email-rules.json", "content": "..." }
  ],
  "scripts": [
    { "path": "scripts/helper.py", "content": "..." }
  ],
  "qa": [
    { "path": "qa/final-checks.json", "content": "..." }
  ],
  "source": {
    "repository": "https://github.com/.../MaveCode-MarketPlace",
    "commit": "..."
  },
  "signingKeyId": "mavecode-marketplace-2026-01",
  "signature": "..."
}
```

Execution rule:

- scripts/code are allowed in the package as assets
- nothing executes automatically during install/update
- if a future feature executes package code, it must use explicit user consent, sandboxing/permissions, and trusted source verification

### MCP catalog item

MCP items need version/update metadata too:

```json
{
  "id": "figma",
  "name": "Figma",
  "type": "mcp",
  "description": "Figma MCP integration",
  "version": "1.0.0",
  "updatedAt": "2026-08-31T18:30:00.000Z",
  "url": "https://help.figma.com/...",
  "content": [
    {
      "name": "Remote MCP",
      "content": "{ ... }"
    }
  ],
  "parameters": [],
  "tags": ["figma", "design", "mcp"],
  "autoUpdateSafe": false
}
```

MCP source layout note: `MaveCode-MarketPlace` may store MCP sources as per-item files for maintainability, but CI compiles them into one signed published `mcps.json` catalog for v1. The extension consumes only the signed compiled catalog, not raw per-item MCP source files.

## 6. Marketplace source settings

Add Settings section below Email Testing:

```text
Marketplace
Manage marketplace sources used to discover Personas and MCP Servers.

Official MaveCode-MarketPlace
https://.../marketplace.json
Verified · 2 personas · 70 MCP servers · updated 10 mins ago
[Refresh] [Disable]

Custom source
https://company.example.com/mavecode-marketplace/marketplace.json
Verified · 5 personas · 3 MCP servers · updated 2 hours ago
[Refresh] [Remove]

[+] Add Marketplace Source

[x] Auto-update installed personas in background
[ ] Auto-update installed MCP definitions when safe
```

Source settings data:

```json
{
  "marketplaceSources": [
    {
      "id": "official-mavecode",
      "url": "https://.../marketplace.json",
      "enabled": true,
      "trusted": true,
      "official": true,
      "lastVerifiedAt": "2026-08-31T18:30:00.000Z",
      "lastError": null
    }
  ],
  "marketplaceAutoUpdatePersonas": true,
  "marketplaceAutoUpdateMcps": false
}
```

Rules:

- users can add multiple source URLs
- official source is preconfigured
- duplicate source URLs are normalized and rejected
- invalid/untrusted sources remain visible with error state but do not contribute installable items
- third-party source addition requires a trust warning
- source errors are isolated per source
- removing a source from Settings immediately schedules a background cleanup job for every persona/MCP installed from that source
- source cleanup disables affected personas/MCPs, removes their local marketplace-managed storage, removes their installed metadata, refreshes UI state, and hides them from Marketplace
- source cleanup must not block Settings, Marketplace, chat, or extension startup
- if source cleanup fails for a file-lock/permission reason, the item is marked `cleanup pending`, retried with backoff, and hidden from Marketplace/persona list meanwhile

SettingsView implementation must bind controls to local cached state, not live extension state.

Source action semantics:

- **Disable source** stops background checks and hides that source's Marketplace listings, but does not delete installed local storage unless the user explicitly chooses cleanup.
- **Remove source** deletes the source from Settings and schedules background cleanup for all marketplace-managed personas/MCPs installed from that source.
- Removing a source requires confirmation because it disables/deletes local marketplace-managed items from that source.
- Confirmation copy: `Removing this marketplace source will disable and delete locally installed Personas and MCPs from this source. Standard and Enphase will fall back to bundled copies if required. Cleanup runs in the background.`
- Confirmation actions: `Remove source and cleanup`, `Cancel`.
- Standard cleanup removes only the marketplace-managed Standard copy and then falls back to bundled Standard.
- Enphase cleanup removes only the marketplace-managed Enphase copy and then falls back to bundled Enphase while the current product direction is that Enphase always comes installed.
- Other personas from the removed source are disabled and deleted from local marketplace-managed storage.
- MCPs from the removed source are disabled and deleted from local marketplace-managed metadata/storage; managed config blocks are removed only when safely identifiable.

## 7. Marketplace tab UX

Marketplace tab contains both Persona and MCP discovery.

Top UI:

```text
Marketplace
[Search marketplace] [Refresh]

[Personas] [MCP Servers]

Filters:
[Installed: All / Installed / Available to install / Update available]
[Source: All / Official MaveCode / Custom sources]
[Tags]
```

Standard card:

```text
🧭 Standard
v1.2.13 · updated 10 mins ago
Official · Persona · Required · Installed

Universal client-agnostic email development persona for any brand.

[Installed]
```

Enphase installed/update card:

```text
⚡ Enphase
v1.4.0 · updated 10 mins ago
Official · Persona · Installed v1.3.10 · Update available

Self-contained Enphase email engineering persona.

[Update]
```

If Enphase is current, show `[Installed]`. If the installed marketplace package is corrupted, show `[Repair]`. Do not show `[Uninstall]` in the current default product plan because Enphase comes installed by default.

Optional persona available to install:

```text
Client Persona
v1.0.0 · updated 10 mins ago
Custom source · Persona · Available to install

[Install]
```

MCP card:

```text
Figma
v1.0.0 · updated 10 mins ago
Official · MCP Server · Available to install

Figma MCP integration.

[Install]
```

Recommended badges:

- Official
- Custom source
- Built-in fallback
- Required
- Installed
- Available to install
- Update available
- Updating
- Revoked
- Incompatible MaveCode version

## 8. Cache-first refresh behavior

Startup:

1. Load Ask and Code from built-in defaults.
2. Load Standard from valid installed marketplace package if available.
3. Fall back to bundled Standard if installed Standard is missing/invalid.
4. Load Enphase from valid installed marketplace package if available.
5. Fall back to bundled Enphase if installed Enphase is missing/invalid.
6. Load cached marketplace catalogs and installed metadata.
7. Render extension and UI.
8. Start background marketplace metadata check without blocking startup.

Background check:

- every 2 hours
- metadata-only first
- no package downloads unless an installed item has a verified newer version/hash or confirmed removal/revocation
- no UI interruption
- no VS Code modal dialogs

Marketplace open:

1. Open instantly with cached data.
2. Show a thin progress bar or top inline loader while refresh/revalidation is running.
3. Keep the Marketplace UI responsive and usable during refresh.
4. If cache is newer than 2 hours, complete quickly after checking local freshness.
5. If cache is older than 2 hours, start background revalidation and keep showing cached items until fresh data arrives.

Manual Refresh:

1. Force refresh regardless of 2-hour cache.
2. Show inline loading state.
3. Report per-source failures without clearing valid cached data.

## 9. Header/banner notifier

No VS Code modal dialog for normal marketplace updates.

Use a MaveCode header/banner notifier:

- `Updating Standard persona to v1.2.13…`
- `Standard persona updated to v1.2.13`
- `Updating Enphase persona to v1.4.0…`
- `Enphase persona updated to v1.4.0`
- `Updating Figma MCP listing…`
- `Could not update Enphase persona. Using cached version.`
- `Marketplace refresh failed for Custom Source. Using cached data.`

Behavior:

- non-blocking
- auto-dismiss success
- warning is dismissible
- no interruption to active tasks
- no popup at startup

Marketplace-open refresh loader:

- use a thin progress bar near the Marketplace title or refresh button
- do not cover cards with a blocking overlay
- keep search, filters, install buttons, and navigation responsive
- show per-source status if a source is slow or failed
- manual Refresh can show stronger progress, but still non-blocking

## 10. Replace-only installed storage

Installed item storage is not a multi-version active store.

Catalog cache may keep last-known metadata, but installed active storage must keep only one active installed version per item.

Persona active storage:

```text
globalStorage/
  managed-personas/
    official-mavecode/
      standard/
        current/
      enphase/
        current/
```

Update transaction:

```text
current/
next.tmp/
previous.rollback/
```

Flow:

1. Download package to `next.tmp`.
2. Verify schema, source, signature, hash, size, compatibility, and paths.
3. If verification fails, delete `next.tmp`; keep `current` untouched.
4. Rename `current` to `previous.rollback`.
5. Rename `next.tmp` to `current`.
6. Update installed metadata to new version/hash only.
7. Delete `previous.rollback` after success.
8. If failure happens after step 4, restore rollback to current.

After success, the old active version is gone from active storage.

Replacement implementation rules:

- use one per-item operation lock so update, source cleanup, and remote removal cleanup cannot race
- active tasks keep the persona prompt/rules snapshot they started with; updates affect future tasks only
- on Windows, directory rename/delete can fail because of file locks or antivirus scanning, so use retry with backoff
- never delete `previous.rollback` until `current` is readable and metadata has been flushed
- on next startup, reconcile stale `next.tmp` or `previous.rollback` folders before loading the item
- local JSON metadata writes must use `safeWriteJson()` from `src/utils/safeWriteJson.ts`

## 11. Standard migration plan

Phase 1:

- Keep bundled Standard in the extension.
- Publish exact Standard source files to `MaveCode-MarketPlace`.
- Mark Standard as installed/required in marketplace metadata.
- Remote verified Standard overrides bundled Standard.
- Bundled Standard remains fallback if remote/cache fails.

Phase 2:

- Continue shipping a bundled Standard snapshot forever as emergency fallback.
- Update live Standard through `MaveCode-MarketPlace`.
- Standard cannot be uninstalled.
- Standard remains installed for every user.

Failure handling:

- corrupted installed Standard -> delete invalid installed copy and use bundled Standard
- failed Standard update after rollback starts -> restore previous installed Standard first, then use cached last verified package, then bundled Standard only if restore/cache fails
- marketplace unavailable -> use cached installed Standard or bundled fallback
- Standard removed from catalog -> do not remove required Standard unless signed revocation/replacement policy exists; use fallback

## 12. Enphase migration plan

Phase 1:

- Keep bundled Enphase as migration fallback.
- Publish exact Enphase source files to `MaveCode-MarketPlace`.
- Existing users get Enphase marked installed/enabled.
- New users get Enphase installed/enabled by default.
- Enphase remains installed by default for all users.

If Enphase source/item removal occurs:

- remove installed Enphase current folder
- remove installed metadata
- hide Enphase from persona list
- hide Enphase from Marketplace if its source was removed or the item was removed from the source catalog
- use bundled Enphase fallback only if product requires Enphase to remain always installed after official source failure; otherwise respect confirmed source/item removal

Later:

- Enphase can remain bundled as a fallback snapshot while official source is available.
- If product later changes Enphase to optional, add a separate explicit removal UX and metadata tombstone; do not mix optional uninstall behavior into the current always-installed plan.

Persona install contents:

- install the full persona package, not only the mode definition
- install rules, references, validators, QA metadata, scripts, Python files, helper code, and every package file needed for the persona
- preserve exact file paths relative to package root after validation
- package code files are stored locally with the persona, but they do not auto-run during install/update

## 13. MCP migration and update plan

MCP source of truth moves from bundled YAML to `MaveCode-MarketPlace`.

Bundled MCP YAML remains fallback.

Current migration status:

- Every static MCP listing from the extension fallback file `src/assets/marketplace/mcps.yml` has a maintainable source file in this public repository under `mcps/items/<mcp-id>/mcp.json`.
- The extension fallback YAML is intentionally unchanged and remains packaged as the offline fallback for marketplace/network/signature failure.
- The child build compiles all `mcps/items/*/mcp.json` files into the signed `mcps/mcps.json` catalog consumed by the extension.
- Build order is stable by MCP ID so repeated builds produce deterministic item order.
- Each MCP source file carries `type: "mcp"`, `version`, and `updatedAt`. If a source omits `version` or `updatedAt`, the build fills `1.0.0` and the current catalog publish timestamp respectively.
- The Metoro demo cluster entry is sanitized: the previous JWT-like demo token and demo URL are replaced with `{{METORO_AUTH_TOKEN}}` and `{{METORO_API_URL}}` placeholders.
- MCP template `content` remains inline JSON text in the signed catalog to match the extension schema and current install modal behavior.
- MCP updates currently update the verified catalog cache and Marketplace cards. Managed installed MCP definition replacement is only safe when the generated managed block can be identified without destroying user edits.

MCP update types:

### Listing metadata update

- safe to update cache silently
- updates description, tags, version, updatedAt, templates available in Marketplace

### Installed managed MCP definition update

- replace old generated managed block only when user manually updates, or when `autoUpdateSafe: true` and user allowed MCP auto-updates
- preserve compatible user secrets and parameters
- if required parameter changes, show Update available and require manual confirmation
- old managed definition is removed/replaced, not duplicated
- if the MCP source is removed from Settings, disable the MCP, remove its marketplace-managed local metadata/storage, remove managed config blocks when safely identifiable, and hide it from Marketplace
- if an MCP item is removed from its source catalog, the 2-hour metadata check schedules the same background cleanup without freezing the extension

### User-customized MCP config

- never destroy unknown user edits silently
- if conflict is detected, show manual update flow with diff/summary

## 14. Remote removal, revocation, and cleanup

Every 2-hour metadata check also detects removed or revoked items.

Removal policy:

- If a source is removed from Settings, remove all personas/MCPs from that source locally.
- If a persona/MCP item is removed from its source catalog, remove that local marketplace-managed item during the next 2-hour check.
- Remote item removal is trusted only after a successfully verified catalog from that source omits the item or includes signed removal/revocation metadata.
- Network failure, timeout, invalid signature, invalid schema, or parse failure must never be treated as item removal.
- Confirmed removal writes a removal marker into cache so stale old catalogs cannot make the removed item reappear.
- A removal marker is cleared only if a future verified catalog reintroduces the item with a valid higher version/hash or explicit signed reintroduction metadata.
- Removal runs in a background cleanup queue and must not freeze the extension.
- Removed source/items must disappear from Marketplace after cleanup state is known.
- Removed personas must disappear from the persona list after cleanup state is known.
- Removed MCPs must be disabled and removed from marketplace-managed metadata/storage.
- If source includes signed hard revocation, disable/remove local marketplace-managed package according to revocation rule immediately in the same background queue.
- Standard cannot be fully removed because it is required; if remote Standard is removed, fall back to bundled Standard and hide the removed remote listing.
- Enphase marketplace-managed copy can be removed after confirmed source/item removal, but bundled Enphase fallback keeps Enphase installed while current product direction requires Enphase by default.

Revocation policy:

- signed revocation list can disable unsafe package hashes
- revoked optional persona should be disabled locally and removed from active persona list
- revoked MCP managed definition should be disabled or require user action
- revoked Standard requires fallback to bundled Standard or a new VSIX if bundled fallback is also affected

Background cleanup queue:

- cleanup is asynchronous and non-blocking
- one cleanup operation per source/item runs at a time
- UI updates immediately to hide removed Marketplace cards and persona entries
- physical deletion can finish after UI update
- cleanup failures are logged and retried with backoff
- stale cleanup entries are reconciled on startup

## 15. Source identity and conflicts

Use composite internal IDs:

```text
sourceId:type:itemId
```

Examples:

```text
official-mavecode:persona:standard
official-mavecode:persona:enphase
official-mavecode:mcp:figma
custom-company:persona:standard
```

Rules:

- official source wins for official Standard and Enphase
- third-party same ID remains separate internally
- UI shows source label to avoid confusion
- install metadata stores source ID and item ID
- custom source cannot shadow required Standard runtime behavior
- custom source cannot shadow official Enphase runtime behavior while Enphase is installed by default
- custom project/global modes cannot override managed persona slugs
- internal source identity is derived from normalized source URL plus trusted signing-key fingerprint, not only the manifest-provided source ID
- manifest source ID/name is display metadata, not the sole security identity

## 16. Same version and hash edge cases

Every content change must bump version. Versions use SemVer `MAJOR.MINOR.PATCH`. Invalid versions are ignored. Prerelease versions are not auto-installed unless a future prerelease channel is explicitly added. Version bumps are required for persona definition, rules, references, QA definitions, validators, scripts, helper files, and MCP template changes.

If same version appears with different hash:

- treat as suspicious
- reject auto-update
- show source error or warning in Marketplace settings
- continue using last verified cache
- allow only with future signed republish metadata if explicitly designed

If lower version appears:

- do not auto-downgrade
- show downgrade only as future manual advanced action if ever needed

Automatic comparison:

- compare SemVer numerically
- remote higher version plus valid signature/hash is an update
- same version and same hash is no-op
- same version and different hash is suspicious and rejected
- lower version is ignored for auto-update

## 17. Client-side security model

Source safety:

- HTTPS only
- no `file:`, `http:`, or local loopback source URLs for normal users
- normalize URLs and prevent duplicates
- limit redirects
- enforce bounded response sizes before parsing
- verify content type when available, but do not rely only on it
- validate root manifest before fetching subcatalogs
- isolate per-source errors
- keep last-known-good cache when a source fails

Signature/trust:

- official source uses embedded official public key
- custom source uses simple trust-on-first-use: user confirms source URL and signing key fingerprint once
- custom source should provide signing key metadata and a fingerprint display
- once trusted, key changes require re-confirmation with old/new fingerprint shown in Settings
- never trust unsigned catalog/package content

Package safety:

- reject absolute paths
- reject traversal paths
- reject unexpected symlink behavior
- enforce max package size and max file size
- validate persona definition schema
- validate MCP item schema
- verify SHA-256 and signature before activation
- scripts/code files are inert assets unless a future permissioned execution path explicitly runs them

Validator/code execution rule:

- Phase A keeps the existing extension validator as compatibility fallback so Figma-to-code does not break during migration
- Phase B moves Standard/Enphase-specific QA rule configuration into their marketplace persona packages
- Phase C uses a generic safe extension runner/engine to execute declarative QA definitions from the installed persona package
- Phase D removes hardcoded persona-specific extension rules only after parity tests prove package-driven validation matches current behavior
- marketplace persona validators should be declarative constraints first
- executable validators/scripts/Python files are installed as persona assets but are not run automatically
- future execution requires explicit user consent, source trust, sandbox/permission design, and clear UI

MCP catalog shape:

- use one signed full `mcps.json` catalog with MCP listing content inline for v1
- do not mix per-item MCP files with unsigned content in v1
- if per-item MCP packages are introduced later, the signed catalog must include each item URL, SHA-256, size, version, and signing metadata

Privacy, network, and backoff:

- Settings must explain that enabled marketplace sources are checked in the background
- disabled/removed sources are not checked
- no user credentials are sent to marketplace sources
- avoid logging URL query strings or tokens
- automatic refresh uses per-source backoff after repeated failures
- manual Refresh bypasses backoff
- operation status is stored in extension state so webview reload can restore current updating/cleanup/progress banners
- telemetry/logging should record success/failure counts without sensitive source URLs, query strings, secrets, package content, or full signed payloads

Updated-time display:

- render `updated 10 mins ago` from `updatedAt`
- if timestamp is slightly in the future, show `updated just now`
- if timestamp is far in the future, show a source warning or absolute date instead of misleading relative text

## 18. Persona and Figma preservation rules

The bundled Figma flow is generic and must not contain Standard or Enphase rules directly. It only provides the Figma export workflow, compact metadata, assets, target HTML path, source-boundary instructions, and active persona selection.

Persona-specific rules live inside marketplace persona packages:

- Standard rules, references, QA definitions, non-AI validator definitions, scripts, Python files, helper code, and required package files live inside the Standard package from `MaveCode-MarketPlace`.
- Enphase rules, references, QA definitions, non-AI validator definitions, scripts, Python files, helper code, and required package files live inside the Enphase package from `MaveCode-MarketPlace`.
- The extension can keep the generic Figma flow and a generic safe runner/engine, but Standard/Enphase-specific QA content must come from the installed persona package, not hardcoded bundled persona rules.
- Bundled Standard/Enphase fallback copies exist only for reliability and must preserve current behavior when marketplace is unavailable.

Figma flow rules:

- Figma flow remains bundled in the extension.
- Figma flow uses marketplace-installed active persona rules when available.
- Figma flow respects persona rules and references exactly like current bundled personas do.
- Figma flow uses compact metadata for exact values such as text, spacing, padding, typography, colors, CTA dimensions, image dimensions, and asset paths.
- Figma flow does not duplicate Standard or Enphase rules in the generic Figma instructions.
- Figma flow must continue to work for Standard and Enphase after marketplace migration.
- Completion/QA must still validate the final generated HTML according to active persona QA definitions.

### Figma metadata retention rule

The Figma flow should generate and prefer a compact build metadata file. Large/raw plugin metadata is only for debug/replay and should not be used as normal generation context.

Lifecycle:

```text
Figma plugin export
  -> raw metadata file
  -> compact build metadata file
  -> validate compact metadata
  -> use compact metadata for AI, persona QA, and completion gate
  -> optionally delete raw metadata in background
```

Rules:

- Do not delete raw metadata until compact metadata passes schema validation.
- Do not delete exported images/assets needed by the build.
- Do not delete the output HTML target.
- Keep enough compact metadata to rerun completion gate and persona QA.
- Store export hash, target path, metadata path, compact metadata hash, active persona slug, persona source, and persona version in compact metadata or task/session state.
- If compact metadata is missing/corrupt, regenerate from raw metadata if available; otherwise require a re-export.
- Raw metadata cleanup runs in the background and must not block UI, chat, or completion.

### Same-chat Figma context injection rule

The extension must inject full Figma context only once per Figma build target/session. Same-chat follow-up edits must not append duplicate Figma context blocks and must not resend the metadata JSON repeatedly.

Store this marker in task metadata for the current active task and task-history metadata for restored tasks. Do not store it as global marketplace state because Figma context identity is per task/session. The marker must survive webview reload and extension reload when the task is restored.

Add a task/session marker like:

```json
{
  "figmaContext": {
    "injected": true,
    "targetHtmlPath": "...",
    "metadataPath": "...",
    "compactMetadataHash": "...",
    "rawMetadataPath": "...",
    "exportHash": "...",
    "personaSlug": "standard",
    "personaSourceId": "official-mavecode",
    "personaVersion": "1.2.13",
    "contextBlockId": "...",
    "injectedAt": "2026-08-31T21:00:00.000Z"
  }
}
```

Inject full Figma context only when:

- no previous Figma context marker exists
- target HTML path changed
- compact metadata path changed
- compact metadata hash changed
- Figma export hash changed
- active persona changed
- user explicitly starts a new Figma export/build session

Do not inject full Figma context when:

- same chat continues
- same target HTML is being edited
- same compact metadata hash is valid
- same active persona snapshot is in use
- user asks normal follow-up edits such as spacing, text, CTA, image, QA, or responsive fixes

Same-chat follow-up behavior:

- send only the user's new instruction unless a tiny reminder is needed
- reuse existing chat context, current output HTML, compact metadata file, and active persona snapshot
- do not re-add metadata JSON into the conversation
- do not re-read raw metadata unless explicitly required
- completion gate still validates final output HTML

Allowed re-injection cases:

- new Figma export
- new target HTML path
- new compact metadata hash
- active persona changes between sessions
- user explicitly requests a new Figma build context

### Active task and mode switching boundary

Persona identity is stable within one active task. Standard and Enphase must not switch modes, delegate, or inherit another persona during that task.

Between tasks, users can switch modes/personas normally:

- after task completion
- after cancellation
- when starting a new chat/task
- when explicitly starting a new Figma build session

A new task resolves the currently selected mode/persona and uses the latest valid installed marketplace package or bundled fallback. Active tasks keep their original persona package/rules/reference snapshot even if marketplace updates run in the background.

Task snapshot implementation:

- when a task starts, resolve active persona slug, source, package version, rules, references, and QA definitions
- assemble the role/custom instructions/rules/references into a task prompt snapshot
- do not lazily re-read updated persona files for that active task
- same-chat Figma edits reuse this same snapshot
- marketplace updates only affect newly started tasks

### Persona parity gates before marketplace activation

Package build gate:

- all current Standard files are copied exactly into the Standard marketplace package
- all current Enphase files are copied exactly into the Enphase marketplace package
- file order matches current persona manifest behavior
- persona slug remains unchanged
- persona version matches catalog version
- rules and references are not dropped
- QA/validator definitions are included inside the persona package
- Figma compatibility metadata is included when the persona supports Figma email work
- package hash and size match catalog
- package signature verifies

Runtime validation gate:

- validate package signature
- validate SHA-256 and package size
- validate safe relative paths
- validate persona schema
- validate required persona files exist
- validate required QA/validator definitions exist for Standard and Enphase
- reject unsafe executable auto-hooks
- install all package files locally, including code/Python files as inert assets
- keep previous working package or bundled fallback if validation fails

Figma QA gate:

- Standard marketplace package assembles to the same or stricter prompt/rule behavior as bundled Standard
- Enphase marketplace package assembles to the same or stricter prompt/rule behavior as bundled Enphase
- Standard Figma flow still builds constraints for `standard`
- Enphase Figma flow still builds constraints for `enphase`
- completion gate validates marketplace-installed Standard and Enphase
- same-chat follow-ups do not duplicate Figma context or metadata JSON
- active task snapshot does not change after background persona update
- same-chat follow-up after webview reload does not duplicate Figma context
- restored Figma task from history does not duplicate metadata JSON
- new Figma export injects new context exactly once
- same metadata path with changed compact metadata hash injects new context exactly once

### Figma-to-code end-goal preservation

The marketplace migration must not change the final output quality, Figma-to-code behavior, or persona-specific email rules. The end goal remains identical: generated HTML must follow the selected persona's current rules and references and use Figma metadata for exact values as it does now.

Preservation rules:

- Figma-to-code output target path handling must remain compatible with current completion gate behavior.
- Compact metadata must preserve every exact value currently needed for email builds.
- Persona rules and references are loaded from the marketplace-installed Standard/Enphase package, or bundled fallback if marketplace is unavailable.
- The generated final HTML must be validated by persona QA definitions from the active persona package.
- No Standard/Enphase rule should be weakened, removed, renamed, or moved into generic Figma flow.
- No Enphase/Standard reference file should be dropped or reordered.
- If marketplace package validation fails, use previous working installed package or bundled fallback so Figma-to-code still works.
- Existing Figma exports and same-chat edit flows must continue working after marketplace migration.

### Aggressive QA gate migration plan: persona-owned validators and generic Figma workflow

Strict ownership model:

- Generic extension/runtime code owns marketplace package loading, signature/hash/schema/path validation, safe installed storage, active persona resolution, task snapshotting, and the generic Figma workflow only.
- The generic Figma workflow must only fetch/export Figma data, create required folders/assets, write compact metadata, create or target the initial HTML/skeleton, inject the first prompt/context once, pass the active persona identity/source/version into the task snapshot, and avoid duplicate same-chat Figma context or repeated metadata JSON.
- Standard and Enphase own their email QA behavior inside marketplace persona packages. Unsupported email HTML/CSS checks, bad table/html rules, Standard dark-mode requirements, Enphase tracking/link/SFMC/AMPscript rules, and any similar persona-specific completion checks must move into each persona package's `qa` and/or `validators` assets.
- The extension compatibility QA gate may temporarily run existing hardcoded Standard/Enphase checks only as a migration bridge. It must be flagged temporary, covered by parity tests, and removed after package-driven validators reach parity.
- After migration, no hardcoded Standard or Enphase QA rule may remain in the generic Figma path. Generic code can route validation, but persona-specific rule content must come from the active installed persona package or bundled fallback snapshot.

Concrete phases:

1. **Inventory and blockers**: list every current Standard/Enphase QA rule in prompts, completion gates, Figma helpers, validators, and webview/extension glue. Blockers are missing package schema fields, missing declarative validator runner support, missing compact metadata fields, or any rule that cannot be represented without executing package code.
2. **Package schema and source migration**: add explicit `qa`/`validators` package entries for Standard and Enphase in `MaveCode-MarketPlace`, copy current rule behavior exactly, bump persona versions, and make marketplace validation fail if required QA files are absent.
3. **Generic runner integration**: make extension-side validation load declarative QA from the resolved active persona snapshot. The runner can validate generic package safety and execute built-in safe constraint types, but must not embed Standard/Enphase rule text or client-specific constants.
4. **Compatibility bridge**: keep the existing extension QA gate only for installed packages that do not yet expose migrated QA assets. Emit clear diagnostics indicating temporary fallback use and prefer package-owned validators whenever present.
5. **Parity tests and acceptance gate**: add fixture tests proving Standard and Enphase package validators catch the same or stricter failures as current hardcoded behavior, including unsupported email HTML, bad table/html rules, Standard dark mode, Enphase tracking/link/SFMC/AMPscript, compact metadata-driven Figma checks, same-chat no-duplicate context, and active persona snapshot stability.
6. **Removal phase**: delete hardcoded persona-specific QA from the generic Figma path after parity passes. Keep only generic routing, package validation, fallback loading, and task/session metadata handling.

Acceptance criteria:

- Figma-to-code output remains behaviorally identical or stricter for Standard and Enphase.
- The generic Figma workflow contains no Standard/Enphase-specific rule text, constants, or client QA branches.
- Installed marketplace Standard/Enphase packages include required `qa`/`validators` assets and fail validation if those assets are missing, malformed, or incompatible.
- Compatibility fallback is used only for older/missing QA assets and is documented as temporary.
- Active tasks keep their original persona QA snapshot; marketplace updates affect future tasks only.
- Same-chat follow-ups do not duplicate Figma context or metadata JSON.

Files likely involved:

- Extension generic Figma/task path: `src/core` Figma helpers, task metadata/session state, prompt/context injection, and completion-gate routing.
- Persona package loading/storage: `src/services/marketplace`, persona managed storage, bundled fallback resolution, and package validation.
- Marketplace source packages: `personas/standard/qa`, `personas/standard/validators`, `personas/enphase/qa`, and `personas/enphase/validators`.
- Marketplace build/validation: `scripts/build-marketplace.mjs` and `scripts/validate-marketplace.mjs`.

Rollback and fallback behavior:

- If a migrated marketplace package fails validation, keep the previous installed package; if unavailable, use bundled Standard/Enphase fallback snapshots.
- If package-driven QA fails unexpectedly in production, disable the migrated package version via signed catalog update/revocation and fall back to the previous installed or bundled snapshot.
- If compact metadata is missing or corrupt, regenerate from raw metadata when available; otherwise require a new Figma export rather than weakening persona QA.
- Rollback must not reintroduce permanent hardcoded persona QA into the generic Figma workflow; temporary compatibility fallback remains the only allowed bridge until removal.

## 19. Normal user flows

### New user first startup

1. MaveCode opens fast.
2. Ask, Code, Standard, and Enphase are available immediately.
3. Marketplace loads cached or bundled fallback listings.
4. Background marketplace metadata refresh starts after UI is usable.
5. User can open Marketplace and see Personas/MCP Servers.

### Existing user after migration

1. Standard remains required and installed.
2. Enphase is installed/enabled by default.
3. Metadata stores current bundled versions as baselines.
4. Background refresh finds official updates.
5. Header banner shows only if actual installed item update begins.
6. Old installed active version is replaced after successful update.

### User adds custom marketplace source

1. User opens Settings below Email Testing.
2. User adds source URL.
3. MaveCode validates HTTPS and manifest structure.
4. User sees third-party trust warning.
5. If accepted and verified, source items appear in Marketplace.
6. If invalid, source remains in Settings with error and contributes no items.

### User removes marketplace source

1. User clicks Remove on a source in Settings.
2. MaveCode confirms that all personas/MCPs from that source will be disabled and deleted locally.
3. UI returns immediately and remains responsive.
4. Background cleanup disables affected personas/MCPs and deletes local marketplace-managed storage.
5. Removed items disappear from Marketplace and persona/MCP installed lists.
6. Cleanup failures are retried and shown as small non-blocking status if needed.

### User installs Enphase

1. Enphase is already installed by default.
2. User opens Marketplace and sees Enphase as Installed.
3. If an update is available, user can click Update.
4. If the local marketplace-managed package is corrupted, user can click Repair.
5. Update/Repair downloads and verifies the full package.
6. Store as active `current` package and keep Enphase in the persona list.

### Enphase source/item cleanup

1. Official source is removed from Settings, or Enphase is removed from the signed official source catalog.
2. MaveCode hides Enphase from Marketplace after the removal is known.
3. MaveCode schedules background cleanup.
4. Cleanup disables Enphase and deletes marketplace-managed local storage.
5. If bundled Enphase fallback must keep Enphase installed for product reliability, MaveCode switches to bundled fallback; otherwise Enphase is removed from the persona list.

### User installs MCP

1. Open Marketplace.
2. Select MCP Servers.
3. Click Install.
4. Choose project/global target.
5. Fill parameters.
6. MaveCode writes config.
7. MCP appears installed.

### User sees update available

1. Marketplace card shows installed and remote versions.
2. Persona update may happen automatically if enabled and trusted.
3. MCP update shows Update available unless safe auto-update is enabled.
4. Manual update replaces old managed definition/package.

### Source removes an item

1. The next 2-hour metadata check detects the item is gone from the signed source catalog.
2. MaveCode hides that item from Marketplace.
3. If locally installed from that source, MaveCode schedules background cleanup.
4. Cleanup disables the persona/MCP and deletes marketplace-managed local storage.
5. UI stays responsive throughout cleanup.

## 20. Implementation phases

### Phase 1: Rewrite schemas and settings

- Add marketplace source settings.
- Add root source manifest schema.
- Add version/update/source metadata to persona and MCP types.
- Add source status and update status to extension state.

### Phase 2: Multi-source cache manager

- Replace hardcoded single catalog URLs with configurable sources.
- Official `MaveCode-MarketPlace` source is default.
- Load cache first.
- Refresh in background.
- Support 2-hour metadata throttle.

### Phase 3: Persona package migration

- Publish exact Standard and Enphase files to `MaveCode-MarketPlace`.
- Add replace-only installed persona storage.
- Remote official Standard/Enphase override bundled fallback when verified.
- Standard required/non-removable.
- Enphase migratable and installed by default.

### Phase 4: MCP migration

- Publish MCP listings to `MaveCode-MarketPlace`.
- Keep bundled YAML fallback.
- Add MCP version/update metadata.
- Implement replace-only managed MCP updates with secret preservation.

### Phase 5: UI

- Add Marketplace settings below Email Testing.
- Add source management UI.
- Add Marketplace Personas/MCP tabs.
- Add version and `updated 10 mins ago` display.
- Add update/source badges.
- Add header/banner notifier.

### Phase 6: Removal/revocation handling

- Detect removed items during 2-hour metadata checks.
- Add removed/remotely unavailable badges.
- Add signed revocation support.
- Add local cleanup for removed optional items.
- Ensure removed source/item cleanup hides Marketplace cards and deletes local marketplace-managed storage in background.

### Phase 7: QA

- cache-first startup
- marketplace offline
- invalid source URL
- invalid signature
- duplicate source URL
- Standard fallback
- Enphase installed by default
- Enphase source/item cleanup behavior
- replace-only update storage
- same version different hash rejection
- removed item cleanup
- MCP parameter preservation
- source-specific error isolation
- no UI blocking on startup/Marketplace open
- Marketplace-open refresh progress bar remains responsive
- source removal cleanup disables/deletes source items in background
- remote item removal cleanup disables/deletes removed items in background
- operation state survives webview reload
- Windows file-lock retry/rollback recovery
- `safeWriteJson()` usage for marketplace JSON metadata writes

### Phase 8: MaveCode-MarketPlace publishing workflow

- Create or update the public `MaveCode-MarketPlace` repo.
- Copy Standard source files from current bundled Standard into `personas/standard` word-for-word.
- Copy Enphase source files from current bundled Enphase into `personas/enphase` word-for-word.
- Copy MCP source listings into maintainable per-item or source files under `mcps/items`.
- Add marketplace build scripts that compile source files into signed published catalogs/packages.
- Add CI checks for schema validation, package parity, secret scanning, JSON validation, hash generation, size limits, and signature generation.
- Commit marketplace source changes through normal Git commits in `MaveCode-MarketPlace`.
- Push commits to the public repo.
- CI publishes signed catalogs/packages after merge to the configured production branch.
- MaveCode extension receives changes through 2-hour background checks, Marketplace-open refresh, or manual Refresh.

## 21. How updates are made from VS Code and published to MaveCode-MarketPlace

Marketplace content updates should be made in the public `MaveCode-MarketPlace` repo, not directly in the private extension repo after migration.

### Updating Standard or Enphase rules/references

1. Open the local clone of `MaveCode-MarketPlace` in VS Code.
2. Edit the persona source files:
   - Standard: `personas/standard/persona.yaml`, `personas/standard/rules/*`, `personas/standard/references/*`, `personas/standard/validators/*`, `personas/standard/qa/*`, `personas/standard/scripts/*`.
   - Enphase: `personas/enphase/persona.yaml`, `personas/enphase/rules/*`, `personas/enphase/references/*`, `personas/enphase/validators/*`, `personas/enphase/qa/*`, `personas/enphase/scripts/*`.
3. Preserve existing syntax, wording style, file order, and behavior unless intentionally changing that persona.
4. Bump the persona version for every content change, including rules, references, QA definitions, validators, scripts, helper files, and metadata.
5. Run marketplace validation/build locally.
6. Review generated package/catalog diffs.
7. Commit with a clear message such as `Update Enphase persona link QA rules`.
8. Push to `MaveCode-MarketPlace`.
9. Open/merge PR or push to the configured release branch depending on repo policy.
10. CI builds signed packages/catalogs and publishes them.
11. Installed MaveCode clients discover the update through background refresh or Marketplace refresh.

### Updating MCP listings

1. Open `MaveCode-MarketPlace` in VS Code.
2. Edit MCP source files under `mcps/items` or the chosen MCP source folder.
3. Keep tokens/secrets as placeholders only.
4. Validate every MCP template as one MCP server config object.
5. Bump the MCP version for template/content changes.
6. Run marketplace validation/build locally.
7. Commit and push.
8. CI compiles source MCP files into one signed published `mcps.json` catalog.
9. MaveCode clients show updated MCP listing metadata after refresh.
10. Installed managed MCP definitions are replaced only through manual update or safe auto-update rules.

### Local validation commands concept

Exact commands can be finalized when the new repo exists, but the repo should provide scripts like:

```text
pnpm install
pnpm run validate
pnpm run build:marketplace
pnpm run test
```

Validation must check:

- all required Standard files exist
- all required Enphase files exist
- file order is stable
- no required rule/reference/QA file was dropped
- JSON schemas pass
- MCP templates parse as valid JSON objects
- MCP source files and signed catalog have matching item counts
- MCP catalog order is deterministic by ID
- MCP placeholders use uppercase `{{PLACEHOLDER_KEY}}` syntax
- package versions match catalog versions
- every content change has a version bump
- generated SHA-256 and package sizes match catalog
- signatures verify with public key
- no secrets are present, including JWT-like tokens and known demo-token data

### Extension-side update reception

MaveCode extension does not need a VSIX release for persona/MCP content-only updates.

Client update flow:

1. Load cached/bundled content immediately.
2. Run background metadata check every 2 hours.
3. On Marketplace open, show cached content and a responsive progress bar while checking freshness.
4. Download full packages only for installed items with verified newer versions or repair actions.
5. Verify package signature, hash, size, schema, required files, and persona QA metadata.
6. Atomically replace local `current` package.
7. Delete old active storage after successful replacement.
8. Refresh Marketplace/persona/MCP state.
9. Show header banner update status.

### Code safety rule

Marketplace packages can include code/script/Python files as persona assets. They are installed locally with the full persona package. They must not auto-run during install/update. Any future execution must be implemented by extension code with explicit permission, sandboxing/constraints, source trust, and visible user action.

## 22. Final intended UX

Normal users should experience this as simple and safe:

- MaveCode opens fast.
- Ask, Code, Standard, and Enphase are always available.
- Marketplace has clear Personas and MCP Servers tabs.
- Settings lets users add multiple marketplace sources.
- Marketplace cards show version and relative updated time.
- Updates are quiet and background-first.
- Users only see small header banners when installed items update.
- Enphase comes installed by default.
- Removed source/items disappear from Marketplace after removal is known.
- Old installed versions are replaced, not duplicated.
- Broken/offline sources do not break MaveCode.
- Public `MaveCode-MarketPlace` remains the transparent source of truth even if the extension repo becomes private.

## 23. Current extension-side Settings behavior

The extension Settings page contains a Marketplace section below Email Testing. The section is wired through `SettingsView` local `cachedState`; inputs never bind directly to the live `useExtensionState()` object. Source edits therefore remain buffered in the settings form until the user clicks Save.

Implemented source behavior:

- `marketplaceSources` is part of persisted global settings and extension state.
- The official source is provided by the default settings fallback and is always merged into runtime source resolution.
- The UI accepts only HTTPS marketplace manifest URLs.
- The UI normalizes URLs before duplicate checks, so whitespace and URL canonicalization do not create duplicate entries.
- The extension host re-normalizes on persistence, drops non-HTTPS/invalid source URLs, and de-duplicates by normalized URL as a defense-in-depth guard.
- Each source can be enabled/disabled. Disabled sources are kept in settings but do not participate in remote refresh.
- `trusted`, `official`, `lastVerifiedAt`, and `lastError` are retained as source status fields.
- Source status is displayed inline: official sources show verified official status; trusted custom sources show trusted custom status; untrusted custom sources show that first successful verification/trust is still required; verification time and last errors are appended when present.

Remove and cleanup behavior:

- Only non-official sources expose Remove in the current UI.
- Remove requires confirmation with copy explaining that local marketplace-managed Personas and MCPs from the source will be disabled/deleted, Standard and Enphase fall back to bundled copies if required, and cleanup runs in the background.
- Confirming removal removes the source from cached settings state only. Physical cleanup is deferred until Save.
- On Save, the extension compares previous persisted source IDs against the submitted source IDs and schedules background cleanup for removed IDs.
- Cleanup calls persona managed-storage removal and MCP source-cache removal for the source, then invalidates persona cache.
- Cleanup does not block Settings save, Marketplace refresh, chat, or extension startup. Failures are logged as cleanup failures.
- Standard and Enphase marketplace-managed copies are removed only from marketplace-managed storage; bundled fallback remains available for required/default behavior.

## 2 Sep 2026 — Per-category official sources, skills marketplace UX, batch enable/disable, alwaysEnabled

**IMPLEMENTED.** Marketplace-repo and extension-side changes shipped together; no persona/skill/MCP content files were changed (current signed versions stay standard 1.2.21 / enphase 1.3.20).

- Three per-category signed root manifests are now published at the repo root alongside the legacy combined `marketplace.json`:
    - `marketplace-personas.json` → id `official-mavecode-personas`, `personasCatalogUrl` only.
    - `marketplace-skills.json` → id `official-mavecode-skills`, `skillsCatalogUrl` only.
    - `marketplace-mcps.json` → id `official-mavecode-mcps`, `mcpsCatalogUrl` only.
    - Each is signed with `mavecode-marketplace-2026-01` and validated by `scripts/validate-marketplace.mjs`. Official URLs: `https://arkofheavean.github.io/MaveCode-MarketPlace/marketplace-personas.json`, `.../marketplace-skills.json`, `.../marketplace-mcps.json`.
- Extension Settings now shows three per-category source lists (Personas, Skills, MCPs), each with its own non-removable official entry pointing at its distinct manifest URL. Disabling one official source affects only that catalog. The legacy `official-mavecode` entry is migrated one-shot into the three per-category entries; the legacy combined `marketplace.json` remains published for older clients.
- Official source toggle semantics: toggling an official source off shows an inline confirm hint (not a modal) — e.g. "Marketplace skills will be hidden and disabled until re-enabled." Items from that source are hidden and force-disabled, never deleted; per-item enabled state is preserved and restored exactly on re-enable (only items the user had enabled come back enabled).
- Skills marketplace cards are toggle-only (no remove/trash action), and skills can be auto-invoked by the AI only while enabled: disabled marketplace skills are excluded from mode skill lists and `getSkillContent` returns null for them.
- New optional catalog item field `alwaysEnabled` (personas, skills, MCPs): when true, the item auto-enables on install/update via tri-state enabled storage (auto-on / user-on / user-off). A user disable is sticky — the item stays off across updates until the user manually re-enables it.
- All three Marketplace tabs support multi-select batch enable/disable: select mode with select-all, selection count, Enable/Disable selected, and Cancel; batch runs sequentially, continues after per-item failures, and reports failures in a single aggregated error toast.

## 1 Sep 2026 — Enphase 1.3.16: header/footer country selection + SFMC anchor rule hardening

**IMPLEMENTED.** Enphase persona bumped to 1.3.16 with the following content changes (no extension-repo changes required):

- `references/Header and Footer Blocks.md`: footer table trimmed to only footers that correspond to an available header; added a Header ↔ Footer Correspondence table, Selection & Fallback Rules (detect country → swap both the `ContentBlockbyID` value AND the paired comment names; header+footer always travel as a country pair), and the US fallback rule — any requested country/language without a matching block uses `Header_Dark_Version1_EN` (196561) + `NA_Footer_Section` (171497). Greece (`EL`) and Malta (`MT`) have headers only and use the NA footer fallback.
- `rules/enphase-main-rules.md`: added the "Header and Footer Country Selection" section (same selection/fallback/comment-swap rules, `@utm_campaign` set per user instructions with `'UTM_Here'` placeholder only when no value is given); added the canonical anchor example, the `#` default href rule, the exact topmost AMPscript pattern `SET @CallCTA = CloudPagesURL(2683, "phone", URLEncode("+15109456752"), "utm_campaign", v(@utm_campaign))` with a phone-anchor example, and an explicit callout that span `font-family` (e.g. `'enphase-visuelt-semibold'`) is a blocking defect in every workflow.
- `figma/prompt-rules.json`: phone rule now carries the exact CloudPagesURL signature; added the `#` default-href rule and the header/footer country-selection + US-fallback rule (now 7 rules).
- `qa/figma-email-gate.json`: SFMC instruction expanded (default `#` href, @CallCTA declared before HTML, phone anchors with `conversion="true"`/`data-linkto="https://"`); new instruction verifying header/footer block IDs and paired comment names against the detected country with the US fallback.
- Machine validators (`validators/figma-email-gate.json`) unchanged — schemaVersion-3 rules already enforce anchors/UTM/sms/CallCTA/span-font-family mechanically.

Rebuilt and re-signed digests: standard@1.2.17 sha256 `eec742b2e01a8a18d400f52df6eda46cc5ec1b7377d8194aaa1ccc5bbf3baf20` (133600 bytes, unchanged), enphase@1.3.16 sha256 `7d0fd614c23a1bc18abb110b63e83d5ed289b1087fcce54f1f958d29712b700a` (306589 bytes). All signatures validated via `scripts/validate-marketplace.mjs`.

## 1 Aug 2026 plans

**Implementation status (1 Sep 2026): IMPLEMENTED.** All phases below are shipped in this repo (Standard 1.2.17, Enphase 1.3.15 with `figma/capability.json`, `figma/prompt-rules.json`, schemaVersion-3 validators/QA, rebuilt and re-signed catalogs) and in the extension repo (bundled persona fallbacks deleted, no-fallback bootstrap with 30s → 2m → 10m → 2h single-flight retry, generic package-driven Figma rule engine with fail-closed QA, `supportsFigma` capability defaulting to `false` and `true` only for Standard/Enphase). The rule engine now uses the schemaVersion-3 fully-rule-driven contract: `validators/figma-email-gate.json` assets are `schemaVersion: 3` `kind`-tagged JSON (`figma-email-html-gate`) containing only persona-owned `rules` typed by a closed 15-type engine (`forbidden-css-pattern`, `required-css-signature`, `required-class-mapping`, `anchor-attribute-policy`, `link-scheme-policy`, `url-query-policy`, `phone-tracking-policy`, `content-marker-leakage`, `forbidden-tag`, `forbidden-css-feature`, `required-tag-attributes`, `forbidden-inline-style-property`, `conditional-required-pattern`, `content-cell-height-policy`, `text-only-cell-width-policy`); the former built-in validator id vocabulary (`unsupported-code`, `shared-email-markup`, `image-alt-and-height`, `content-td-height`, `text-only-td-width`, `reference-sample-leakage`) is removed — those checks are now declared as ordinary rules in each persona package (Standard declares 19 rules, Enphase declares 20 rules including the 4 SFMC rules and its leakage markers). All Standard/Enphase mechanical check parameters (regex patterns, class mappings, attribute policies, issue codes, messages, leakage markers) live in this repo's persona packages, and `scripts/validate-marketplace.mjs` lints rule types, regex safety (max 2000 chars, must compile), duplicate rule ids, requires `schemaVersion: 3` with non-empty rules, and hard-errors on legacy keys (`validators` array, `sampleLeakageMarkers`). Remaining implementation deviation from the plan text below: the shipped `figma/skeleton.html` contract uses `{{TITLE}}` and `{{WIDTH}}` placeholders only (not `{{SUBJECT}}`/`{{PREHEADER}}`/`{{SECTIONS}}`).

**Skeleton removal update (1 Sep 2026, Standard 1.2.17 / Enphase 1.3.15): IMPLEMENTED.** The packaged `figma/skeleton.html` assets were deleted from both personas. Each persona now instructs the model - via the first rule in `figma/prompt-rules.json` - to build the email starting from the exact boilerplate of its approved master reference (`references/master_template.html` for Standard, `references/Enphase_Main_Reference.html` for Enphase), with sample content blocks still forbidden as content sources. The `persona-skeleton` feature entry was removed from both `figma/capability.json` files, and `scripts/validate-marketplace.mjs` now treats `figma/skeleton.html` as optional (size/placeholder checks run only when present). The extension is unchanged: the optional package-skeleton mechanism remains supported for future personas, and with no packaged skeleton the generic persona-neutral fallback skeleton seeds the output HTML file. Rebuilt and re-signed digests: standard@1.2.17 sha256 `eec742b2e01a8a18d400f52df6eda46cc5ec1b7377d8194aaa1ccc5bbf3baf20` (133600 bytes), enphase@1.3.15 sha256 `7b6fc1b99968777a5bd27a147c2fb1e74b46e5333942dde36d7573c2a815fd11` (245437 bytes).

Planned direction: remove bundled persona fallbacks, bootstrap Standard/Enphase from the marketplace at install, move ALL persona behavior (prompts, skeletons, validators, QA, leakage markers) into marketplace persona packages only, keep the Figma workflow fully generic, and add a `supportsFigma` persona capability. Each edge case below includes its resolution. Where this heading conflicts with earlier bundled-fallback sections above, this heading is the newer intent.

### Phase 0: Frozen package contracts

Per-persona optional Figma assets inside each marketplace persona package:

- `figma/capability.json`: `{ "schemaVersion": 1, "supportsFigma": true, "features": { "emailSkeleton": true, "promptRules": true, "emailQa": true } }`
- `figma/prompt-rules.json`: `{ "schemaVersion": 1, "rules": ["...persona constraint prose..."] }` (max 100 rules, 2,000 chars each)
- `figma/skeleton.html`: template with fixed placeholders (`{{SUBJECT}}`, `{{PREHEADER}}`, `{{WIDTH}}`, `{{SECTIONS}}`), max 512 KB
- `validators/figma-email-gate.json`: rule instances of a closed engine rule-type set: `forbidden-css-pattern`, `required-css-signature`, `required-class-mapping`, `anchor-attribute-policy`, `url-query-policy`, `link-scheme-policy`, `content-marker-leakage`, `phone-tracking-policy`
- `qa/figma-email-gate.json`: QA instructions (max 50 x 2,000 chars) + `sampleLeakageMarkers` (max 200, each 4-500 chars)

Contract edge cases (resolved):

- Missing capability file / missing or non-boolean `supportsFigma` -> resolve to `false`; never throw; log once per persona per session.
- Unknown `schemaVersion` newer than extension -> treat capability as unsupported and surface "persona requires a newer extension"; never crash.
- Over-cap prompt rules -> truncate with logged warning; generation continues.
- Unknown placeholder in skeleton -> fill empty + warning; missing skeleton -> generic base skeleton.
- Unknown validator rule `type` -> skip rule, record in `skippedRules` in the QA summary; never claim it ran.
- Regex rule params -> publish-time lint (length cap 2,000 chars, no catastrophic patterns) plus runtime compile guard with 1s per-rule budget; compile failure -> skip rule + warning.
- Duplicate rule ids in one package -> publish-time error; runtime last-one-wins + warning.
- Leakage markers shorter than 4 chars -> rejected at publish (false-positive prevention).

### Phase 1: Marketplace repo changes (who gets what)

- Standard: capability(true), dark-mode prompt rules (approved stylesheet + color-scheme, dark-mode meta tags, fluid `em_main_table` width:100% !important, class mapping `em_darkbg`/`em_dm_txt_white`/`em_dm_txt_black`/`em_lightbg`, CTA/link mapping, no local-folder discovery), Standard skeleton (with dark-mode CSS), shared validators + `standard-fixed-mobile-width`/`standard-dark-mode-css`/`standard-dark-mode-classes` rule instances, Prodigy leakage markers ("Prodigy Education", "get.prodigygame.com", "ProdigyGame").
- Enphase: capability(true), SFMC prompt rules (anchor conversion/data-linkto/title/alias + target="_blank" for web links, `utm_campaign=%%=v(@utm_campaign)=%%` with ?/& rules and no duplicates, mailto/sms conversion="false" data-linkto="other", `@CallCTA` CloudPagesURL + RedirectTo phone tracking), Enphase skeleton (no Standard dark-mode CSS), shared validators + `enphase-sfmc-anchor-attributes`/`enphase-mail-sms-link`/`enphase-url-utm`/`enphase-phone-tracking` rule instances, Enphase campaign leakage markers.
- All other/future personas: no Figma assets; `supportsFigma` false by default; Figma option disabled; enabling later requires only a marketplace package, no extension release.
- `validate-marketplace.mjs`: schema-validate all assets, enforce official whitelist (`supportsFigma: true` only for standard/enphase in official CI), regex-lint rule params, fail unknown rule types against `schemas/rule-types.json`.
- Versions: Standard -> 1.2.14, Enphase -> 1.3.12; rebuild, re-sign packages/catalog/root; commit child main.

Edge cases (resolved): package declares `emailQa: true` but ships no validators -> publish-time error. `supportsFigma: true` with no skeleton/prompt-rules -> allowed (feature flags describe what is present). Third-party source setting `supportsFigma: true` -> allowed for that source's signed catalog; official whitelist applies to official CI only; user trust decision was made when adding the source.

### Phase 2: No-fallback bootstrap

- On activation, if `managed-personas/installed/official/{standard,enphase}/current.mavepersona` are missing, run a background bootstrap: forced refresh (bypasses 2h throttle once), verified install of both, enable both, post refreshed state to webview. Never blocks activation.
- Delete `src/assets/personas/` and `BundledPersonaManager`; remove `BUNDLED_PERSONAS` and `bundledFallback` fields/badges. Supersedes prior bundled-fallback rules in this document.

Edge cases (resolved):

- First run offline -> mode picker shows "Standard (downloading...)" placeholder; provider mode fallback tolerates zero personas by degrading to a built-in generic mode; retry backoff 30s -> 2m -> 10m -> normal 2h cycle; re-attempt on webview launch and Marketplace open.
- Partial bootstrap (one persona installs, the other fails) -> enable the successful one, keep retrying the other, never block.
- Signature/digest failure -> treated as fetch failure with distinct error code; never install unverified bytes; retry later.
- Corrupted `current.mavepersona` on disk -> validate JSON+digest on read; restore `.previous.rollback` if valid, else delete and re-bootstrap.
- Official source removal -> blocked in Settings (Standard is required); inconsistent state re-adds the default official source on next activation.
- Concurrent activations -> single-flight promise guard; staged `.next.tmp` writes make races non-corrupting.
- Update during active task -> active tasks keep their pinned persona snapshot; bootstrap/updates apply to future tasks only.

### Phase 2.5: supportsFigma capability

Goal: every persona declares Figma support; default `false`; only Standard and Enphase ship `true`; `false` makes the Figma option and workflow unusable with that persona.

- Declaration: `figma/capability.json` compiled into a top-level optional boolean on `package.mavepersona.json`; boolean type enforced at publish; runtime non-boolean coerces to `false` + warning.
- Propagation: `ModeConfig.supportsFigma?` from the verified package -> mode state -> webview extension state modes.
- Enforcement (defense in depth, in order): (1) webview hides/disables the Figma option with tooltip; (2) Figma selection message hard-rejects for unsupported personas (stale-webview backstop); (3) Figma context resolution/injection returns nothing and clears lingering selection; (4) generation gate/mention flow blocks; (5) completion Figma QA is skipped entirely for unsupported personas. The flag is always read from the task-pinned persona snapshot.

Edge cases (resolved):

- Absent file/field or pre-schema package -> `false`; no warning spam.
- Custom/imported/.roomodes modes never default to `true`; a user hand-adding `supportsFigma: true` to their own custom mode is allowed (same trust level as any custom mode) and unlocks only generic Figma behavior without persona assets.
- Pending bootstrap -> flag unknown is gated like `false` but with the message "persona is still downloading" instead of "does not support Figma"; option enables live once bootstrap completes via state repost.
- Corrupt capability.json inside a signed package -> coerce `false`, log distinct error, hint Manual Refresh repair.
- Mode switch with pending Figma selection to an unsupported persona -> selection cleared with notice.
- Mid-task switch supported -> unsupported: already-injected context stays in pinned history; new Figma actions and completion QA follow the active persona; dedupe marker prevents duplicates. Unsupported -> supported re-enables normally.
- Persona update flips true -> false: future tasks lose Figma; active tasks keep the pinned snapshot until completion.
- Rollback restores whichever snapshot is active; the flag always reads from the loaded snapshot.
- Duplicate persona id across sources -> source precedence (official > custom) decides; losing package's flag is never merged.
- Export/import of modes carries the field verbatim; it unlocks only generic plumbing.

### Phase 3: Generic Figma engine in the extension

- Validator keeps only always-on generic safety (global email markup + unsupported-code checks) plus a parameterized `runPackageRules(html, rules)` engine implementing the closed rule-type set. Delete `validateStandardDarkMode`, `validateEnphaseMarkup`, `hasEnphasePhoneTracking`, `FALLBACK_PERSONA_SAMPLE_MARKERS`, `fallbackPackageQa`.
- `package-qa.ts` drops hardcoded persona-id unions; validates by rule type; loads capability/prompt-rules/skeleton with caps; keeps size+sha256 verification.
- AI context and plugin-local artifact builders drop `"standard"` defaults and persona prose; emit generic shared rules + package prompt-rules verbatim.
- Persona email skeleton becomes a single generic builder with optional package template fill.
- Gate order on Figma trigger: persona active? -> package installed (bootstrap done)? -> `supportsFigma === true`? -> QA assets parse? Corrupt QA assets in a valid package fail closed (block generation; never generate with weaker QA).

Edge cases (resolved): mid-task persona update cannot change rules (QA reads the pinned package); `supportsFigma: true` with no validators runs generic checks only and states so in the QA summary; enormous HTML bounded by a 5s total regex budget with over-budget rules reported as skipped; same-chat Figma follow-ups keep the dedupe marker so context and prompt-rules inject once.

### Phase 4: Parity gate before deletion

- Snapshot today's issue codes for existing Standard/Enphase validator test samples; package-driven engine with real package fixtures must produce identical codes before fallback deletion.
- Engine unit tests per rule type (match/no-match, malformed params, unknown-type skip, regex timeout, duplicate ids); loader tests (corrupt package, oversized assets, unknown schemaVersion, missing capability); bootstrap tests (fresh, offline retry, partial, corrupt+rollback, single-flight); UI tests (hidden option, downloading placeholder, blocked messages); round-trip tests for the flag with both `true` and unset personas.

### Phase 5: Rollout order (main only, no branches)

1. Child: new assets + script support + version bumps.
2. Parent: loaders + engine added beside existing fallback (engine preferred when assets present).
3. Parent: bootstrap + remove bundled assets/BundledPersonaManager.
4. Parent: delete persona fallback logic + tighten package-qa types + fail-closed gating (only after parity suite is green; separate final commit for bisectability).
5. Both: update this heading in `marketplace.md` and `marketplace info.md` as phases land.
