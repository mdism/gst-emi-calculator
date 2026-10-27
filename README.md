# GST, EMI & SIP Calculator

Quick GST, EMI and SIP calculations with clear breakdowns: add or remove GST with the CGST/SGST or IGST split, loan EMI with a yearly schedule, and SIP growth with optional step-up.

**Live:** https://tools.shaikhismail.com/gst-emi-calculator/ · part of the [free tools](https://tools.shaikhismail.com/) by [Mohammed Ismail Shaikh](https://shaikhismail.com)

- 100% client-side: files and numbers never leave your browser
- Nothing is uploaded or saved; anything held while processing is temporary and deleted afterwards
- No analytics or ads; Cloudflare Turnstile keeps bots out
- No build step, works on phones, light and dark theme

## Run locally

Open `public/index.html` in a browser (the bot check is skipped when opened from disk), or serve the folder:

```
cd public
python -m http.server 8080
```

## Tests

The maths lives in `public/assets/js/calc.js`. Its tests need only Node 18 or newer, run from the repo root:

```
node --test
```

## Project layout

```
public/                 Everything that gets published to /gst-emi-calculator/
├── index.html          The page
├── privacy.html        Privacy policy for this tool
└── assets/
    ├── fonts/          JetBrains Mono, self-hosted (OFL)
    ├── css/tool.css    Shared look (same tokens as shaikhismail.com)
    ├── js/common.js    Theme toggle, drop zone, download helpers, Turnstile gate
    ├── js/calc.js      GST, EMI and SIP maths (tested)
    └── js/app.js       The tool's logic
scripts/bump_version.py Release helper
.cpanel.yml             Copies public/ to tools.shaikhismail.com/gst-emi-calculator/
```

Third-party libraries: None

## How it is hosted

All the free tools share one subdomain, **tools.shaikhismail.com**. Each tool is its own repo and deploys into its own folder:

| Repo | Address |
|---|---|
| [tools-hub](https://github.com/mdism/tools-hub) | https://tools.shaikhismail.com/ (landing page, security rules, bot check) |
| this repo | https://tools.shaikhismail.com/gst-emi-calculator/ |

Set up the subdomain and the tools-hub repo first (see its README). Then, once for this repo:

cPanel → **Git Version Control** → Create → Clone a Repository:
- Clone URL: `https://github.com/mdism/tool-gst-emi-calculator.git`
- Repository path: `repositories/tool-gst-emi-calculator`

Each update: push to GitHub, then cPanel → Git Version Control → Manage → **Pull or Deploy** → *Update from Remote*, then *Deploy HEAD Commit*.

## Privacy and security

Nothing is uploaded, saved or tracked: see [PRIVACY.md](PRIVACY.md) (also published as `privacy.html`) and [SECURITY.md](SECURITY.md).

## Releasing

The version shows in the footer and links to CHANGELOG.md. Before each release:

```
python scripts/bump_version.py 1.4.0 "What changed"
```

## License

MIT, see [LICENSE](LICENSE).
