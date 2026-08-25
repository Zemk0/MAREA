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
    { label: "Kontakt", href: "kontakt.html" },
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
      .map(
        (item) => `
      <article class="card menu-item reveal is-visible">
        <div class="menu-item-head">
          <h3 class="menu-item-name">${escapeHTML(item.name)}</h3>
          <span class="menu-item-price">${formatPrice(item.price)}</span>
        </div>
        <p class="menu-item-desc">${escapeHTML(item.description)}</p>
        <span class="menu-item-category">${escapeHTML(CATEGORY_LABELS[item.category] || item.category)}</span>
      </article>`
      )
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
    renderMenuItems(items);
  }

  /* -------------------- Render: Services -------------------- */

  function renderServices(services) {
    const grid = qs("#services-grid");
    if (!grid) return;

    if (!Array.isArray(services) || !services.length) {
      grid.innerHTML = `<p class="state-empty">Informácie o službách momentálne nie sú k dispozícii.</p>`;
      return;
    }

    grid.innerHTML = services
      .map(
        (service) => `
      <article class="card service-card reveal">
        <div class="service-icon">${getIcon(service.icon)}</div>
        <h3 class="service-name">${escapeHTML(service.name)}</h3>
        <p class="service-desc">${escapeHTML(service.description)}</p>
        <div class="service-price">${escapeHTML(service.price)}</div>
      </article>`
      )
      .join("");

    observeReveal();
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
        <div class="service-price job-requirements">
          <span class="job-requirements-label">Požiadavky</span>
          ${escapeHTML(job.requirements)}
        </div>
      </article>`
      )
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

  function renderEvents(events) {
    const grid = qs("#events-grid");
    if (!grid) return;

    if (!Array.isArray(events) || !events.length) {
      grid.innerHTML = `<p class="events-empty">Momentálne nemáme naplánované žiadne eventy.</p>`;
      return;
    }

    grid.innerHTML = events
      .map(
        (event) => `
      <article class="card event-card reveal">
        <div class="event-media">
          <img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.name)}" loading="lazy"
               onerror="this.closest('.event-media').style.background='linear-gradient(150deg,#0a2540,#123249)'; this.remove();">
          <span class="event-date">${escapeHTML(formatDate(event.date))}</span>
        </div>
        <div class="event-body">
          <h3 class="event-name">${escapeHTML(event.name)}</h3>
          <p class="event-desc">${escapeHTML(event.description)}</p>
        </div>
      </article>`
      )
      .join("");

    observeReveal();
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

  /* -------------------- Init -------------------- */

  async function init() {
    const navItems = await loadNavigation();
    renderNavigation(navItems);

    setupNavbar();
    setupMobileMenu();
    setupBackToTop();
    setFooterYear();

    const results = await Promise.allSettled([
      loadBusiness().then(renderBusiness),
      loadMenu().then(renderMenu),
      loadServices().then(renderServices),
      loadJobs().then(renderJobs),
      loadEvents().then(renderEvents),
      loadGallery().then(renderGallery),
      loadContacts().then(renderContacts),
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
