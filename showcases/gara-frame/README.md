# GARA FRAME
A complete, editorial photography studio concept for Gara Tech Software Solutions. **Plain HTML, CSS and vanilla JavaScript.** No backend, dependencies, package manager, build step or external runtime requests.

## Open locally
Open **index.html** directly in a modern browser. All navigation, galleries, fonts and media use relative paths, so the site also works in a GitHub Pages repository subdirectory. A static HTTP server may be used, but is not required.

## Pages
- index.html — editorial homepage with masked entrance, selected stories, scroll-driven photo stack, category previews, floating photographs, filmstrip and contact sheet.
- portfolio.html — five complete stories; All / Forums / Events / Ceremonies filters.
- events/ — five static photographic stories, fullscreen viewer and next-story navigation.
- services.html — six services, sample collections and accessible FAQ accordions.
- about.html — studio philosophy and fictional, replaceable profile.
- client-galleries.html — gallery access demonstration, favorites, view controls, slideshow and selection export.
- contact.html — seven-step validated inquiry, editable summary and text export.
- credits.html — media credits and showcase context.
- assets/css/style.css — shared responsive design and reduced-motion rules.
- assets/js/site.js — all progressive enhancement and interactions.
- assets/images/ — local 1600px images and 640px responsive versions.
- assets/fonts/ — local Cormorant Garamond and Manrope, plus OFL licenses.
- assets/icons/favicon.svg — brand favicon.

## GitHub Pages
1. Commit these files to your GitHub repository.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select your branch and **/(root)**, then save.
4. Open the Pages URL when GitHub completes publication.

No build command, Jekyll setup or SPA rewrite is needed. A .nojekyll file is included. Nothing has been deployed automatically.

## Customize
Edit page HTML directly: every page contains its real content and metadata.
- Event titles, captions, locations and dates are in events/*.html. Update their corresponding entries in index.html and portfolio.html, plus next-story links.
- Replace matching photographs in assets/images/. Keep both filename.jpg (1600px) and filename-small.jpg (640px), or update src/srcset and width/height attributes. Keep related images together as a coherent occasion.
- Update the shared navigation/footer consistently in each HTML file.
- Change the palette and typography in :root in assets/css/style.css.
- Replace the illustrative studio statistics in about.html before use for a real business.
- Replace Open Graph image paths with absolute deployed URLs when connecting a production domain.
- See IMAGE-CREDITS.md and credits.html for original photographer links.

## Gallery demo
Code: **FRAME2026** (also visibly offered on the page).
Five original executive meeting photographs plus three clearly captioned detail studies make up the eight-item demo.
Favorites persist in localStorage on this device; access state and inquiry details do not.
Download exports a favorite selection list. Share explains the production sharing concept. Slideshow, image viewer, keyboard arrows, Escape, swipe, favorites, filtering and view changes work in the browser.

**The client gallery password protection is a frontend showcase only. It provides no real security. All images and the demo code are public. Real production private galleries require backend authentication and protected storage.**

## Inquiry demo
Seven steps collect occasion, date, location, guest count, coverage, event notes and contact information. Required fields and email format are validated. The final summary can be edited or saved as text. No inquiry is sent and no personal data is stored or transmitted.

## Accessibility and motion
Semantic content, visible keyboard focus, labeled controls, native modal dialogs, Escape and arrow-key viewer controls, swipe gestures, lazy images, responsive sources and prefers-reduced-motion support. Non-JavaScript visitors can browse all public story content; gallery and inquiry interactions require JavaScript.

## Verification
All 12 pages were rendered and visually reviewed in headless Microsoft Edge. Browser checks passed at 320, 390, 768 and 1440px, plus reduced-motion mode: local image loading, overflow, navigation, mobile menu, event filtering, viewer controls and Escape, gallery access, favorites, view changes, slideshow, inquiry validation, safe summary rendering and editing. All local links and assets were checked. Cross-browser testing on physical iOS/Android devices remains a production handoff step.

## Fictional showcase
All studio claims, event titles, dates and locations are illustrative. Photographs are licensed stock, not work performed by Gara Frame. The awards story is intentionally a coherent recipient-portrait selection. See the credits page for the original photographers.
