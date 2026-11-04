# lit-repo

Gainsight Developer Studio project for the Gainsight CC Widget Catalog.

## Prerequisites

- Node.js >= 18
- [@gainsight-hub/developer-studio-cli](https://www.npmjs.com/package/@gainsight-hub/developer-studio-cli) installed globally:

```sh
npm install -g @gainsight-hub/developer-studio-cli
```

## Widgets (primary)

Widgets are the main artifact this project produces — each renders in its own container on a community page.

```sh
gsds login <pairing_code>       # authenticate first - preview and connector test both require a session
gsds create                     # scaffold a widget (interactive)
gsds preview                    # start a dev server and pair with CC Widget Catalog
gsds list                       # list widgets, connectors, scripts and stylesheets
gsds connector test <name>      # smoke-test a widget's connector against your tenant
```

Get a pairing code from the Gainsight "Connect CLI" flow. It has a 2-minute TTL; the session it grants lasts ~8 hours.

## Sitewide scripts & stylesheets (optional)

Scripts and stylesheets are injected on every rendered page (or scoped via `rules`) — for analytics, shared utilities, custom fonts, theming. They are optional; a project with only widgets is valid.

`gsds script new` / `gsds style new` create a local file (`script.js` / `style.css`) and add the entry to `extensions_registry.json` in one step. `gsds script link` / `gsds style link` add an external CDN entry without creating any file. All metadata (`placement`, `attributes`, `rules`) lives on the registry entry itself.

```sh
gsds script new <name> [--placement head|bodyStart|bodyEnd] [--attr key=value]
gsds script link <url> [--name <slug>] [flags above]
gsds style  new <name> [--attr key=value]
gsds style  link <url> [--name <slug>] [flags above]
```

## Building & CI

```sh
gsds build                      # rebuild every widget + validate/normalize the registries
gsds build --validate           # verify the registries are in sync with source; exits 1 on drift
```

**Before you commit widget source changes, run `gsds build`** at the project root. It rebuilds every widget's `dist/` and rewrites the registries in normalized form.

`gsds build --validate` compares the registries against source and exits 1 on drift, which makes it a good CI check — wire it into your own pipeline. Note it does **not** rebuild `dist/`, so it cannot detect a stale `dist/`; run `gsds build` before committing.

## Layout

```
lit-repo/
├── .gitignore                    # ignores .gsds/, node_modules/, *.tmp and *.lock; deliberately keeps widgets/*/dist/
├── README.md                     # this file
├── AGENTS.md                     # AI agent working rules (defer to developer-portal.gainsight.com/docs)
├── gsds.json                      # Gainsight Developer Studio project metadata AND project-root marker for the `gsds` CLI
├── extensions_registry.json      # committed source of truth (hand-authored widgets; scripts/styles managed via `gsds script`/`gsds style`; validated and normalized by `gsds build`)
├── connectors_registry.json      # committed source of truth (hand-authored; validated and normalized by `gsds build`)
├── widgets/<name>/               # per-widget sources (entry declared in extensions_registry.json)
│   └── dist/                     # build output; MUST be committed - the platform serves widgets from here
├── scripts/<name>/               # optional sitewide JS scripts (local script.js file only; metadata lives in the registry)
└── stylesheets/<name>/           # optional sitewide CSS stylesheets (local style.css file only; metadata lives in the registry)
```

`gsds.json` marks the project root - run `gsds` commands from inside this directory or a subdirectory (e.g. `widgets/<name>/`); the CLI walks up from your current directory to find it.

## Platform documentation

Local repo docs cover only the tooling. The widget-service platform itself — the `extensions_registry.json` widget entry schema, the Widget SDK, connector authentication, Jinja2 templates, publishing — lives online:

- LLM-optimized full text: https://developer-portal.gainsight.com/docs/llms-full.txt
- Human-readable: https://developer-portal.gainsight.com/docs
