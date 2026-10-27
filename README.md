# GST, EMI & SIP Calculator

Quick GST, EMI and SIP calculations with clear breakdowns: add or remove GST with the CGST/SGST or IGST split, loan EMI with a yearly schedule, and SIP growth with optional step-up.

**Live:** https://calc.shaikhismail.com · part of the [free tools](https://shaikhismail.com/tools/) by [Mohammed Ismail Shaikh](https://shaikhismail.com)

- 100% client-side: files and numbers never leave your browser
- No build step, no server, no tracking, no cost to host
- Works on phones, light and dark theme

## Run locally

Open `public/index.html` in a browser, or serve the folder:

```
cd public
python -m http.server 8080
```

Then visit http://localhost:8080.

## Project layout

```
public/                 Everything that gets published
├── index.html          The page
└── assets/
    ├── css/tool.css    Shared look (same tokens as shaikhismail.com)
    ├── js/common.js    Theme toggle, drop zone, download helpers
    ├── js/calc.js      GST, EMI and SIP maths (tested)
    └── js/app.js       The tool's logic
tests/                  Node tests for calc.js (not published)
.cpanel.yml             Tells cPanel to copy only public/ to the subdomain
```

Third-party libraries: None

## Tests

The maths lives in `public/assets/js/calc.js`. Its tests need only Node 18 or newer, run from the repo root:

```
node --test
```

## Deploy on MilesWeb (cPanel)

One-time setup:

1. cPanel → **Domains** → Create a new domain → `calc.shaikhismail.com`. Untick "Share document root" and set the document root to `calc.shaikhismail.com` (that is `/home/qyotupjl/calc.shaikhismail.com`). If you pick a different folder, update `DEPLOYPATH` in `.cpanel.yml`.
2. cPanel → **SSL/TLS Status** → Run AutoSSL so the subdomain gets a free certificate.
3. cPanel → **Git Version Control** → Create → Clone a Repository:
   - Clone URL: `https://github.com/mdism/tool-gst-emi-calculator.git`
   - Repository path: `repositories/tool-gst-emi-calculator`

Each update: push to GitHub, then cPanel → Git Version Control → Manage → **Pull or Deploy** → *Update from Remote*, then *Deploy HEAD Commit*.

Finally set this tool to `status: "live"` in the TOOLS list at the bottom of `site/tools/index.html` in the [mdism/mdism](https://github.com/mdism/mdism) repo.

## License

MIT, see [LICENSE](LICENSE).
