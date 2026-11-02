// Jelajah (explore) page — ported from src/app/(app)/jelajah/page.tsx
// (+ src/components/explore/explore-client.tsx).
//
// The React version keeps filtering state in useState and lets react-leaflet
// reconcile markers. Here the page markup is rendered once, then every state
// change re-renders the affected regions (pills, price buttons, counts, list)
// and rebuilds the Leaflet markers when the visible place set changes.
import { initPage, mainEl, showError } from "../page-common.js";
import { refreshIcons, icon } from "../components/icons.js";
import { createPlaceMap } from "../components/map.js";
import { placeRow } from "../components/cards.js";
import { badge, buttonClass, emptyState, inputH } from "../components/ui.js";
import { getPlaces, getCategories } from "../api/places.js";
import { PRICE_LEVELS, SITE } from "../config.js";
import { escapeHtml } from "../utils.js";

const ALL = "semua";

const params = new URLSearchParams(window.location.search);

const state = {
  query: params.get("q") ?? "",
  category: params.get("kategori") || ALL,
  priceLevel: null,
  facility: null,
  maxDistance: null,
  selectedId: null,
  mobileView: "list",
};

let places = [];
let categories = [];
let campus = null;
let isDemo = false;

let mapEl = null;
let mapInstance = null;
let mapKey = "";

/* -------------------------------- filtering ------------------------------- */

function filteredPlaces() {
  const term = state.query.trim().toLowerCase();

  return [...places]
    .filter((place) => {
      if (state.category !== ALL && place.category.slug !== state.category) return false;
      if (state.priceLevel !== null && place.price_level !== state.priceLevel) return false;
      if (state.facility && !place.facilities.includes(state.facility)) return false;
      if (state.maxDistance !== null && (place.distance_km ?? 99) > state.maxDistance) return false;
      if (!term) return true;

      const haystack = [
        place.name,
        place.category.name,
        place.description,
        place.address,
        ...place.facilities,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    })
    .sort((a, b) => (a.distance_km ?? 99) - (b.distance_km ?? 99));
}

function activeFilterCount() {
  return (
    (state.category !== ALL ? 1 : 0) +
    (state.priceLevel !== null ? 1 : 0) +
    (state.facility ? 1 : 0) +
    (state.maxDistance !== null ? 1 : 0)
  );
}

function facilityOptions() {
  return Array.from(new Set(places.flatMap((place) => place.facilities)))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 14);
}

/* ------------------------------ static markup ----------------------------- */

function categoryPillsHtml() {
  const items = [{ slug: ALL, name: "Semua" }, ...categories.map((item) => ({ slug: item.slug, name: item.name }))];

  return items
    .map((item) => {
      const active = state.category === item.slug;
      return `<button
        type="button"
        data-category="${escapeHtml(item.slug)}"
        aria-pressed="${active}"
        class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          active ? "border-ink bg-signal text-ink" : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink"
        }"
      >${escapeHtml(item.name)}</button>`;
    })
    .join("");
}

function priceButtonsHtml() {
  const options = [
    { value: null, label: "Semua" },
    ...PRICE_LEVELS.slice(0, 3).map((level) => ({ value: level.value, label: level.label })),
  ];

  return options
    .map((option) => {
      const active = state.priceLevel === option.value;
      return `<button
        type="button"
        data-price="${option.value === null ? "" : escapeHtml(option.value)}"
        aria-pressed="${active}"
        class="rounded-full border px-2.5 py-1.5 text-xs transition-colors ${
          active ? "border-ink bg-paper-deep text-ink" : "border-line text-muted hover:border-ink/40 hover:text-ink"
        }"
      >${escapeHtml(option.label)}</button>`;
    })
    .join("");
}

function viewToggleHtml() {
  const button = (view, iconName, label) => {
    const active = state.mobileView === view;
    return `<button
      type="button"
      data-view="${view}"
      aria-pressed="${active}"
      class="inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-sm ${
        active ? "border-ink bg-ink text-surface" : "border-line text-muted"
      }"
    >${icon(iconName, "h-4 w-4")}${label}</button>`;
  };

  return `${button("list", "list", "Daftar")}${button("map", "map", "Peta")}`;
}

function pageHtml() {
  const campusName = campus?.name ?? SITE.campusName;
  const campusCity = campus?.city ?? SITE.city;
  // Same responsive trick as the source: on mobile only one panel is shown.
  const mapSectionClass = `min-w-0${state.mobileView === "list" ? " hidden lg:block" : ""}`;
  const listSectionClass = `min-w-0${state.mobileView === "map" ? " hidden lg:block" : ""}`;

  return `<div class="container-page py-6 lg:py-8">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-signal" aria-hidden="true"></span>
            <span class="font-mono text-[11px] text-muted">${escapeHtml(campusName)} · ${escapeHtml(campusCity)}</span>
            ${isDemo ? badge("Data demo", { variant: "signal" }) : ""}
          </div>
          <h1 class="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Jelajah sekitar kampus.
          </h1>
          <p class="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">
            Cari tempat yang sudah terverifikasi. Harga dan fasilitas adalah informasi awal dari
            komunitas, bukan jaminan.
          </p>
        </div>

        <div class="flex items-center gap-2 lg:hidden" role="group" aria-label="Tampilan" data-view-toggle>${viewToggleHtml()}</div>
      </div>

      <div class="mt-5 rounded-md border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:p-5">
        <label for="place-search" class="sr-only">
          Cari tempat
        </label>
        <div class="relative">
          ${icon("search", "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted")}
          <input
            id="place-search"
            data-search
            type="search"
            value="${escapeHtml(state.query)}"
            placeholder="Cari nama, kategori, fasilitas"
            class="${inputH} pl-9"
          />
        </div>

        <div
          class="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter kategori"
          data-categories
        >${categoryPillsHtml()}</div>

        <details class="mt-3 border-t border-line pt-3">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-ink">
            <span class="inline-flex items-center gap-2">
              ${icon("sliders-horizontal", "h-3.5 w-3.5")}
              Filter lain
              <span data-active-filters></span>
            </span>
            <span class="font-mono text-[10px] text-muted" data-result-count></span>
          </summary>

          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <fieldset>
              <legend class="text-xs font-medium text-ink">Harga</legend>
              <div class="mt-2 flex flex-wrap gap-2" data-prices>${priceButtonsHtml()}</div>
            </fieldset>

            <div>
              <label for="distance-filter" class="text-xs font-medium text-ink">
                Jarak maksimum
              </label>
              <select
                id="distance-filter"
                data-distance
                class="mt-2 h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink"
              >
                <option value="">Semua jarak</option>
                <option value="1">1 km</option>
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
              </select>
            </div>

            <div>
              <label for="facility-filter" class="text-xs font-medium text-ink">
                Fasilitas
              </label>
              <select
                id="facility-filter"
                data-facility
                class="mt-2 h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink"
              >
                <option value="">Semua fasilitas</option>
                ${facilityOptions()
                  .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
                  .join("")}
              </select>
            </div>

            <div class="flex items-end">
              <button
                type="button"
                data-reset
                class="${buttonClass({ variant: "outline", size: "sm", className: "w-full" })}"
              >
                ${icon("rotate-ccw", "h-3.5 w-3.5")}Reset filter
              </button>
            </div>
          </div>
        </details>
      </div>

      <div class="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section
          class="${mapSectionClass}"
          aria-label="Peta tempat"
          data-map-section
        >
          <div class="relative h-[380px] overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:h-[440px] lg:h-[560px]">
            <div
              class="relative isolate h-full w-full overflow-hidden rounded-none border-0 bg-paper-deep"
              role="region"
              aria-label="Peta tempat terverifikasi di sekitar kampus"
            >
              <div data-map class="h-full w-full"></div>
            </div>
            <div
              class="pointer-events-none absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-full border border-line bg-surface/95 px-2.5 py-1 font-mono text-[10px] text-muted shadow-sm backdrop-blur"
              aria-hidden="true"
              data-map-count
            ></div>
            <div class="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-sm border border-line bg-surface/95 px-2 py-1 font-mono text-[10px] text-muted">
              ${escapeHtml(SITE.osmAttribution)}
            </div>
          </div>
        </section>

        <section
          class="${listSectionClass}"
          aria-label="Daftar tempat"
          data-list-section
        >
          <div class="flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] lg:h-[560px]">
            <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div>
                <h2 class="font-display text-lg font-semibold leading-tight">
                  Daftar tempat
                </h2>
                <p class="mt-0.5 font-mono text-[10px] text-muted" role="status" data-list-count></p>
              </div>
              ${badge("Terdekat", { variant: "outline", className: "shrink-0" })}
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto" data-list></div>
          </div>
        </section>
      </div>
    </div>`;
}

/* -------------------------------- rendering ------------------------------- */

function renderList(filtered) {
  const list = mainEl().querySelector("[data-list]");
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="p-4">
      ${emptyState({
        title: "Belum ada yang cocok",
        description:
          "Coba hapus satu filter atau cari kata yang lebih umum, misalnya nama kategori.",
        actionHtml: `<button type="button" data-reset class="${buttonClass({
          variant: "outline",
          size: "sm",
        })}">Hapus semua filter</button>`,
      })}
    </div>`;
    return;
  }

  list.innerHTML = filtered
    .map((place) => placeRow(place, { active: state.selectedId === place.id }))
    .join("");
}

function renderMap(filtered) {
  if (!mapEl) return;

  const key = filtered.map((place) => place.id).join("|");
  // Markers only need to be rebuilt when the visible set changes; selection is
  // applied separately so panning/zooming survives filter tweaks and hovers.
  if (key === mapKey && mapInstance) {
    mapInstance.setSelected(state.selectedId);
    return;
  }

  if (mapInstance) {
    mapInstance.destroy();
    mapInstance = null;
  }

  mapEl.innerHTML = "";
  mapEl.className = "h-full w-full";
  mapInstance = createPlaceMap(mapEl, {
    places: filtered,
    selectedId: state.selectedId,
    onSelect: (id) => setSelected(id),
    interactive: true,
  });
  mapKey = key;
}

function syncFilterInputs() {
  const root = mainEl();
  const search = root.querySelector("[data-search]");
  if (search && search.value !== state.query) search.value = state.query;

  const distance = root.querySelector("[data-distance]");
  if (distance) distance.value = state.maxDistance === null ? "" : String(state.maxDistance);

  const facility = root.querySelector("[data-facility]");
  if (facility) facility.value = state.facility ?? "";
}

function renderResults() {
  const root = mainEl();
  const filtered = filteredPlaces();

  const categoriesNode = root.querySelector("[data-categories]");
  if (categoriesNode) categoriesNode.innerHTML = categoryPillsHtml();

  const pricesNode = root.querySelector("[data-prices]");
  if (pricesNode) pricesNode.innerHTML = priceButtonsHtml();

  const active = activeFilterCount();
  const activeNode = root.querySelector("[data-active-filters]");
  if (activeNode) {
    activeNode.innerHTML =
      active > 0
        ? `<span class="rounded-full bg-ink px-1.5 py-0.5 font-mono text-[10px] text-surface">${active}</span>`
        : "";
  }

  const resultNode = root.querySelector("[data-result-count]");
  if (resultNode) resultNode.textContent = `${filtered.length} hasil`;

  const mapCountNode = root.querySelector("[data-map-count]");
  if (mapCountNode) {
    mapCountNode.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true"></span>${filtered.length} tempat`;
  }

  const listCountNode = root.querySelector("[data-list-count]");
  if (listCountNode) listCountNode.textContent = `${filtered.length} tempat · urut dari yang terdekat`;

  renderList(filtered);
  renderMap(filtered);
  refreshIcons();
}

function applyRowActive(row, active) {
  row.classList.toggle("bg-signal/15", active);
  row.classList.toggle("hover:bg-surface", !active);
}

function setSelected(id) {
  if (state.selectedId === id) return;
  state.selectedId = id;

  mainEl()
    .querySelectorAll("[data-place-id]")
    .forEach((row) => applyRowActive(row, row.dataset.placeId === id));

  if (mapInstance) {
    mapInstance.setSelected(id);
    mapInstance.focus(id);
  }
}

function syncMobileView() {
  const root = mainEl();
  const mapSection = root.querySelector("[data-map-section]");
  const listSection = root.querySelector("[data-list-section]");
  const mapHidden = state.mobileView === "list";
  const listHidden = state.mobileView === "map";

  mapSection?.classList.toggle("hidden", mapHidden);
  mapSection?.classList.toggle("lg:block", mapHidden);
  listSection?.classList.toggle("hidden", listHidden);
  listSection?.classList.toggle("lg:block", listHidden);

  const toggle = root.querySelector("[data-view-toggle]");
  if (toggle) toggle.innerHTML = viewToggleHtml();

  refreshIcons();
  // The map was display:none while hidden, so force a fresh size when it shows.
  if (mapInstance) mapInstance.map.invalidateSize();
}

function resetFilters() {
  state.query = "";
  state.category = ALL;
  state.priceLevel = null;
  state.facility = null;
  state.maxDistance = null;
  syncFilterInputs();
  renderResults();
}

/* --------------------------------- events --------------------------------- */

function bindEvents() {
  const root = mainEl();

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const viewButton = target.closest("[data-view]");
    if (viewButton) {
      state.mobileView = viewButton.dataset.view === "map" ? "map" : "list";
      syncMobileView();
      return;
    }

    const categoryButton = target.closest("[data-category]");
    if (categoryButton) {
      state.category = categoryButton.dataset.category || ALL;
      renderResults();
      return;
    }

    const priceButton = target.closest("[data-price]");
    if (priceButton) {
      const raw = priceButton.dataset.price ?? "";
      state.priceLevel = raw === "" ? null : Number(raw);
      renderResults();
      return;
    }

    if (target.closest("[data-reset]")) {
      resetFilters();
    }
  });

  root.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof Element && target.matches("[data-search]")) {
      state.query = target.value;
      renderResults();
    }
  });

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    if (target.matches("[data-distance]")) {
      state.maxDistance = target.value === "" ? null : Number(target.value);
      renderResults();
      return;
    }

    if (target.matches("[data-facility]")) {
      state.facility = target.value === "" ? null : target.value;
      renderResults();
    }
  });

  // PlaceRow wires onMouseEnter/onFocus; mouseenter does not bubble, so listen
  // for the bubbling equivalents.
  const hoverRow = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest("[data-place-id]");
    if (row) setSelected(row.dataset.placeId);
  };

  root.addEventListener("mouseover", hoverRow);
  root.addEventListener("focusin", hoverRow);
}

/* ---------------------------------- mount --------------------------------- */

const { current, campus: defaultCampus } = await initPage();

campus = defaultCampus;
isDemo = Boolean(current?.isDemo);

if (!campus) {
  showError(mainEl(), "Data kampus belum tersedia.");
} else {
  try {
    [places, categories] = await Promise.all([getPlaces(), getCategories()]);

    mainEl().innerHTML = pageHtml();
    mapEl = mainEl().querySelector("[data-map]");

    bindEvents();
    renderResults();
  } catch (error) {
    showError(mainEl(), escapeHtml(error?.message ?? ""));
  }
}
