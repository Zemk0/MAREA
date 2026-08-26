/* ==========================================================================
   MARÉA — loader.js
   Generic JSON fetch helper + one dedicated loader function per data file.
   Works fully client-side (fetch + relative paths) so it runs unmodified
   on GitHub Pages.
   ========================================================================== */

/**
 * Fetches and parses a JSON file relative to the site root.
 * Never throws to the caller — logs to console and resolves to `fallback`
 * so a single missing/broken file can't break the rest of the page.
 * @param {string} path
 * @param {*} fallback
 * @returns {Promise<*>}
 */
async function fetchJSON(path, fallback = null) {
  try {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while loading ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[MARÉA loader] Failed to load "${path}":`, error);
    return fallback;
  }
}

const DATA_PATHS = {
  navigation: "data/navigation.json",
  business: "data/business.json",
  menu: "data/menu.json",
  services: "data/services.json",
  contacts: "data/contacts.json",
  events: "data/events.json",
  gallery: "data/gallery.json",
  jobs: "data/jobs.json",
  partners: "data/partners.json",
  staff: "data/staff.json",
};

function loadNavigation() {
  return fetchJSON(DATA_PATHS.navigation, []);
}

function loadBusiness() {
  return fetchJSON(DATA_PATHS.business, null);
}

function loadMenu() {
  return fetchJSON(DATA_PATHS.menu, []);
}

function loadServices() {
  return fetchJSON(DATA_PATHS.services, []);
}

function loadContacts() {
  return fetchJSON(DATA_PATHS.contacts, []);
}

function loadEvents() {
  return fetchJSON(DATA_PATHS.events, []);
}

function loadGallery() {
  return fetchJSON(DATA_PATHS.gallery, []);
}

function loadJobs() {
  return fetchJSON(DATA_PATHS.jobs, []);
}

function loadPartners() {
  return fetchJSON(DATA_PATHS.partners, []);
}

function loadStaff() {
  return fetchJSON(DATA_PATHS.staff, null);
}
