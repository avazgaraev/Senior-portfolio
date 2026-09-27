# GARA MEDICA

A premium private-clinic concept for **Gara Tech Software Solutions**, built with semantic HTML, CSS, and vanilla JavaScript. No packages, build process, backend, database, or framework are required.

## Local use

Open `index.html` directly in a modern browser. All pages use relative paths and all scripts are classic deferred scripts, so the site also works from a local static-file preview server. An internet connection is used for Google Fonts; system serif and sans-serif fallbacks are provided.

## Pages and structure

```text
index.html             Homepage, discovery, journey, care navigator, FAQ
doctors.html           Department filters and accessible profile dialogs
services.html          Six department sections and service links
service-detail.html    Data-driven consultation detail page
about.html             Philosophy, environment, and care approach
appointment.html       Eight-step appointment demonstration
contact.html           Sample contact details and arrival guide
privacy.html           Privacy and fictional-content information
assets/css/style.css   Design system, layouts, responsive styles, motion
assets/js/data.js      Editable clinic content and appointment slots
assets/js/app.js       Shared navigation, discovery, profiles, animation
assets/js/appointment.js  In-memory appointment flow and custom calendar
assets/images/         Locally stored reference photography
assets/icons/          Original vector favicon
ASSET-CREDITS.md        Image sources and usage notes
```

## GitHub Pages deployment

1. Commit the contents of this directory to a GitHub repository.
2. In **Settings → Pages**, select **Deploy from a branch**.
3. Choose the branch containing these files and the **/(root)** folder, then save.
4. Open the URL GitHub provides after deployment completes.

No build command is needed. Relative links work both at a domain root and beneath a GitHub Pages project path. `.nojekyll` disables unnecessary Jekyll processing. Before a public launch, use the final absolute site URL for Open Graph image URLs; the included relative images support portable local previews.

## Editing content

- **Doctors:** `window.CLINIC.doctors` in `assets/js/data.js` defines names, portrait filenames, specialties, experience, languages, working days, biographies, and focus areas. Days use Sunday = 0 through Saturday = 6. Verified education and registration details belong in the profile rendering in `app.js` before any real use.
- **Departments and services:** `window.CLINIC.departments` in `data.js`. Each department defines its associated doctor, image, service names, and illustrative duration.
- **Appointment slots:** `window.CLINIC.slots` and `unavailableSlots` in `data.js`. The calendar offers the next 90 days, excludes Sundays and days the selected doctor does not work, and limits Saturdays to before 14:00. Slot labels represent **Baku time (UTC+4)**. Calendar day boundaries follow the visitor’s local device date; a live service should use authoritative clinic-local dates and availability.
- **FAQs:** `window.CLINIC.faq` in `data.js`.
- **Images:** replace the files in `assets/images/`, retaining filenames, or update the image references. Use licensed, verified clinic photography before a real launch. Add descriptive alt text appropriate to the new photographs.
- **Homepage statistics and testimonial:** `index.html`. `data-count` and `data-suffix` control the illustrative counters.
- **Contact details and location diagram:** `contact.html`. All contact values are intentionally fictional. Call and Directions actions lead to this information instead of dialing an invented number or navigating to an unrelated clinic.
- **Colors, typography, responsive behavior:** CSS custom properties and media queries in `assets/css/style.css`.

## Useful links and state

- `doctors.html?department=dentistry` opens a filtered specialist list.
- `doctors.html?doctor=leyla` opens the fictional specialist’s dialog.
- `services.html#dermatology` links directly to a department.
- `service-detail.html?department=dentistry&service=2` opens the dental implant consultation example. Service indexes start at zero.
- `appointment.html?department=dermatology&doctor=leyla&service=Dermatology%20consultation` preselects compatible choices while retaining the guided flow.

Changing department clears incompatible service, doctor, date, and time choices. Changing doctor clears date and time. The optional note and sample personal details are escaped when displayed in review. Personal details are cleared when leaving the page, including back/forward-cache navigation.

## Demo and medical information

**Appointment submission is frontend demo only.** It makes no network submission and stores no patient information in cookies, local storage, or a database. The confirmation screen acknowledges a demonstration, not a real appointment. Use sample details.

**All doctor names, experience, statistics, ratings, patient stories, availability, and medical content are fictional showcase data.** Photographs depict models or reference environments. The need navigator routes to departments only; it does not diagnose, determine treatment, or replace medical assessment. No awards, professional certifications, clinical outcomes, or emergency care capabilities are claimed.

## Accessibility and motion

The site includes skip links, semantic landmarks, labeled forms, visible keyboard focus, native dialog focus containment, native disclosure accordions, selection states, polite result announcements, disabled unavailable dates/times, and reduced-motion styles. On reduced motion, the journey is unpinned and its steps remain manually selectable. Touch layouts expose persistent patient actions.

## Review status

JavaScript syntax, local asset references, content relationships, and appointment state transitions were checked programmatically. Browser rendering and real-device checks remain necessary: the session’s browser tools were unavailable and automated browser launch was blocked. Before publication, review at 360px, 390px, 768px, and 1440px; exercise keyboard navigation, profile-dialog dismissal, reduced motion, every booking step, Back/Edit, and the final confirmation.
