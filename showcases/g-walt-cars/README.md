# Gara Cars

A premium automotive **detailing and surface-protection studio** concept for **Gara Tech Software Solutions**. The editorial design centres on PPF, ceramic coating, detailing, tint, wraps, and paint correction. Built entirely with semantic HTML, CSS, and vanilla browser JavaScript.

## Open the website

Double-click `index.html`. Everything, including photography and fonts, is local. No installation, server, framework, Node.js, build step, API key, or internet connection is required.

```text
index.html                 Page structure, content, inline vector icons
style.css                  Design tokens, layouts, motion, responsive rules
script.js                  Navigation, scroll story, gallery, booking demo
.nojekyll                  Static GitHub Pages publishing
assets/
  ppf-atelier.png          Generated PPF application hero
  PPF-ART-DIRECTION.md     Current image prompt and provenance
  hero-studio.png          Earlier concept, retained but not loaded
  ART-DIRECTION.md         Earlier image prompt and provenance
  hero.jpg                 Cinematic Lamborghini photograph
  headlight.jpg            Bentley detail photograph
  interior.jpg             Ferrari interior photograph
  showcase.jpg             Subaru photograph
  detail.jpg               Paint polishing photograph
  favicon.svg              Gara mark
  manrope-regular.ttf       Local regular font
  manrope-bold.ttf          Local bold font
  FONT-LICENSE.txt          Manrope SIL Open Font License
README.md                  Setup, asset credits, and customization
```

## Experience

- Hands-on PPF application hero with an offset photographic frame, editorial typography, and restrained parallax.
- Interactive treatment index: six accessible tabs update a shared image, treatment explanation, suitability notes, and consultation shortcut. Arrow keys, Home, and End are supported.
- Pinned **Inspect / Prepare / Protect** process story, with photographic crossfades, progress indicators, and treatment notes.
- Asymmetric finish-study journal with captions focused on service outcomes. Its viewer supports filtered previous/next navigation, keyboard arrows, touch gestures, and image inspection.
- A paper-toned care schedule replaces pricing cards. Each plan preselects its treatment and corresponding customer goal.
- Four-step care brief: **goal → treatment, vehicle type and condition → inspection visit → review**. Goal choices suggest a treatment; visitors can change it. Includes validation, back navigation, confirmation, and reset.
- One editorial sample client quote, native FAQ disclosures, mobile navigation, and reduced-motion support.

Scrolling stays native. Animations use CSS transforms, IntersectionObserver, and scheduled requestAnimationFrame updates. Below-fold images load lazily. Supporting copy is typically 14–16px, with labels at least 12px. Referenced media and fonts total approximately 3.4 MB; the earlier, unused studio-car concept remains on disk but is not requested by the site.

## GitHub Pages

1. Add the files to a GitHub repository, keeping `index.html` at the repository root.
2. Push them to your `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select **main** and **/(root)**, then **Save**.
6. Open the published address shown in Pages once deployment completes.

All paths are relative, so the same files work at a project address such as `https://username.github.io/gara-cars/`. No custom build workflow is needed. See [GitHub’s publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Replacing media and brand content

Replace images inside `assets/` using the existing filenames, or update their paths in `index.html` and the `projects` and `treatments` arrays in `script.js`. Update image `alt`, `width`, and `height` attributes to match new photographs. Use approximately 1920px-wide imagery for the hero and 1000–1400px images elsewhere; compressed JPEG, WebP, or AVIF work well. If changing formats, update extensions in both files.

The hero crop is controlled by `.hero-media img`; mobile positioning has its own rules. Gallery crops use `object-fit: cover`. The hero is a generated still image with motion treatment. Its final prompt and provenance are recorded in [assets/PPF-ART-DIRECTION.md](assets/PPF-ART-DIRECTION.md). It was created using the built-in imagegen tool and is stored locally as `assets/ppf-atelier.png`.

Brand colors and spacing live in `:root` at the top of `style.css`. Edit `chapters` for process copy and `treatments` for the treatment index. Keep booking options, care-plan attributes, `goalDefaults`, and `serviceGoals` aligned when changing treatments. Dates use the visitor’s local calendar for the minimum date; the review explicitly labels example appointment times as Baku local time.

The footer’s location and social entries are clearly marked concept placeholders. Replace them with the actual address, contact details, and social URLs when adapting the site for a business. The page contains no dead social links.

## Demo boundaries

This is a front-end concept, not an operating automotive service. Gallery entries illustrate proposed finishes using stock photography; testimonials are labeled sample content. Packages use consultation-based quotes instead of invented prices. No manufacturer affiliation or endorsement is implied.

The booking demo makes **no real appointments**, collects no personal contact details, sends no requests, and uses no storage or analytics. Its state resets when the page reloads. A real booking system would require separately implemented availability, server-side validation, consent, and notifications.

## Photography and typography

Locally downloaded demo imagery from Pexels, used under the [Pexels License](https://www.pexels.com/license/):

| Local file      | Original photograph                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `hero.jpg`      | [Black sports car in a garage — Jae Park](https://www.pexels.com/photo/a-black-sports-car-parked-inside-the-garage-8664304/) |
| `headlight.jpg` | [Front headlight of a black car](https://www.pexels.com/photo/front-headlight-of-a-black-car-6873190/)                       |
| `interior.jpg`  | [Black car interior — Jae Park](https://www.pexels.com/photo/black-car-interior-3954451/)                                    |
| `showcase.jpg`  | [Black car parked in a garage](https://www.pexels.com/photo/a-black-car-parked-in-a-garage-17716185/)                        |
| `detail.jpg`    | [Person polishing the surface of a car](https://www.pexels.com/photo/person-polishing-the-surface-of-a-car-14615262/)        |

Manrope is served locally. Its SIL Open Font License is included in `assets/FONT-LICENSE.txt`; [font source](https://github.com/google/fonts/tree/main/ofl/manrope).

## Browser verification

Verified directly over `file://` in Chromium-based Edge at 1440, 1024, 768, 390, and 320px widths. Checked horizontal overflow, image loading, gallery filtering, modal close behavior, service/package selection, booking validation and completion, previous-step retention, reset, mobile navigation, FAQ expansion, and reduced-motion behavior. No runtime packages or test dependencies are shipped with the site.

Automated axe checks reported no WCAG 2 A/AA or WCAG 2.1 AA violations in the initial desktop and mobile states. Keyboard navigation, modal-to-booking focus, and mobile step visibility were also checked. These automated checks do not replace a full accessibility audit.

The studio revision verifies keyboard treatment tabs, goal-to-treatment suggestions, plan shortcuts, required vehicle condition, past-date rejection, full review, previous-step retention, completion, and reset. All visible text was checked to be at least 12px across the five viewport widths above. Artwork and fonts load with zero external network requests.

Use a current Chrome, Edge, Firefox, or Safari version. The implementation uses native `dialog`, CSS `:has()`, and small viewport units. Real-device Safari and Firefox testing has not been performed in this workspace.
