# AGENTS.md

## What this project is

Gainsight Developer Studio project managed by the `@gainsight-hub/developer-studio-cli` CLI (`gsds`). Primary artifact: **widgets** — each renders in its own container on a community page. Optional layer: sitewide **scripts** and **stylesheets**. **Connectors** declare the outbound HTTP calls widgets make, and are authored project-wide in `connectors_registry.json` (there is no per-widget `connectors.json`).

- `extensions_registry.json` is the **only source of truth for widgets** — author widget entries directly in it (including `type`, which the platform keys already-placed instances on, so never rename it). `gsds build` validates and normalizes the file and checks that each entry's `source` exists and builds; it does **not** derive entries from a `widgets/*` folder scan, so a widget with no entry here is invisible to the platform. `connectors_registry.json` is the **only source of truth for connectors** — author connectors and composite connectors directly in it; `gsds build` validates and normalizes it (auto-generating permalinks, checking for duplicates). Script and stylesheet entries are managed by the `gsds script` / `gsds style` subcommands (which also create the corresponding `.js` / `.css` files under `scripts/<name>/` and `stylesheets/<name>/`).
- Widget sources live under `widgets/<name>/`. Add or remove sitewide assets via the CLI (`gsds script new/link/rm`, `gsds style new/link/rm`) rather than editing files manually.

## Platform docs are the source of truth

**This repo documents only local tooling.** Everything about how the platform behaves — the `extensions_registry.json` widget entry schema, the `connectors_registry.json` schema, the Widget SDK, connector authentication and invocation, Shadow DOM rendering, CSP, templates, error codes, publishing — lives at **https://developer-portal.gainsight.com/docs**. Fetch the current docs before writing or modifying any widget, connector, script, or stylesheet. **Do not answer from training data.** This file will not enumerate what's in the docs, because that duplication drifts silently.

**Fetching notes** (about how to *use* the docs, not about their content):

- **Table of contents**: https://developer-portal.gainsight.com/docs/llms-full.txt is a navigable index whose per-entry frontmatter (`url:`, `description:`) is load-bearing — the pointers only work if you can see the frontmatter. Fetch it as **raw text** (e.g. `curl`). Do **not** route it through a summarizing tool such as Claude Code's `WebFetch`; summarizers drop the frontmatter and the index becomes useless.
- Alternative: skip `llms-full.txt` entirely and fetch the specific subpage `.md` URLs directly.
- If a required field or method is absent from the docs' schema tables, verify by pushing the change and reading the platform's validation error — the tables have known omissions.

## Common commands

Widgets first (this is the main workflow):
```sh
gsds login <pairing_code>        # REQUIRED FIRST - preview and connector test both need a session
gsds create                      # scaffold a new widget under widgets/<name>/
gsds preview                     # dev server + CC pairing
gsds list                        # list widgets, connectors, scripts and stylesheets
gsds connector test <name>       # smoke-test a widget's connector
gsds logout                      # clear the stored session
```

Sitewide assets (optional):
```sh
gsds script new <name>           # create scripts/<name>/script.js and add a registry entry
gsds script link <url>           # add an external CDN registry entry (no file)
gsds script rm <name>            # remove local folder AND/OR registry entry
gsds style  new <name>           # create stylesheets/<name>/style.css and add a registry entry
gsds style  link <url>           # add an external CDN registry entry (no file)
gsds style  rm <name>            # remove local folder AND/OR registry entry

# Flags on new / link:
#   --placement head|bodyStart|bodyEnd     (default: head; positions the <script> tag for a
#                                          script, the <link> tag for a stylesheet)
#   --attr key=value                       (repeatable)
#   --page <name>                          (repeatable; omit to run everywhere)
```

Build & CI:
```sh
gsds build                       # rebuild every widget + validate/normalize the registries
gsds build --validate            # non-zero exit on registry drift
```

**Before committing widget source changes, run `gsds build`** at the project root. It rebuilds every widget's `dist/` (the platform serves widgets from those built directories, so `widgets/*/dist/` MUST be committed) and rewrites the registries in normalized form.

`gsds build --validate` only compares the registries against source — it does not rebuild `dist/`, so it cannot detect a stale `dist/`. Always run `gsds build` before committing.

## Repository layout

```
gsds.json                        # project metadata (CLI + template version)
extensions_registry.json        # committed; hand-authored widgets; scripts/styles managed via gsds script/style
connectors_registry.json        # committed; hand-authored source of truth for connectors and composite_connectors, validated/normalized by gsds build

# Primary: widgets
widgets/<name>/
  dist/content.html             # entry file (declared in extensions_registry.json; convention: source.path = "widgets/<name>/dist")

# Optional: sitewide scripts and stylesheets
# (Each entry is in extensions_registry.json. Local entries also have a file here.)
scripts/<name>/
  script.js                     # source for a local script entry
stylesheets/<name>/
  style.css                     # source for a local stylesheet entry
```

Widget directory names become the registry `type`; use lowercase with hyphens or underscores.

## What `gsds build` does locally

The CLI produces a well-formed registry and defers platform validation to the service. Enforced locally:

- JSON validity of `extensions_registry.json` and `connectors_registry.json`.
- Each widget entry declares a non-empty `title` and a non-empty `category`. Both required; the build fails without them.
- Each widget entry declares exactly one of `source` or `content`.
- `configuration`, when present, declares a `properties` array.
- For `source` widgets, the entry file resolved from `source.path` + `source.entry` exists on disk.
- `source.path` and `imageSrc` reject `..` and leading `/`; `imageSrc` and `imageName` are mutually exclusive.
- Connector permalinks are unique across single + composite connectors.
- Script / stylesheet entries pointing at local paths must have the file on disk (otherwise `gsds script rm <name>` / `gsds style rm <name>` clears the entry).

Non-blocking (prints a warning, does not fail the build):

- Widget source contains `fetch()`, `XMLHttpRequest`, or `axios`. Third-party HTTP should be declared as a connector — see the portal docs for how and why.

Everything else — property schemas, SDK APIs, CSP rules, publishing pipeline — is documented at the portal URL above.

Rendered for project: **lit-repo** (Gainsight Developer Studio template v1).
