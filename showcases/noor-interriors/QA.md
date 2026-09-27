# Browser verification

Verified in local Microsoft Edge using `file://` URLs. No web server or application dependencies were used.

| Viewport / mode | Passed | Failed |
| --- | ---: | ---: |
| 1440 × 1000 desktop | 76 | 0 |
| 390 × 844 mobile | 77 | 0 |
| 320 × 740 narrow mobile | 77 | 0 |
| 1440 × 1000, reduced motion | 75 | 0 |

A 768 × 1024 tablet layout also passed the earlier 67-check suite. Screenshots were visually reviewed for the desktop and mobile hero, selected projects, material explorer, room story, before/after control and mobile project brief.

Checks cover local images/fonts, navigation targets, page overflow, project dialogs and focus return, mobile menu state, all material and mood selections, before/after positions, service disclosures, FAQ expansion/collapse, contextual project CTAs, all six brief steps, validation, file type/size/count restrictions, reference removal, safe rendering of entered text, downloadable brief contents, editing, scroll-story phases, desktop horizontal movement, and uncaught script errors.

The headless acceptance fixture uses a deterministic animation-frame clock so scroll-state assertions do not depend on compositor scheduling. Motion is disabled in visual capture fixtures to inspect settled layouts. Production `index.html`, `style.css` and `script.js` retain their native animation and scroll behavior. A separate reduced-motion browser run checks the accessible alternatives. Physical touch-device testing and other browser engines were not performed.

Local QA scripts, reports and screenshots are in `.qa/`, excluded from Git. There is no backend submission. The download check inspects the generated brief Blob and suppresses writing an actual test download.
