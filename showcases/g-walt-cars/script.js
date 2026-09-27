/* Gara Cars — browser-native interactions, works directly over file://. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const header = $("#header");
  const hero = $(".hero");
  const story = $(".story");
  const storySteps = $$(".story-step");
  const storyImages = $$(".story-image");
  const detailPhoto = $(".experience-photo");
  const galleryCursor = $(".gallery-cursor");
  const pointer = { x: -200, y: -200, card: null };
  let framePending = false;
  let activeStory = -1;
  let storyInView = false;
  let detailInView = false;

  // Mobile navigation: native links, Escape to close, and a contained tab sequence.
  const menuToggle = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  function closeMenu(returnFocus = false) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.hidden = true;
    document.body.classList.remove("menu-open");
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    const opening = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation",
    );
    mobileNav.hidden = !opening;
    document.body.classList.toggle("menu-open", opening);
    if (opening) $("a", mobileNav).focus();
  });
  $$("a", mobileNav).forEach((link) =>
    link.addEventListener("click", () => closeMenu()),
  );
  document.addEventListener("keydown", (event) => {
    if (mobileNav.hidden) return;
    if (event.key === "Escape") closeMenu(true);
    if (event.key === "Tab") {
      const controls = [menuToggle, ...$$("a", mobileNav)];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Reveal observers are enhancements; content stays visible if unsupported.
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );
    document.documentElement.classList.add("motion-ready");
    $$(".reveal").forEach((element) => revealObserver.observe(element));
  }

  // One shared treatment plate keeps comparisons deliberate and keyboard-friendly.
  const treatments = [
    {
      name: "Paint Protection Film",
      image: "assets/ppf-atelier.png",
      alt: "Clear protection film being applied by hand",
      focus: "PAINT / IMPACT PROTECTION",
      title: "Keep the paint.\nTake on the road.",
      copy: "Clear film for the panels that meet the world first. Choose targeted coverage or a complete body wrap, with every edge considered.",
      best: "New paint & everyday road exposure",
      scope: "Panel coverage, film finish & edge detail",
    },
    {
      name: "Ceramic Coating",
      image: "assets/headlight.jpg",
      alt: "Clear reflections across gloss black paint",
      focus: "PAINT / COATED FINISH",
      title: "Depth in the finish.\nEase in the upkeep.",
      copy: "A ceramic finish over properly prepared paint. A considered choice for added gloss and a surface that is easier to maintain.",
      best: "Gloss, easier washing & ongoing care",
      scope: "Paint preparation, coating & curing",
    },
    {
      name: "Premium Detailing",
      image: "assets/interior.jpg",
      alt: "Leather seats, controls, and trim inside a cared-for cockpit",
      focus: "INTERIOR & EXTERIOR / RESET",
      title: "Clean beyond\nthe obvious.",
      copy: "From paint decontamination to the surfaces you touch every day. A thorough clean shaped around your car’s materials and condition.",
      best: "Daily-driven cars & a fresh start",
      scope: "Paint, wheels, leather, trim & touchpoints",
    },
    {
      name: "Window Tint",
      image: "assets/interior.jpg",
      alt: "A refined vehicle cabin with glass and interior surfaces",
      focus: "GLASS / CABIN COMFORT",
      title: "A more considered\ncabin.",
      copy: "Window film chosen for your comfort, privacy, and visibility. We discuss the suitable shade and glass coverage before application.",
      best: "Cabin comfort & considered privacy",
      scope: "Film selection, visibility & local requirements",
    },
    {
      name: "Vinyl Wrap",
      image: "assets/hero.jpg",
      alt: "Satin black bodywork showing the contours of a vehicle",
      focus: "COLOUR / PERSONAL EXPRESSION",
      title: "A new finish.\nThe same attachment.",
      copy: "A colour-change wrap that respects the shape of your car. Explore satin, gloss, and other finishes before we plan the preparation and fit.",
      best: "Colour changes & a personal finish",
      scope: "Finish samples, trim details & panel edges",
    },
    {
      name: "Paint Correction",
      image: "assets/detail.jpg",
      alt: "Machine polishing carefully refining a vehicle panel",
      focus: "PAINT / CLARITY",
      title: "Bring clarity\nback to the surface.",
      copy: "Measured polishing to address suitable swirls and surface haze. The approach follows a paint assessment, with preservation at the centre.",
      best: "Swirl marks, dullness & surface haze",
      scope: "Paint assessment, correction level & protection",
    },
  ];
  const treatmentTabs = $$(".treatment-tab");
  let activeTreatment = 0;
  function selectTreatment(index) {
    if (activeTreatment === index) return;
    activeTreatment = index;
    const treatment = treatments[index];
    treatmentTabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    $("#treatment-panel").setAttribute("aria-labelledby", `treatment-${index}`);
    $("#treatment-image").src = treatment.image;
    $("#treatment-image").alt = treatment.alt;
    $("#treatment-number").textContent = `0${index + 1}`;
    $("#treatment-focus").textContent = treatment.focus;
    const lines = treatment.title.split("\n");
    $("#treatment-title").replaceChildren(
      document.createTextNode(lines[0] + " "),
      document.createElement("br"),
      document.createTextNode(lines[1]),
    );
    $("#treatment-copy").textContent = treatment.copy;
    $("#treatment-best").textContent = treatment.best;
    $("#treatment-scope").textContent = treatment.scope;
    $("#treatment-book").dataset.service = treatment.name;
    if (!reducedMotion.matches) {
      $("#treatment-image").animate(
        [
          { opacity: 0.3, transform: "scale(1.04)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 600, easing: "ease-out" },
      );
      $(".treatment-info").animate(
        [
          { opacity: 0.3, transform: "translateY(8px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 400, easing: "ease-out" },
      );
    }
  }
  treatmentTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTreatment(index));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight")
        next = (index + 1) % treatments.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
        next = (index + treatments.length - 1) % treatments.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = treatments.length - 1;
      else return;
      event.preventDefault();
      selectTreatment(next);
      treatmentTabs[next].focus();
    });
  });

  const chapters = [
    {
      verb: "Read",
      line: "the surface.",
      kicker: "01 — UNDER THE INSPECTION LIGHT",
      material: "01 / ASSESSMENT",
      finish: "The right treatment starts here.",
      detail:
        "Paint condition, existing protection, and the way you use your car.",
      copy: "Paint condition tells us where to begin.\nWe look before we recommend.",
    },
    {
      verb: "Prepare",
      line: "with purpose.",
      kicker: "02 — BEFORE ANY PROTECTION",
      material: "02 / SURFACE PREPARATION",
      finish: "Good preparation shows.",
      detail:
        "Decontamination and appropriate paint correction, before a film or coating is applied.",
      copy: "Clean. Decontaminate. Refine where needed.\nA considered finish begins beneath the surface.",
    },
    {
      verb: "Protect",
      line: "every edge.",
      kicker: "03 — APPLICATION & AFTERCARE",
      material: "03 / APPLICATION",
      finish: "Care that goes beyond the handover.",
      detail:
        "Careful film placement, a final inspection, and clear instructions for your next wash.",
      copy: "Film, coating, or a new finish — fitted to your brief.\nThen a clear plan for keeping it that way.",
    },
  ];

  function setStory(index) {
    if (activeStory === index) return;
    activeStory = index;
    const chapter = chapters[index];
    storyImages.forEach((image, i) => {
      image.classList.toggle("active", i === index);
      image.setAttribute("aria-hidden", String(i !== index));
    });
    $(".story-numeral").textContent = `0${index + 1}`;
    $("#story-material").textContent = chapter.material;
    $("#story-finish").textContent = chapter.finish;
    $("#story-detail").textContent = chapter.detail;
    const title = $("#story-title");
    const line = document.createElement("span");
    line.textContent = chapter.line;
    title.replaceChildren(
      document.createTextNode(chapter.verb),
      document.createElement("br"),
      line,
    );
    $("#story-kicker").textContent = chapter.kicker;
    const parts = chapter.copy.split("\n");
    $("#story-copy").replaceChildren(
      document.createTextNode(parts[0] + " "),
      document.createElement("br"),
      document.createTextNode(parts[1]),
    );
    storySteps.forEach((button, i) => {
      button.classList.toggle("active", i === index);
      button.classList.toggle("completed", i < index);
      button.setAttribute("aria-pressed", String(i === index));
    });
    const content = $(".story-content");
    content.classList.remove("changing");
    if (!reducedMotion.matches) {
      // Restart the short text transition only when the narrative changes.
      void content.offsetWidth;
      content.classList.add("changing");
    }
  }
  setStory(0);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        storyInView = entries[0].isIntersecting;
        scheduleFrame();
      },
      { rootMargin: "100px" },
    ).observe(story);
    new IntersectionObserver(
      (entries) => {
        detailInView = entries[0].isIntersecting;
        scheduleFrame();
      },
      { rootMargin: "100px" },
    ).observe(detailPhoto);

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".desktop-nav a").forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    ["services", "showcase", "packages", "craft"].forEach((id) =>
      navObserver.observe(document.getElementById(id)),
    );
  } else storyInView = true;

  // Scroll is never intercepted. One scheduled frame handles only visible effects.
  function renderScroll() {
    framePending = false;
    header.classList.toggle("scrolled", window.scrollY > 45);
    if (reducedMotion.matches) return;
    if (pointer.card) {
      galleryCursor.style.setProperty("--cursor-x", `${pointer.x}px`);
      galleryCursor.style.setProperty("--cursor-y", `${pointer.y}px`);
    }
    if (window.scrollY < hero.offsetHeight) {
      hero.style.setProperty(
        "--hero-y",
        `${Math.min(window.scrollY * 0.14, 110)}px`,
      );
      hero.style.setProperty(
        "--hero-scale",
        String(1 + Math.min(window.scrollY / hero.offsetHeight, 1) * 0.07),
      );
    }
    if (detailInView) {
      const rect = detailPhoto.getBoundingClientRect();
      const progress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      detailPhoto.style.setProperty("--detail-y", `${(progress - 0.5) * 35}px`);
    }
    if (storyInView) {
      const rect = story.getBoundingClientRect();
      const travel = story.offsetHeight - $(".story-sticky").offsetHeight;
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(travel, 1)),
      );
      story.style.setProperty("--story-x", `${progress * -4}%`);
      story.style.setProperty("--story-scale", String(1.05 + progress * 0.1));
      story.style.setProperty("--scan-x", `${30 + progress * 55}%`);
      story.style.setProperty(
        "--story-inset",
        `${Math.max(0, Math.min(4, (rect.top / window.innerHeight) * 8))}%`,
      );
      const chapterProgress = progress === 1 ? 1 : (progress * 3) % 1;
      story.style.setProperty(
        "--chapter-progress",
        `${chapterProgress * 100}%`,
      );
      setStory(Math.min(2, Math.floor(progress * 3)));
    }
  }
  function scheduleFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(renderScroll);
  }
  window.addEventListener(
    "scroll",
    () => {
      galleryCursor.classList.remove("active");
      scheduleFrame();
    },
    { passive: true },
  );
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 900) closeMenu();
      scheduleFrame();
    },
    { passive: true },
  );
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches)
      document.documentElement.classList.remove("motion-ready");
    scheduleFrame();
  });
  scheduleFrame();

  storySteps.forEach((button) =>
    button.addEventListener("click", () => {
      const index = Number(button.dataset.step);
      setStory(index);
      if (!reducedMotion.matches) {
        const top = story.getBoundingClientRect().top + window.scrollY;
        const travel = story.offsetHeight - $(".story-sticky").offsetHeight;
        // Position within a chapter, rather than at a rounding-sensitive boundary.
        window.scrollTo({
          top: top + travel * ((index + 0.2) / 3),
          behavior: "smooth",
        });
      }
    }),
  );

  if (finePointer.matches) {
    $$(".project").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          if (reducedMotion.matches) return;
          pointer.x = event.clientX;
          pointer.y = event.clientY;
          pointer.card = card;
          galleryCursor.classList.add("active");
          scheduleFrame();
        },
        { passive: true },
      );
      card.addEventListener("pointerleave", () => {
        pointer.card = null;
        galleryCursor.classList.remove("active");
      });
    });
    hero.addEventListener(
      "pointermove",
      (event) => {
        if (reducedMotion.matches) return;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty(
          "--pointer-x",
          `${((event.clientX - rect.left) / rect.width) * 100}%`,
        );
        hero.style.setProperty(
          "--pointer-y",
          `${((event.clientY - rect.top) / rect.height) * 100}%`,
        );
      },
      { passive: true },
    );
  }

  // Gallery filtering and accessible, focus-restoring native project dialogs.
  $$(".gallery-filters button").forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      $$(".gallery-filters button").forEach((control) => {
        const active = control === button;
        control.classList.toggle("active", active);
        control.setAttribute("aria-pressed", String(active));
      });
      $(".gallery-grid").classList.toggle("filtered", filter !== "all");
      $$(".project").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
        if (!card.hidden) card.classList.add("visible");
      });
    }),
  );

  const projects = [
    {
      title: "A different expression.",
      label: "VINYL WRAP / SATIN FINISH",
      image: "assets/hero.jpg",
      service: "Vinyl Wrap",
      copy: "An exercise in restraint. A satin-black wrap concept that follows every sculpted line, with considered accents and an unmistakable silhouette.",
    },
    {
      title: "Depth, restored.",
      label: "PAINT ENHANCEMENT / CERAMIC",
      image: "assets/headlight.jpg",
      service: "Ceramic Coating",
      copy: "Depth you can see. A paint enhancement and ceramic coating concept, imagined for a mirror-like reflection and a beautifully considered finish.",
    },
    {
      title: "Every touchpoint.",
      label: "INTERIOR / SPECIALIST DETAILING",
      image: "assets/interior.jpg",
      service: "Premium Detailing",
      copy: "The most personal part of the drive. A meticulous interior care concept, with focused attention on leather, trim, and every touchpoint.",
    },
    {
      title: "Ready for real life.",
      label: "PAINT PROTECTION / DAILY CARE",
      image: "assets/showcase.jpg",
      service: "Paint Protection Film",
      copy: "Made to be driven. A full-body paint protection concept that preserves the original character and gloss, ready for the next stretch of open road.",
    },
  ];
  const dialog = $("#project-dialog");
  let dialogTrigger = null;
  let currentProject = 0;
  function setZoom(zoomed) {
    $(".dialog-visual").classList.toggle("zoomed", zoomed);
    const control = $(".dialog-zoom");
    control.setAttribute("aria-pressed", String(zoomed));
    control.setAttribute(
      "aria-label",
      zoomed ? "Show full project image" : "Zoom project image",
    );
    const symbol = document.createElement("span");
    symbol.textContent = zoomed ? "−" : "+";
    control.replaceChildren(
      document.createTextNode(zoomed ? "Full composition " : "Inspect finish "),
      symbol,
    );
  }
  function showProject(index) {
    currentProject = index;
    const project = projects[index];
    const card = $(`.project[data-project="${index}"]`);
    $("#project-dialog-title").textContent = project.title;
    $("#project-dialog-label").textContent = project.label;
    $("#project-dialog-copy").textContent = project.copy;
    $("#project-dialog-image").src = project.image;
    $("#project-dialog-image").alt = $("img", card).alt;
    if (!reducedMotion.matches) {
      $("#project-dialog-image").animate([{ opacity: 0.35 }, { opacity: 1 }], {
        duration: 550,
        easing: "ease-out",
      });
    }
    $("#project-dialog-cta").dataset.service = project.service;
    const visible = $$(".project").filter((item) => !item.hidden);
    $(".dialog-position").textContent =
      `${String(visible.indexOf(card) + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    setZoom(false);
  }
  function navigateProject(direction) {
    const indices = $$(".project")
      .filter((card) => !card.hidden)
      .map((card) => Number(card.dataset.project));
    const position = indices.indexOf(currentProject);
    showProject(
      indices[(position + direction + indices.length) % indices.length],
    );
  }
  $(".dialog-prev").addEventListener("click", () => navigateProject(-1));
  $(".dialog-next").addEventListener("click", () => navigateProject(1));
  $(".dialog-zoom").addEventListener("click", () =>
    setZoom(!$(".dialog-visual").classList.contains("zoomed")),
  );
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      navigateProject(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  // Horizontal touch gestures browse the collection; vertical scrolling remains native.
  let swipeStart = null;
  $(".dialog-visual").addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "touch" && !event.target.closest("button"))
        swipeStart = { x: event.clientX, y: event.clientY };
    },
    { passive: true },
  );
  $(".dialog-visual").addEventListener(
    "pointerup",
    (event) => {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
        navigateProject(dx < 0 ? 1 : -1);
      swipeStart = null;
    },
    { passive: true },
  );
  $(".dialog-visual").addEventListener(
    "pointercancel",
    () => (swipeStart = null),
  );
  $$(".project").forEach((card) =>
    card.addEventListener("click", () => {
      dialogTrigger = card;
      showProject(Number(card.dataset.project));
      galleryCursor.classList.remove("active");
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add("dialog-open");
    }),
  );
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    dialogTrigger?.focus({ preventScroll: true });
  });

  // Booking state exists only in memory. No network requests or persistence.
  const form = $("#booking-form");
  const bookingSteps = $$(".booking-step");
  const progressItems = $$(".booking-progress li");
  const error = $("#booking-error");
  const dateInput = $("#booking-date");
  const serviceSelect = $("#service-select");
  const goalLabels = {
    Protect: "Protect the paint",
    Restore: "Restore the finish",
    Restyle: "Change the look",
    Advice: "Help me decide",
  };
  const goalDefaults = {
    Protect: "Paint Protection Film",
    Restore: "Premium Detailing",
    Restyle: "Vinyl Wrap",
    Advice: "Help me choose",
  };
  const serviceGoals = {
    "Paint Protection Film": "Protect",
    "Ceramic Coating": "Protect",
    "Premium Detailing": "Restore",
    "Paint Correction": "Restore",
    "Window Tint": "Restyle",
    "Vinyl Wrap": "Restyle",
    "Essential Care": "Restore",
    "Signature Finish": "Restore",
    "Ultimate Protection": "Protect",
    "Help me choose": "Advice",
  };
  let bookingStep = 0;
  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  dateInput.min = localDate();

  function bookingValues() {
    return {
      goal: $('input[name="goal"]:checked', form)?.value || "",
      vehicle: $("#vehicle-select").value,
      condition: $("#condition-select").value,
      service: serviceSelect.value,
      date: dateInput.value,
      time: $("#booking-time").value,
    };
  }
  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value + "T12:00:00"));
  }
  function updateSummary() {
    const values = bookingValues();
    $("#selection-summary").textContent =
      [values.goal, values.service, values.vehicle]
        .filter(Boolean)
        .join(" · ") || "Your care brief starts here.";
  }
  function populateReview() {
    const values = bookingValues();
    const details = $("#review-details");
    details.replaceChildren();
    const rows = [
      ["Your goal", goalLabels[values.goal]],
      ["Vehicle", values.vehicle],
      ["Condition", values.condition],
      ["Treatment", values.service],
      ["Preferred date", formatDate(values.date)],
      ["Preferred time", values.time + " · Baku local time"],
    ];
    rows.forEach(([term, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = value;
      details.append(dt, dd);
    });
  }
  function showBookingStep(step, focus = true) {
    bookingStep = step;
    bookingSteps.forEach((panel, index) => (panel.hidden = index !== step));
    progressItems.forEach((item, index) => {
      item.classList.toggle("current", index === step);
      item.classList.toggle("complete", index < step);
      if (index === step) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    $("#booking-back").hidden = step === 0;
    $("#step-count").textContent = `STEP 0${step + 1} OF 04`;
    $("#booking-next span").textContent =
      step === 3 ? "Complete demo" : "Continue";
    error.textContent = "";
    if (step === 3) populateReview();
    if (focus) {
      const legend = $("legend", bookingSteps[step]);
      legend.tabIndex = -1;
      legend.focus({ preventScroll: true });
      if (legend.getBoundingClientRect().top < header.offsetHeight + 20) {
        legend.scrollIntoView({
          block: "center",
          behavior: reducedMotion.matches ? "instant" : "smooth",
        });
      }
    }
  }
  function validateStep(step) {
    const values = bookingValues();
    dateInput.min = localDate();
    if (step === 0 && !values.goal)
      return "Please choose what you want to care for.";
    if (step === 1 && !values.service)
      return "Please choose a treatment or care plan.";
    if (step === 1 && !values.vehicle)
      return "Please choose your vehicle type.";
    if (step === 1 && !values.condition)
      return "Please choose the current paint condition.";
    if (
      step === 2 &&
      (!values.date || !dateInput.validity.valid || values.date < dateInput.min)
    )
      return "Please choose today or a future date.";
    if (step === 2 && !values.time) return "Please choose your preferred time.";
    return "";
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = validateStep(bookingStep);
    if (message) {
      error.textContent = message;
      return;
    }
    if (bookingStep < 3) {
      showBookingStep(bookingStep + 1);
      return;
    }
    // Revalidate every step before completion, including a date that crossed midnight.
    for (let step = 0; step < 3; step++) {
      const validation = validateStep(step);
      if (validation) {
        showBookingStep(step);
        error.textContent = validation;
        return;
      }
    }
    form.hidden = true;
    $(".booking-progress").hidden = true;
    $("#booking-success").hidden = false;
    $("#booking-success").focus({ preventScroll: true });
  });
  form.addEventListener("change", (event) => {
    if (event.target.name === "goal")
      serviceSelect.value = goalDefaults[event.target.value];
    error.textContent = "";
    updateSummary();
  });
  $("#booking-back").addEventListener("click", () =>
    showBookingStep(Math.max(bookingStep - 1, 0)),
  );
  function restartBooking(reset = true) {
    if (reset) form.reset();
    form.hidden = false;
    $(".booking-progress").hidden = false;
    $("#booking-success").hidden = true;
    showBookingStep(0, false);
    updateSummary();
  }
  $("#booking-reset").addEventListener("click", () => {
    restartBooking();
    $('input[name="goal"]').focus({ preventScroll: true });
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-service], a[data-package]");
    if (!link) return;
    restartBooking(false);
    serviceSelect.value = link.dataset.service || link.dataset.package;
    const goal = serviceGoals[serviceSelect.value] || "Advice";
    $('input[name="goal"][value="' + goal + '"]', form).checked = true;
    updateSummary();
    if (dialog.open) dialog.close();
  });
  // An anchor opened from a modal should leave keyboard focus in the new section.
  $("#project-dialog-cta").addEventListener("click", () => {
    requestAnimationFrame(() => {
      const legend = $("legend", bookingSteps[0]);
      legend.tabIndex = -1;
      legend.focus({ preventScroll: true });
    });
  });
  $("#year").textContent = new Date().getFullYear();
})();
