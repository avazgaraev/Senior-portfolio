# DOST Consulting

DOST Consulting is a frontend-only showcase website for a boutique strategic consultancy based in Dubai, United Arab Emirates. It presents one connected consulting relationship for founders and growing companies: understand the business, position it, build the visible system, enter a market, grow deliberately and optimise what happens next.

The visual language is an editorial atlas rather than a conventional consulting template: warm ivory and pale stone, charcoal typography, restrained oxblood, Instrument Serif for strategic statements, DM Sans for navigation and analysis, and diagrams that respond to keyboard, pointer and scroll input.

## Run locally

No build step or package manager is required. With PowerShell:

```powershell
./tools/serve.ps1
```

Then open `http://localhost:8088/`. Any static HTTP server also works, for example `npx` is not required. The project is ready to publish as the repository root on GitHub Pages. `.nojekyll` is included so the static asset folders are served as written.

## Page structure

- `index.html` — interactive connected-decisions homepage and the DOST Method overview
- `approach.html` — six phases, Brand System, social-as-business flow and Business Compass
- `advisory.html` — connected advisory map and discipline ecosystem
- `expansion.html` — market explorer, sourced comparison table, scenario explorer and Dubai context
- `case-studies.html` — three fictional strategy scenarios with Before → Decision → Next move storytelling
- `insights.html` — editorial publication layout and accessible article dialog
- `about.html` — philosophy, principles and Dubai location visual
- `contact.html` — eight-step Consultation Brief with live Strategy Summary

Shared styling is in `assets/css/style.css` and `assets/css/refinements.css`. Shared interaction is in `assets/js/main.js`. `assets/data/content.js` contains phases, fictional case narratives and editorial articles. `assets/data/art.js` contains the generated inline-safe case illustration markup. Fonts are bundled in `assets/fonts/` with their licenses.

## Updating market and tax context

All comparison-market content is in `assets/data/markets.js` under `window.DOST_MARKETS`. Update a market’s `tax`, `setup`, `access`, `operations`, `residency`, `digital`, `local`, `international` and `fit` fields together with:

- `lastReviewed`
- `taxSource` and `taxAuthority`
- `businessSource` and `businessAuthority`
- `extraSource` where a second official tax reference is useful

The explorer renders the tax source, review date and official-source links from this object. Do not add tax percentages directly to an HTML page. Tax treatment depends on circumstances, and the interface intentionally avoids an overall jurisdiction score or a universal “best” answer. The current UAE copy distinguishes the standard AED 375,000 threshold, the 9% portion above it, and Qualifying Free Zone Person conditions. It does not state that Dubai businesses universally pay 0% tax.

Official source links currently used include the UAE Federal Tax Authority, UK HMRC / GOV.UK, Estonian Tax and Customs Board, Lithuanian State Tax Inspectorate, Polish Ministry of Finance, ZATCA and the official business portals for each sample market. Review these links and dates before publishing a live advisory service.

## Business Compass

The Business Compass is a deterministic, frontend-only questionnaire in `assets/js/main.js`. It stores answers in memory, applies explicit branching rules, and returns a suggested priority plus connected DOST phases. It makes no AI or automated professional-advice claim. The “Discuss this direction” link carries only the selected direction label so the next page can orient the form; no personal data is placed in the URL.

## Consultation Brief and Strategy Summary

`contact.html` guides the visitor through eight steps. The right-hand summary updates with stage, primary decision, current market and potential focus. Answers stay in page memory. The final view is a reviewable brief with a download-to-text action; there is no backend, submission endpoint, analytics form or automatic booking. Reloading or closing the page clears the in-memory personal data.

## Case-study content

All case studies are fictional showcase scenarios in `assets/data/content.js`. They are deliberately labelled as scenarios and contain no invented clients, testimonials, revenue claims or performance percentages. Edit the `cases` array to change the before, decision, strategy, system, next-move and outcome copy.

## Responsibility and disclaimers

Market, tax, legal, immigration and setup content is general strategic context and is not legal, tax, immigration or regulated investment advice. Verify current rules and the specific facts of a business with appropriately qualified professionals before making decisions. The site’s copy is designed to ask better questions before registration, promotion or expansion.

