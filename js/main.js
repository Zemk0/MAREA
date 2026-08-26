/* ==========================================================================
   MARÉA — main.js
   Renders JSON-driven content into the page and wires up all interactivity:
   navigation, mobile menu, scroll reveal, menu filters, gallery lightbox.
   Depends on loader.js being loaded first.
   ========================================================================== */

(function () {
  "use strict";

  /* -------------------- Small utilities -------------------- */

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function formatPrice(price) {
    if (typeof price === "number") {
      return `${price.toFixed(0)}$`;
    }
    return escapeHTML(price);
  }

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function currentPageFile() {
    return location.pathname.split("/").pop() || "index.html";
  }

  /* -------------------- Navigation (shared across all pages) -------------------- */

  const FALLBACK_NAVIGATION = [
    { label: "Domov", href: "index.html#home" },
    { label: "O nás", href: "index.html#about" },
    { label: "Menu", href: "menu.html" },
    { label: "Služby", href: "index.html#services" },
    { label: "Lokalita", href: "index.html#location" },
    { label: "Eventy", href: "index.html#events" },
    { label: "Galéria", href: "galeria.html" },
    { label: "Práca", href: "praca.html" },
    { label: "Partneri", href: "partneri.html" },
    { label: "Kontakt", href: "kontakt.html" },
    { label: "Zamestnanci", href: "zamestnanci.html" },
  ];

  function renderNavigation(items) {
    const navList = qs("#nav-links");
    const footerNav = qs("#footer-nav");
    const list = Array.isArray(items) && items.length ? items : FALLBACK_NAVIGATION;

    const linksMarkup = list
      .map((item) => `<li><a href="${escapeHTML(item.href)}" class="nav-link">${escapeHTML(item.label)}</a></li>`)
      .join("");
    const footerMarkup = list
      .map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`)
      .join("");

    if (navList) navList.innerHTML = linksMarkup;
    if (footerNav) footerNav.innerHTML = footerMarkup;
  }

  /* -------------------- Icon set for services -------------------- */

  const ICONS = {
    anchor:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V21"/><path d="M5 12H2.5a9.5 9.5 0 0 0 9.5 9.5A9.5 9.5 0 0 0 21.5 12H19"/><path d="M8 9.5 12 12l4-2.5"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.8 14.7 9l6.8.6-5.1 4.5 1.6 6.7L12 17.6 5.9 20.8l1.6-6.7-5.1-4.5L9.3 9Z"/></svg>',
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M11 3 12.6 8 18 9.5 12.6 11 11 16 9.4 11 4 9.5 9.4 8Z"/><path d="M18.5 15.5 19.3 18l2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8Z"/></svg>',
    yacht:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 15 2 20h20l-2-5Z"/><path d="M6 15V5h1l9 6.5"/><path d="M11 5V2.5"/><path d="M2 20c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0"/></svg>',
    group:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M14.5 14.7c2.6.3 4.5 2.3 4.5 5.3"/></svg>',
    briefcase:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="11" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
    wave:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3"/><path d="M2 17c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3"/></svg>',
    plus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    crown:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M3 18h18l-1.5-8-4 3-2.5-5-2.5 5-4-3L3 18Z"/><path d="M3 20.5h18"/></svg>',
    cocktail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16l-8 9-8-9Z"/><path d="M12 13v7"/><path d="M8 20h8"/></svg>',
    music:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="18" r="2.4"/><circle cx="17" cy="16" r="2.4"/><path d="M9.4 18V5.5L19.4 4v12"/></svg>',
    diamond:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6Z"/></svg>',
    gift:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="4"/><rect x="4" y="13" width="16" height="8"/><path d="M12 9v12"/><path d="M12 9c-1.2-3-3-4-4.2-3S6.8 8.5 8 9Zm0 0c1.2-3 3-4 4.2-3s1 2.5-.2 3Z"/></svg>',
    link:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>',
  };

  function getIcon(name) {
    return ICONS[name] || ICONS.wave;
  }

  /* -------------------- Render: Business / Hero / About / Location -------------------- */

  function renderBusiness(business) {
    if (!business) return;

    const heroTitle = qs("#hero-title");
    const heroSubtitle = qs("#hero-subtitle");
    const heroTagline = qs("#hero-tagline");
    const heroCtaPrimary = qs("#hero-cta-primary");
    const heroCtaSecondary = qs("#hero-cta-secondary");

    if (heroTitle) heroTitle.textContent = business.hero?.title || business.name;
    if (heroSubtitle) heroSubtitle.textContent = business.hero?.subtitle || business.type;
    if (heroTagline) heroTagline.textContent = `„${business.hero?.tagline || business.slogan}“`;
    if (heroCtaPrimary) heroCtaPrimary.textContent = business.hero?.ctaPrimary || "Objaviť MARÉA";
    if (heroCtaSecondary) heroCtaSecondary.textContent = business.hero?.ctaSecondary || "Cenník";

    const aboutLead = qs("#about-lead");
    const aboutDesc = qs("#about-desc");
    const aboutConcept = qs("#about-concept");
    const aboutTagline = qs("#about-tagline");
    const aboutFocus = qs("#about-focus");

    if (aboutLead) aboutLead.textContent = business.shortDescription || "";
    if (aboutDesc) aboutDesc.textContent = business.concept || "";
    if (aboutConcept) aboutConcept.textContent = business.atmosphere || "";
    if (aboutTagline) aboutTagline.textContent = `„${business.slogan || ""}“`;

    if (aboutFocus && Array.isArray(business.focus)) {
      aboutFocus.innerHTML = business.focus
        .map((item) => `<li>${escapeHTML(item)}</li>`)
        .join("");
    }

    const locationDesc = qs("#location-description");
    const locationArea = qs("#location-fact-area");
    const locationAccess = qs("#location-fact-access");
    const locationNote = qs("#location-fact-note");

    if (locationDesc) locationDesc.textContent = business.location?.description || "";
    if (locationArea) locationArea.textContent = business.location?.area || "—";
    if (locationAccess) locationAccess.textContent = business.location?.access || "—";
    if (locationNote) locationNote.textContent = business.location?.note || "—";

    if (business.discord?.url) {
      qsa(".discord-link").forEach((el) => {
        el.href = business.discord.url;
      });
    }

    // Only the homepage's <title> should be driven by business.json — subpages
    // (menu.html, galeria.html, kontakt.html) keep their own static <title>.
    if (heroTitle) {
      document.title = `${business.name} — ${business.type} | ${business.slogan}`;
    }
  }

  /* -------------------- Render: Menu -------------------- */

  let menuItemsCache = [];
  let activeCategory = "all";
  let priceMode = "standard"; // "standard" | "member"

  const CATEGORY_LABELS = {
    all: "Všetko",
    seafood: "Morské plody",
    food: "Jedlá",
    alcohol: "Alkoholické nápoje",
    nonalcohol: "Nealkoholické nápoje",
  };

  function renderMenuItems(items) {
    const grid = qs("#menu-grid");
    if (!grid) return;

    const filtered =
      activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory);

    if (!filtered.length) {
      grid.innerHTML = `<p class="menu-empty">V tejto kategórii momentálne nemáme žiadne položky.</p>`;
      return;
    }

    grid.innerHTML = filtered
      .map((item) => {
        const showMember = priceMode === "member" && item.memberPrice != null;
        const priceMarkup = showMember
          ? `<span class="menu-item-price">
               <span class="menu-item-price-original">${formatPrice(item.price)}</span>
               <span class="menu-item-price-member">${formatPrice(item.memberPrice)}</span>
             </span>`
          : `<span class="menu-item-price">${formatPrice(item.price)}</span>`;

        return `
      <article class="card menu-item reveal is-visible">
        <div class="menu-item-head">
          <h3 class="menu-item-name">${escapeHTML(item.name)}</h3>
          ${priceMarkup}
        </div>
        <p class="menu-item-desc">${escapeHTML(item.description)}</p>
        <span class="menu-item-category">${escapeHTML(CATEGORY_LABELS[item.category] || item.category)}</span>
      </article>`;
      })
      .join("");
  }

  function setupMenuFilters(items) {
    const filterBar = qs("#menu-filters");
    if (!filterBar) return;

    const categories = ["all", ...new Set(items.map((item) => item.category))];

    filterBar.innerHTML = categories
      .map(
        (cat, i) => `
      <button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-category="${escapeHTML(cat)}">
        ${escapeHTML(CATEGORY_LABELS[cat] || cat)}
      </button>`
      )
      .join("");

    filterBar.addEventListener("click", (event) => {
      const btn = event.target.closest(".filter-btn");
      if (!btn) return;

      qsa(".filter-btn", filterBar).forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCategory = btn.dataset.category;
      renderMenuItems(menuItemsCache);
    });
  }

  function renderMenu(items) {
    const grid = qs("#menu-grid");
    if (!grid) return;

    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML = `<p class="menu-empty">Menu momentálne nie je k dispozícii. Skúste to prosím neskôr.</p>`;
      return;
    }

    menuItemsCache = items;
    setupMenuFilters(items);
    setupPriceToggle();
    renderMenuItems(items);
  }

  function setupPriceToggle() {
    const toggle = qs("#price-mode-toggle");
    if (!toggle || toggle.dataset.bound) return;
    toggle.dataset.bound = "true";

    const labels = qsa(".price-toggle-label");

    toggle.addEventListener("change", () => {
      priceMode = toggle.checked ? "member" : "standard";
      labels.forEach((label) => {
        label.classList.toggle("is-active", label.dataset.mode === priceMode);
      });
      renderMenuItems(menuItemsCache);
    });
  }

  /* -------------------- Render: Services -------------------- */

  let servicesCache = [];

  function renderServices(services) {
    const grid = qs("#services-grid");
    if (!grid) return;

    if (!Array.isArray(services) || !services.length) {
      grid.innerHTML = `<p class="state-empty">Informácie o službách momentálne nie sú k dispozícii.</p>`;
      return;
    }

    servicesCache = services;

    grid.innerHTML = services
      .map(
        (service, index) => `
      <article class="card service-card reveal" data-index="${index}">
        <div class="service-icon">${getIcon(service.icon)}</div>
        <h3 class="service-name">${escapeHTML(service.name)}</h3>
        <p class="service-desc">${escapeHTML(service.description)}</p>
        <div class="service-price">${escapeHTML(service.price)}</div>
        <button type="button" class="card-more" aria-label="Zistiť viac o ${escapeHTML(service.name)}">
          Zistiť viac <span class="card-more-arrow" aria-hidden="true">→</span>
        </button>
      </article>`
      )
      .join("");

    observeReveal();
    setupServiceModal();
  }

  function openServiceModal(index) {
    const service = servicesCache[index];
    if (!service) return;
    openInfoModal({
      eyebrow: "Služba",
      title: service.name,
      meta: service.price,
      mediaHTML: `<div class="info-modal-icon">${getIcon(service.icon)}</div>`,
      body: service.details || service.description,
    });
  }

  function setupServiceModal() {
    const grid = qs("#services-grid");
    if (!grid || grid.dataset.modalBound) return;
    grid.dataset.modalBound = "true";

    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".service-card");
      if (!card) return;
      openServiceModal(Number(card.dataset.index));
    });

    grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".service-card");
      if (!card) return;
      event.preventDefault();
      openServiceModal(Number(card.dataset.index));
    });
  }

  /* -------------------- Render: Jobs -------------------- */

  function renderJobs(jobs) {
    const grid = qs("#jobs-grid");
    if (!grid) return;

    if (!Array.isArray(jobs) || !jobs.length) {
      grid.innerHTML = `<p class="state-empty">Momentálne nemáme otvorené žiadne pozície. Sleduj náš Discord pre aktuality.</p>`;
      return;
    }

    grid.innerHTML = jobs
      .map(
        (job) => `
      <article class="card service-card reveal">
        <div class="service-icon">${getIcon(job.icon)}</div>
        <h3 class="service-name">${escapeHTML(job.title)}</h3>
        <p class="service-desc">${escapeHTML(job.description)}</p>
        <div class="service-price job-salary">
          <span class="job-salary-label">Plat</span>
          ${escapeHTML(job.salary)}
        </div>
      </article>`
      )
      .join("");

    observeReveal();
  }

  /* -------------------- Render: Partners -------------------- */

  function renderPartners(partners) {
    const grid = qs("#partners-grid");
    if (!grid) return;

    if (!Array.isArray(partners) || !partners.length) {
      grid.innerHTML = `<p class="state-empty">Momentálne nemáme žiadnych partnerov na zobrazenie.</p>`;
      return;
    }

    grid.innerHTML = partners
      .map((partner) => {
        const isMain = partner.tier === "Hlavný partner";
        const logoMarkup = partner.logo
          ? `<img src="${escapeHTML(partner.logo)}" alt="${escapeHTML(partner.name)} logo" loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="partner-logo-fallback" style="display:none;">${getIcon("link")}</div>`
          : `<div class="partner-logo-fallback">${getIcon("link")}</div>`;
        return `
      <article class="card service-card reveal">
        <span class="partner-tier${isMain ? " partner-tier-main" : ""}">${escapeHTML(partner.tier)}</span>
        <div class="partner-logo">${logoMarkup}</div>
        <h3 class="service-name">${escapeHTML(partner.name)}</h3>
        <p class="service-desc">${escapeHTML(partner.description)}</p>
      </article>`;
      })
      .join("");

    observeReveal();
  }

  /* -------------------- Render: Events -------------------- */

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" });
  }

  /* -------------------- Info modal (Services / Events) -------------------- */

  function openInfoModal({ eyebrow, title, meta, mediaHTML, body, layout = "stack" }) {
    const modal = qs("#info-modal");
    if (!modal) return;

    qs("#info-modal-eyebrow", modal).textContent = eyebrow || "";
    qs("#info-modal-title", modal).textContent = title || "";
    qs("#info-modal-meta", modal).textContent = meta || "";
    qs("#info-modal-desc", modal).textContent = body || "";
    qs("#info-modal-media", modal).innerHTML = mediaHTML || "";
    qs("#info-modal-content", modal).classList.toggle("is-split", layout === "split");

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeInfoModal() {
    const modal = qs("#info-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function setupInfoModal() {
    const modal = qs("#info-modal");
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = "true";

    qs("#info-modal-close", modal).addEventListener("click", closeInfoModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeInfoModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeInfoModal();
    });
  }

  let eventsCache = [];

  function renderEvents(events) {
    const grid = qs("#events-grid");
    if (!grid) return;

    if (!Array.isArray(events) || !events.length) {
      grid.innerHTML = `<p class="events-empty">Momentálne je na palube pokoj — nové eventy sa pripravujú. Sledujte nás, aby ste nezmeškali ďalšiu vlnu zábavy na MARÉA.</p>`;
      return;
    }

    eventsCache = events;

    grid.innerHTML = events
      .map(
        (event, index) => `
      <article class="card event-card reveal" data-index="${index}">
        <div class="event-media">
          <img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.name)}" loading="lazy"
               onerror="this.closest('.event-media').style.background='linear-gradient(150deg,#0a2540,#123249)'; this.remove();">
          <span class="event-date">${escapeHTML(formatDate(event.date))}</span>
        </div>
        <div class="event-body">
          <h3 class="event-name">${escapeHTML(event.name)}</h3>
          <p class="event-desc">${escapeHTML(event.description)}</p>
          <button type="button" class="card-more" aria-label="Zistiť viac o ${escapeHTML(event.name)}">
            Zistiť viac <span class="card-more-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </article>`
      )
      .join("");

    observeReveal();
    setupEventModal();
  }

  function openEventModal(index) {
    const event = eventsCache[index];
    if (!event) return;
    openInfoModal({
      eyebrow: "Event",
      title: event.name,
      meta: formatDate(event.date),
      mediaHTML: `<img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.name)}"
                       onerror="this.remove();">`,
      body: event.details || event.description,
      layout: "split",
    });
  }

  function setupEventModal() {
    const grid = qs("#events-grid");
    if (!grid || grid.dataset.modalBound) return;
    grid.dataset.modalBound = "true";

    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".event-card");
      if (!card) return;
      openEventModal(Number(card.dataset.index));
    });

    grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".event-card");
      if (!card) return;
      event.preventDefault();
      openEventModal(Number(card.dataset.index));
    });
  }

  /* -------------------- Render: Gallery + Lightbox -------------------- */

  let galleryCache = [];
  let lightboxIndex = 0;

  function renderGallery(images) {
    const grid = qs("#gallery-grid");
    if (!grid) return;

    if (!Array.isArray(images) || !images.length) {
      grid.innerHTML = `<p class="state-empty">Galéria momentálne nie je k dispozícii.</p>`;
      return;
    }

    galleryCache = images;

    grid.innerHTML = images
      .map(
        (img, index) => `
      <figure class="gallery-item reveal" data-index="${index}" tabindex="0" role="button"
              aria-label="Zobraziť fotografiu: ${escapeHTML(img.caption || "")}">
        <img src="${escapeHTML(img.image)}" alt="${escapeHTML(img.caption || "MARÉA")}" loading="lazy">
        <figcaption class="gallery-caption">${escapeHTML(img.caption || "")}</figcaption>
      </figure>`
      )
      .join("");

    observeReveal();
    setupLightbox();
  }

  function openLightbox(index) {
    const lightbox = qs("#lightbox");
    if (!lightbox || !galleryCache[index]) return;

    lightboxIndex = index;
    const item = galleryCache[index];
    qs("#lightbox-img", lightbox).src = item.image;
    qs("#lightbox-img", lightbox).alt = item.caption || "MARÉA";
    qs("#lightbox-caption", lightbox).textContent = item.caption || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lightbox = qs("#lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function showRelative(offset) {
    if (!galleryCache.length) return;
    const next = (lightboxIndex + offset + galleryCache.length) % galleryCache.length;
    openLightbox(next);
  }

  function setupLightbox() {
    const grid = qs("#gallery-grid");
    const lightbox = qs("#lightbox");
    if (!grid || !lightbox || grid.dataset.lightboxBound) return;

    grid.dataset.lightboxBound = "true";

    grid.addEventListener("click", (event) => {
      const item = event.target.closest(".gallery-item");
      if (!item) return;
      openLightbox(Number(item.dataset.index));
    });

    grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const item = event.target.closest(".gallery-item");
      if (!item) return;
      event.preventDefault();
      openLightbox(Number(item.dataset.index));
    });

    qs("#lightbox-close", lightbox).addEventListener("click", closeLightbox);
    qs("#lightbox-prev", lightbox).addEventListener("click", () => showRelative(-1));
    qs("#lightbox-next", lightbox).addEventListener("click", () => showRelative(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showRelative(-1);
      if (event.key === "ArrowRight") showRelative(1);
    });
  }

  /* -------------------- Render: Contacts -------------------- */

  function renderContacts(contacts) {
    const grid = qs("#contacts-grid");
    if (!grid) return;

    if (!Array.isArray(contacts) || !contacts.length) {
      grid.innerHTML = `<p class="state-empty">Kontaktné informácie momentálne nie sú k dispozícii.</p>`;
      return;
    }

    grid.innerHTML = contacts
      .map(
        (person) => `
      <article class="card contact-card reveal">
        <div class="contact-avatar">
          <img src="${escapeHTML(person.image)}" alt="${escapeHTML(person.name)}" loading="lazy">
        </div>
        <h3 class="contact-name">${escapeHTML(person.name)}</h3>
        <p class="contact-role">${escapeHTML(person.role)}</p>
        <p class="contact-info">${escapeHTML(person.contact)}</p>
      </article>`
      )
      .join("");

    observeReveal();
  }

  /* -------------------- Scroll reveal -------------------- */

  let revealObserver;

  function observeReveal() {
    if (!("IntersectionObserver" in window)) {
      qsa(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
    }

    qsa(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
  }

  /* -------------------- Navbar: scroll state + active link -------------------- */

  function setupNavbar() {
    const navbar = qs("#navbar");
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 40);
      toggleBackToTop();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const currentPage = currentPageFile();
    const links = qsa(".nav-link");

    // For "href" like "menu.html" or "index.html#about", resolve the "#id" part
    // ONLY when it targets a section on the page currently being viewed.
    // Cross-page anchors (e.g. "index.html#about" while on menu.html) must not
    // be handed to querySelector() as-is, since "page.html#id" is not valid
    // selector syntax and would throw.
    function hashOnThisPage(href) {
      const hashPos = href.indexOf("#");
      if (hashPos === -1) return null;
      const pagePart = href.slice(0, hashPos);
      if (pagePart && pagePart !== currentPage) return null;
      return href.slice(hashPos);
    }

    // Pure page links (no "#"), e.g. "menu.html" while viewing menu.html,
    // get a static active state — there's no scroll position to track.
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.includes("#") && href === currentPage) {
        link.classList.add("is-active");
      }
    });

    const sections = links
      .map((link) => {
        const hash = hashOnThisPage(link.getAttribute("href") || "");
        return hash ? document.querySelector(hash) : null;
      })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => {
              if (link.getAttribute("href").includes("#")) link.classList.remove("is-active");
            });
            const match = links.find(
              (link) => hashOnThisPage(link.getAttribute("href") || "") === `#${entry.target.id}`
            );
            if (match) match.classList.add("is-active");
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((section) => navObserver.observe(section));
    }
  }

  function setupMobileMenu() {
    const hamburger = qs("#hamburger");
    const navLinks = qs("#nav-links");
    if (!hamburger || !navLinks) return;

    const closeMenu = () => {
      hamburger.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    qsa("a", navLinks).forEach((link) => link.addEventListener("click", closeMenu));

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1060) closeMenu();
    });
  }

  /* -------------------- Back to top -------------------- */

  function toggleBackToTop() {
    const btn = qs("#back-to-top");
    if (!btn) return;
    btn.classList.toggle("is-visible", window.scrollY > 600);
  }

  function setupBackToTop() {
    const btn = qs("#back-to-top");
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------- Footer year -------------------- */

  function setFooterYear() {
    const el = qs("#footer-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* -------------------- Staff area (zamestnanci.html) --------------------
     Client-side only: the "access code" gate is a soft deterrent (keeps
     casual visitors and search engines out of the flow), not real security —
     the code lives in a public JSON file, like everything else on this
     static site. Good enough for an internal FiveM RP staff shortcut shared
     over Discord, not for protecting anything actually sensitive. */

  function setupStaffGate(staff) {
    const gate = qs("#staff-gate");
    const content = qs("#staff-content");
    const form = qs("#staff-gate-form");
    if (!gate || !content || !form) return;

    const input = qs("#staff-gate-input", form);
    const errorMsg = qs("#staff-gate-error");
    const accessCode = staff?.accessCode;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!accessCode) {
        if (errorMsg) errorMsg.hidden = false;
        return;
      }

      const entered = (input.value || "").trim();
      if (entered.toLowerCase() === accessCode.toLowerCase()) {
        gate.hidden = true;
        content.hidden = false;
        observeReveal();
      } else if (errorMsg) {
        errorMsg.hidden = false;
        input.select();
      }
    });
  }

  function renderStaffNotes(staff) {
    const list = qs("#staff-notes");
    if (!list) return;

    const notes = staff?.notes;
    if (!Array.isArray(notes) || !notes.length) {
      list.innerHTML = `<li>Momentálne nie sú k dispozícii žiadne prevádzkové poznámky.</li>`;
      return;
    }

    list.innerHTML = notes.map((note) => `<li>${escapeHTML(note)}</li>`).join("");
  }

  function renderStaffPage(staff) {
    setupStaffGate(staff);
    renderStaffNotes(staff);
  }

  // Order calculator — independent from the public Menu page's own cache,
  // since renderMenu() no-ops on pages without #menu-grid. Cart-style flow:
  // click a menu item to add it to the cart, then adjust qty (+/−) there.
  let calcMenuCache = [];
  let calcCart = {}; // index -> qty; only entries > 0 count as "in the cart"
  let calcDiscountApplied = false;
  let calcCategory = "all";

  function calcUnitPrice(item) {
    return calcDiscountApplied && item.memberPrice != null ? item.memberPrice : item.price;
  }

  function calcTotal() {
    return Object.entries(calcCart).reduce((sum, [index, qty]) => {
      const item = calcMenuCache[index];
      return item ? sum + qty * calcUnitPrice(item) : sum;
    }, 0);
  }

  function renderCalcPicker() {
    const picker = qs("#calc-picker");
    if (!picker) return;

    const entries = calcMenuCache
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => calcCategory === "all" || item.category === calcCategory);

    if (!entries.length) {
      picker.innerHTML = `<tr><td colspan="2" class="menu-empty">V tejto kategórii momentálne nemáme žiadne položky.</td></tr>`;
      return;
    }

    picker.innerHTML = entries
      .map(({ item, index }) => {
        const qty = calcCart[index] || 0;
        return `
      <tr class="calc-table-row${qty > 0 ? " is-added" : ""}" data-index="${index}" tabindex="0" role="button"
          aria-label="Pridať ${escapeHTML(item.name)} do košíka">
        <td class="calc-table-name">${escapeHTML(item.name)}</td>
        <td class="calc-table-price">
          ${formatPrice(calcUnitPrice(item))}
          ${qty > 0 ? `<span class="calc-chip-badge">${qty}</span>` : ""}
        </td>
      </tr>`;
      })
      .join("");
  }

  function renderCalcCart() {
    const cart = qs("#calc-cart");
    if (!cart) return;

    const entries = Object.entries(calcCart).filter(([, qty]) => qty > 0);

    if (!entries.length) {
      cart.innerHTML = `<p class="calc-cart-empty">Košík je prázdny — klikni na položku vyššie a pridaj ju sem.</p>`;
      return;
    }

    cart.innerHTML = entries
      .map(([index, qty]) => {
        const item = calcMenuCache[index];
        if (!item) return "";
        return `
      <div class="calc-cart-row" data-index="${index}">
        <div class="calc-cart-name">${escapeHTML(item.name)}</div>
        <div class="calc-cart-controls">
          <div class="calc-cart-qty">
            <button type="button" class="calc-qty-btn" data-action="dec" aria-label="Ubrať ${escapeHTML(item.name)}">−</button>
            <span class="calc-qty-value">${qty}</span>
            <button type="button" class="calc-qty-btn" data-action="inc" aria-label="Pridať ${escapeHTML(item.name)}">+</button>
          </div>
          <div class="calc-cart-subtotal">${formatPrice(qty * calcUnitPrice(item))}</div>
          <button type="button" class="calc-cart-remove" data-action="remove" aria-label="Odstrániť ${escapeHTML(item.name)} z košíka">✕</button>
        </div>
      </div>`;
      })
      .join("");
  }

  function updateCalcTotals() {
    renderCalcPicker();
    renderCalcCart();
    const totalEl = qs("#calc-total-value");
    if (totalEl) totalEl.textContent = formatPrice(calcTotal());
  }

  function setupCalcFilters() {
    const filterBar = qs("#calc-filters");
    if (!filterBar) return;

    const categories = ["all", ...new Set(calcMenuCache.map((item) => item.category))];

    filterBar.innerHTML = categories
      .map(
        (cat, i) => `
      <button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-category="${escapeHTML(cat)}">
        ${escapeHTML(CATEGORY_LABELS[cat] || cat)}
      </button>`
      )
      .join("");

    if (filterBar.dataset.bound) return;
    filterBar.dataset.bound = "true";

    filterBar.addEventListener("click", (event) => {
      const btn = event.target.closest(".filter-btn");
      if (!btn) return;

      qsa(".filter-btn", filterBar).forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      calcCategory = btn.dataset.category;
      renderCalcPicker();
    });
  }

  function renderStaffCalculator(items) {
    const picker = qs("#calc-picker");
    if (!picker) return;

    if (!Array.isArray(items) || !items.length) {
      picker.innerHTML = `<p class="state-empty">Menu momentálne nie je k dispozícii.</p>`;
      return;
    }

    calcMenuCache = items;
    calcCart = {};
    calcCategory = "all";

    setupCalcFilters();
    updateCalcTotals();
    setupCalculator();
  }

  function setupCalculator() {
    const picker = qs("#calc-picker");
    const cart = qs("#calc-cart");
    const discountToggle = qs("#calc-discount-toggle");
    const resetBtn = qs("#calc-reset");
    if (!picker || !cart) return;

    if (!picker.dataset.bound) {
      picker.dataset.bound = "true";
      picker.addEventListener("click", (event) => {
        const row = event.target.closest(".calc-table-row");
        if (!row) return;
        const index = Number(row.dataset.index);
        calcCart[index] = (calcCart[index] || 0) + 1;
        updateCalcTotals();
      });

      picker.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const row = event.target.closest(".calc-table-row");
        if (!row) return;
        event.preventDefault();
        const index = Number(row.dataset.index);
        calcCart[index] = (calcCart[index] || 0) + 1;
        updateCalcTotals();
      });
    }

    if (!cart.dataset.bound) {
      cart.dataset.bound = "true";
      cart.addEventListener("click", (event) => {
        const actionBtn = event.target.closest("[data-action]");
        const row = event.target.closest(".calc-cart-row");
        if (!actionBtn || !row) return;
        const index = Number(row.dataset.index);

        if (actionBtn.dataset.action === "inc") {
          calcCart[index] = (calcCart[index] || 0) + 1;
        } else if (actionBtn.dataset.action === "dec") {
          calcCart[index] = Math.max(0, (calcCart[index] || 0) - 1);
        } else if (actionBtn.dataset.action === "remove") {
          calcCart[index] = 0;
        }

        updateCalcTotals();
      });
    }

    if (discountToggle && !discountToggle.dataset.bound) {
      discountToggle.dataset.bound = "true";
      discountToggle.addEventListener("change", () => {
        calcDiscountApplied = discountToggle.checked;
        updateCalcTotals();
      });
    }

    if (resetBtn && !resetBtn.dataset.bound) {
      resetBtn.dataset.bound = "true";
      resetBtn.addEventListener("click", () => {
        calcCart = {};
        updateCalcTotals();
      });
    }
  }

  /* -------------------- Init -------------------- */

  async function init() {
    const navItems = await loadNavigation();
    renderNavigation(navItems);

    setupNavbar();
    setupMobileMenu();
    setupBackToTop();
    setupInfoModal();
    setFooterYear();

    const results = await Promise.allSettled([
      loadBusiness().then(renderBusiness),
      loadMenu().then(renderMenu),
      loadServices().then(renderServices),
      loadJobs().then(renderJobs),
      loadPartners().then(renderPartners),
      loadEvents().then(renderEvents),
      loadGallery().then(renderGallery),
      loadContacts().then(renderContacts),
      loadMenu().then(renderStaffCalculator),
      loadStaff().then(renderStaffPage),
    ]);

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[MARÉA] Section failed to render:", result.reason);
      }
    });

    observeReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
