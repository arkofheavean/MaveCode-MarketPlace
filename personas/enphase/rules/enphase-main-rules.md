# Enphase Email Development Rules

The client is Enphase, and the work is email marketing development.

Use [`references/Enphase_Main_Reference.html`](../references/Enphase_Main_Reference.html), [`references/css1.txt`](../references/css1.txt), and [`references/css2.txt`](../references/css2.txt) as the only approved sources of HTML structure, typography, and CSS behavior. Reuse only CSS classes and behavior already present in those references. Do not create, invent, or extend CSS behavior or helpers. If the approved references do not cover a requirement, report the gap to the user for human review rather than adding CSS.

The approved references are pattern libraries, never campaign-content sources. Reuse only their skeleton, table hierarchy, CSS, classes, and implementation techniques. Do not copy sample headings, body copy, product claims, prices, disclaimers, CTA labels, phone numbers, personalization strings, URLs, tracking parameters, hosted image URLs, or complete campaign blocks unless that exact content/block is independently present in the task's primary reference or explicitly requested by the user. Enphase brand-level styling does not authorize copying an example campaign's content.

A block's presence in an approved reference does not authorize adding that block. Include a header, hero, text section, feature list, pricing card, CTA, legal section, or footer only when the primary Figma/user reference contains it or the user explicitly requests it. Replace every disposable sample value with task-source content; if required content is unavailable, report it as missing instead of retaining or inventing reference content.

All email tables must use valid `table > tr > td` nesting. Never place a `td` directly under a `table` or place a `tr` under a `td` without an intervening table.

## Primary Operating Rule

Before coding, read [`rules/main_config.md`](main_config.md) and the approved references. When only blocks are requested, return complete table-based block markup inside the appropriate paired comments, without adding an unnecessary full document shell.

Use `px` on every nonzero CSS length in a padding declaration. Write zero as `0px`.
Use `target="_blank"` for links intended to open a new window.
Give every anchor meaningful `alias` and `title` values matching its visible label. Every Enphase anchor must include `conversion`, `data-linkto`, `href`, `title`, and `alias`; web links also require `target="_blank"`. These anchor rules apply in every workflow, Figma or not. Canonical example:

```html
<a alias="cta_name" title="cta_name" conversion="true" data-linkto="https://" href="#?utm_campaign=%%=v(@utm_campaign)=%%" style="color:#000000;text-decoration:none;" target="_blank">CTA Text</a>
```

Do not use `letter-spacing` in Enphase reference-derived markup.
Construct each static tracked URL with one query string and no duplicate `utm_campaign` parameter.
When a real destination URL exists, use it; when none is provided, use `#`. Static web URLs must append `utm_campaign=%%=v(@utm_campaign)=%%` with `?` when no query exists and `&` when a query already exists. Do not append campaign UTM values to `mailto:` or `sms:` links; those links use `conversion="false"` and `data-linkto="other"`.
If any phone number appears anywhere in an Enphase email, declare `@CallCTA` in AMPscript before the HTML document starts (topmost), using this exact pattern with the actual phone number:

```
%%[
SET @CallCTA = CloudPagesURL(2683, "phone", URLEncode("+15109456752"), "utm_campaign", v(@utm_campaign))
]%%
```

Then every phone-number anchor must use `href="%%=RedirectTo(@CallCTA)=%%"` with `conversion="true"` and `data-linkto="https://"`, for example:

```html
<a alias="+31(0)85 20 823 05" conversion="true" data-linkto="https://" href="%%=RedirectTo(@CallCTA)=%%" style="color:#000000; text-decoration:underline;" title="+31(0)85 20 823 05">+31(0)85 20 823 05</a>
```

Spans may use numerical styling such as `font-weight:700`, italic, underline, colour, or nowrap, but spans must never carry a `font-family` declaration in any workflow — for example `font-family:'enphase-visuelt-semibold', Arial, sans-serif;` on a span is a blocking defect. The parent text cell owns the Enphase font family, font size, and line height.

Never wrap an `<a>` in a `<span>` whose only purpose is styling (colour, underline, weight, or other decoration). The anchor must carry its own complete inline style directly. A span around an anchor is permitted only when it carries a real inline difference that cannot live on the anchor itself (for example `white-space:nowrap` spanning mixed anchor and non-anchor content). A redundant styling span wrapper around an anchor is a blocking defect.

Bad code:

```html
<span style="color:#000000; text-decoration:underline;"><a alias="supportpagina" conversion="false" data-linkto="https://" href="https://support.enphase.com/s/article/optimizing-dynamic-tariffs-with-custom-rate-inputs?utm_campaign=%%=v(@utm_campaign)=%%" style="color:#000000; text-decoration:underline;" target="_blank" title="supportpagina">supportpagina</a></span>
```

Good code:

```html
<a alias="supportpagina" conversion="false" data-linkto="https://" href="https://support.enphase.com/s/article/optimizing-dynamic-tariffs-with-custom-rate-inputs?utm_campaign=%%=v(@utm_campaign)=%%" style="color:#000000; text-decoration:underline;" target="_blank" title="supportpagina">supportpagina</a>
```

## Header and Footer Country Selection

[`references/Header and Footer Blocks.md`](../references/Header%20and%20Footer%20Blocks.md) is the source of truth for header/footer `ContentBlockbyID` values. Detect the target country/language from the user's instructions or content, then select the matching header and its corresponding footer as a pair from that reference. Update BOTH the `%%=ContentBlockbyID("ID")=%%` value AND the paired comment names so the comments name the exact block used (e.g. `<!-- Header_Dark_Version1_FR Content Block Below -->` ... `<!-- //Header_Dark_Version1_FR Content Block below -->`). If the requested country/language has no matching block (or a header exists but no footer, e.g. Greece/Malta), fall back to the US pair: `Header_Dark_Version1_EN` (196561) and `NA_Footer_Section` (171497). Never mix one country's header with a different country's footer outside this fallback. Set the `@utm_campaign` AMPscript value per the user's instructions; keep the `'UTM_Here'` placeholder only when no campaign value is given.
Do not inspect or learn from same-folder outputs, sibling files, previous generated HTML, local examples, broad workspace files, or local templates unless the user explicitly permits that source.

## Where to build the active email

When Figma mode is selected in the extension, the active Enphase email build must stay inside the generated Figma workspace folder named with the current IST date/time first, followed by the selected node name, for example `[27-08-2026] [10∶30 PM] Enphase IQ Air/`. The timestamp uses a Windows-safe visual colon (`∶`) instead of the filesystem-forbidden ASCII colon. All assets and the pre-created `TemplateName.html` file live inside that folder; edit only that pre-created HTML file. Do **not** create `generated-emails/`, `references/`, copied templates, or any extra workspace-level folders for a Figma-mode build. Do **not** edit approved Enphase reference files.

When Figma mode is not selected or is disabled in the extension, identify the template title from the user's selected reference and confirm the title with the user first. After the user confirms the title, create a workspace folder named with the current IST date/time first, followed by the confirmed template title, for example `[DD-MM-YYYY] [HH∶MM AM/PM] TemplateName/`. The timestamp uses a Windows-safe visual colon (`∶`) instead of the filesystem-forbidden ASCII colon. Build `TemplateName.html` and all assets inside that folder.

## Mandatory Table-Cell Coding and QA Rules

Before finalizing, identify and reopen or reread the task's primary content/design reference. In Figma mode, the primary reference is the exported `reference-1x.png`, cross-checked with normalized Figma metadata and exported image assets. Outside Figma mode, use the user-provided screenshot, image, PDF, DOCX, text, brief, or other source identified by the user; when several sources exist, follow the user's stated priority or use the most complete source as primary and the others as supporting evidence.

Compare the primary reference with the final HTML from top to bottom. Verify that every visible or specified block, heading, paragraph, label, CTA, link, image, icon, legal line, and footer item appears once, in the correct order, with the correct content and role. For visual references, also compare hierarchy, section boundaries, columns, alignment, relative spacing, imagery, colours, and typography. For text/document references, compare wording, punctuation, capitalization, links, order, and completeness. Any omitted or duplicated block/content, invented replacement, wrong text/image, or materially wrong module type is a blocking defect. Do not claim fidelity without reopening or rereading the actual primary reference during final QA.

Inspect every user-provided input document (brief, copy doc, PDF, DOCX, text, or attachment set) for embedded or attached images and files before building. Inventory every embedded image, logo, icon, banner, and attached file; map each to its intended email module and use the actual provided asset in the build. If a provided asset cannot be used (missing, unreadable, or too low-resolution), report it to the user instead of silently skipping it, and never invent or substitute an unrelated asset in its place.

Scan the copy and brief for URLs before finalizing. Extract every URL present (CTA destinations, text links, social links, view-online, legal/unsubscribe, and any bare or annotated URLs), match each to its corresponding CTA, link, image link, or social icon, and wire it into the required Enphase link pattern (AMPscript variable plus `RedirectTo` where the workflow demands it, otherwise the real `href`). Do not leave placeholder link destinations (such as `#`, `URL_HERE`, or an empty href) when the brief or copy supplies the URL. If a link target is required but no URL exists anywhere in the provided inputs, flag it to the user rather than inventing one.

- Never use `colspan` in email template markup.
- Do not apply a `height` attribute, inline `height` CSS, or height utility class to any non-empty content `td`, except the actual CTA button cell. A dedicated empty spacer cell is the only other exception. Image, text, wrapper, column, card, header, footer, icon, and section cells are not spacer cells.
- Figma frame, section, component, and image bounds describe visual geometry and never authorize height on a content `td`. Reproduce ordinary vertical dimensions with natural content flow, line height, and cell padding.
- Never add a `height` attribute or inline `height` CSS to an `<img>` element. Keep explicit rendered width; metadata height is only for aspect-ratio verification and must not be emitted into markup.
- Do not apply a `width` attribute, inline `width` CSS, or a width-sizing utility to a `td` that contains only paragraph or body text. Its parent structural table or column must control the available width.
- A fixed width is allowed on a structural two-column or multi-column `td`, a small-icon cell, a bullet or numbered-list marker cell, a CTA button cell when required, or a dedicated spacer or gutter cell.
- Every `td`, including CTA, icon, bullet, spacer, gutter, wrapper, and body-text cells, must explicitly include both `align` and `valign` attributes.
- Every layout table must include `role="presentation"` unless it is intentionally semantic data.
- If VML uses `w:anchorlock`, the root `html` tag must include `xmlns:w="urn:schemas-microsoft-com:office:word"`.
- Every image must have an alt attribute: use exact visible image text when present, otherwise use the brand/company/product/object/platform name; empty alt is only for purely decorative images explained by adjacent live text.
- Remove generic empty placeholder comments from final output.
- Scan every anchor during final QA and reject any `<span>` that wraps an `<a>` purely for styling; the anchor must carry its full inline style itself.
- During QA, treat any violation of these table-cell rules as a blocking defect.
- Before completion, scan every opening `<td>` and `<img>` tag and reject the output until all prohibited heights are removed.
