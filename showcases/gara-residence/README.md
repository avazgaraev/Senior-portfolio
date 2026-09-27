# GARA RESIDENCE

A complete eight-page architectural sales-office concept by **Gara Tech Software Solutions**. Built with HTML, CSS, and vanilla JavaScript; no framework, npm, Node.js, build step, backend, or database.

**All project, apartment, availability, pricing, location, travel-time, and construction information is fictional demo data. Lead forms never send real submissions. Viewing requests do not book appointments.**

## Run locally

Open `index.html` directly in a modern browser, or serve this directory with any static web server. All internal URLs are relative, so the site works under a GitHub Pages repository subpath. All fonts and photographic assets are stored locally; the site has no runtime network dependency beyond its own static host. Serif and sans-serif fallbacks are supplied.

## Pages

- `index.html` — cinematic opening, scroll-built tower, interactive floor selection, height explorer, living preview, day/night simulator.
- `residences.html` — two-tower explorer, floor plans, six inventory filters, sorting, pagination, unit stacks, payment calculator.
- `apartment.html?id=A-12A` — data-driven detail page, interactive room plan, orientation, price, view and calculator. The `id` is tower + floor + unit letter.
- `amenities.html` — eight masterplan hotspots, horizontal interior gallery, material studies, day story and day/night interaction.
- `location.html` — fictional travel times, category-filtered neighbourhood diagram.
- `progress.html` — progress timeline, conceptual foundation/current comparison, downloadable demo documents.
- `about.html` — project vision and clear concept disclosure.
- `contact.html` — six-step consultation and two-step viewing flows with local summary and text download. `?mode=viewing` selects the viewing flow. `?unit=A-12A` carries a residence into either flow.

## File structure

```
index.html / residences.html / apartment.html / amenities.html
location.html / progress.html / about.html / contact.html
assets/
  css/style.css           Shared visual system, responsive layouts, reduced motion
  js/data.js             Project settings, apartment inventory, timeline
  js/visuals.js           Original SVG tower, floor and apartment plans
  js/app.js               Page templates and interaction controllers
  images/                Locally stored reference photography
  fonts/                 Local font files and open-source licenses
  icons/favicon.svg      Original architectural mark
  documents/             Downloadable demo brochure, plans, specs, credits
tests/verify.html        Dependency-free browser verification harness
.nojekyll                 GitHub Pages static publishing
```

## GitHub Pages

1. Push this folder to a GitHub repository, including `assets` and `.nojekyll`.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Choose your publishing branch and **/(root)**, then save.
4. Open the repository's Pages URL after deployment completes.

No environment variables, build command, API keys, external service account, or server are required. This implementation does not publish automatically.

## Data and customisation

### Floors and towers

Edit `config` in `assets/js/data.js`. The concept has two 18-level towers. Residential floors 4–18 have four units each: 15 × 4 × 2 = 120 residences. Levels 1–3 hold the podium, shared amenities, and garden. The SVG tower geometry and floor selector ranges in `visuals.js` and `app.js` deliberately mirror this specific 18-level design; update them as well when changing building geometry. Also update project copy and statistics to match.

### Apartments, status, and price

`apartments` in `data.js` is the single source of truth. Each record has `id`, `number`, `tower`, `floor`, `bedrooms`, `area`, `interior`, `balcony`, `view`, `orientation`, `status`, and `price` (AZN). The deterministic generator creates 120 records with 42 Available, 12 Reserved, and 66 Sold. A small override block establishes the Floor 12 sample and swaps statuses to preserve totals. The available counts throughout the interface derive from this inventory.

Adjust the generator or replace it with explicit records. Status values are `Available`, `Reserved`, and `Sold`; a floor with one or two available homes is labelled Limited alongside its actual count. All residents, including sold examples, can be inspected, with contextual wording directing the user to similar residences.

### Plans and areas

`visuals.js` produces schematic room plans for 1–4 bedrooms, plus a balcony. Interior room areas sum to the recorded interior area before individual display rounding. Plans include an accessible room selector, labels, and area readouts. They are conceptual, not measured construction plans. Replace these diagrams with project-specific SVG geometry for a real development.

### Construction timeline

Edit `timeline` in `data.js` for date, stage, percentage, description, and reference image. Edit `config.completion` and associated copy for handover timing. The scroll-built model is a lightweight transform/opacity sequence, not an image sequence. All scroll work is batched with requestAnimationFrame.

### Payment calculator

Defaults live in `config.payment`: 30% down, 24 months. The initial sample price is 245,000 AZN; apartment pages use the selected unit's price. In `app.js`, `calculator()` defines allowed percentages and periods. Formula: `(price - price × down percentage) / months`. Displayed monthly values round to whole AZN. Invalid, negative, empty, or out-of-range prices do not calculate. No interest, fees, taxes, insurance, mortgage eligibility, or bank partnership is implied.

### Forms and privacy

Both flows validate required fields using browser validation. State exists only in JavaScript memory. There is no fetch request, analytics, cookie, localStorage, external form endpoint, email dispatch, or database. A user may explicitly download their request as a local TXT file. Refreshing or leaving clears the form state. A real deployment would need a separately authorised, accessible, secure submission workflow.

### Imagery

Building photos are in `assets/images/architecture.jpg` and `tower.jpg`. Other photographs are in the same directory. All images are illustrative references and do not depict a real Gara project. See `assets/documents/image-credits.txt` for original sources and use notes. Confirm appropriate rights or replace third-party building photography before public commercial use. The original SVG model, plans, maps and material studies are editable in source.

### Accessibility and mobile

Keyboard-accessible floor dropdowns mirror the pointer-driven tower. Individual floor units are links. Room zones support focus, Enter, Space, and touch. Dialogs use the native modal API with Escape dismissal and focus restoration. Forms have labels and native validation. Controls have visible focus states. Reduced motion removes reveals and parallax and shows the complete constructed model. Apartment pages include mobile sticky enquiry/viewing actions. Inventory switches to compact architectural rows and a touch-sized unit stack.

## Design notes

Limestone and ivory surfaces, a single dark-olive accent, Italiana editorial typography, and DM Sans interface text. Motion follows the architecture. Reference photographs express atmosphere; original interactive models express the fictional project's geometry.

The image-generation tool was attempted but rate-limited; no generated bitmap is included. The intended prompt was a photorealistic pair of 18-story limestone residential towers in warm morning light, deep glass balconies, landscaped courtyard, calm sky, and architectural editorial composition without text or branding.

## Verification

Serve the repository with a static server and open `tests/verify.html`. It runs 93 browser checks across all eight pages, desktop and 390px viewports, image loading, Unicode, inventory counts, floor selection, filters, stack availability, calculator arithmetic and invalid inputs, room plans, modal opening/closing, 1–4 bedroom layouts, amenities, materials, neighbourhood filters, comparison slider, document downloads, both form flows and mobile navigation.

The final run in Microsoft Edge headless passed **93 / 93** checks. Desktop and phone screenshots were also visually inspected for the homepage, building explorer, apartment detail, amenities, location and consultation flow. This is not a claim of exhaustive device or assistive-technology certification.
