const archive = window.FILM_ARCHIVE || { photos: [], categories: [], hero: "" };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const I18N = {
  zh: {
    "nav.subjects": "题材", "nav.catalogue": "图录", "nav.index": "索引",
    "plate.01": "图版 01", "plate.02": "图版 02", "plate.03": "图版 03",
    "plate.04": "图版 04", "plate.05": "图版 05",
    "hero.plate": "序章 · Prologue",
    "hero.copy": "一部以胶片为媒介的影像图录。按建筑、风光、人像与街头四类题材重新编排，以博物馆式的图版顺序逐帧呈现。",
    "hero.enter": "进入图录", "hero.subjects": "浏览题材",
    "panel.frames": "帧", "panel.categories": "题材", "panel.medium": "胶片",
    "cat.plate": "题材 · Subjects", "cat.heading": "按题材编排的图版",
    "gal.plate": "图录 · Catalogue", "gal.shuffle": "重排 · Shuffle",
    "gal.searchLabel": "检索", "gal.searchPlaceholder": "片种、编号或题材", "gal.stockLabel": "片种",
    "idx.plate": "索引 · Index", "idx.heading": "类别索引",
    "foot.plate": "终章 · Colophon", "foot.heading": "关于这份档案",
    "foot.placeLabel": "拍摄地", "foot.place": "美国 · 加利福尼亚、怀俄明、亚利桑那等地",
    "foot.mediumLabel": "媒介", "foot.medium": "135 / 黑白与彩色胶片 · 底片扫描",
    "foot.noteLabel": "制作说明", "foot.note": "共 302 帧，依题材编入图版。版权所有 © 2026。",
    "close": "关闭", "view.mosaic": "拼贴", "view.contact": "样张", "view.focus": "焦点",
    "_all": "全部", "_allTitle": "全部影像", "_unit": "帧", "_plateWord": "图版",
    "_toggle": "EN", "_allStocks": "全部片种", "_empty": "没有匹配的胶片帧",
    "_prev": "上一帧", "_next": "下一帧", "_detailCategory": "题材", "_detailStock": "片种",
    "_detailFrame": "编号", "_detailFormat": "画幅", "_detailRatio": "比例",
  },
  en: {
    "nav.subjects": "Subjects", "nav.catalogue": "Catalogue", "nav.index": "Index",
    "plate.01": "Plate 01", "plate.02": "Plate 02", "plate.03": "Plate 03",
    "plate.04": "Plate 04", "plate.05": "Plate 05",
    "hero.plate": "Prologue",
    "hero.copy": "A film-photography archive presented as a museum catalogue. Reorganised into four subjects — building, landscape, portrait and street — and shown plate by plate.",
    "hero.enter": "Enter catalogue", "hero.subjects": "Subjects",
    "panel.frames": "Frames", "panel.categories": "Subjects", "panel.medium": "Film",
    "cat.plate": "Subjects", "cat.heading": "Plates arranged by subject",
    "gal.plate": "Catalogue", "gal.shuffle": "Shuffle",
    "gal.searchLabel": "Search", "gal.searchPlaceholder": "Stock, frame or subject", "gal.stockLabel": "Stock",
    "idx.plate": "Index", "idx.heading": "Category index",
    "foot.plate": "Colophon", "foot.heading": "About this archive",
    "foot.placeLabel": "Locations", "foot.place": "United States · California, Wyoming, Arizona and beyond",
    "foot.mediumLabel": "Medium", "foot.medium": "35mm · black-and-white and colour film · scanned negatives",
    "foot.noteLabel": "Colophon", "foot.note": "302 frames, arranged into plates by subject. © 2026.",
    "close": "Close", "view.mosaic": "Mosaic", "view.contact": "Contact", "view.focus": "Focus",
    "_all": "All", "_allTitle": "All frames", "_unit": "frames", "_plateWord": "Plate",
    "_toggle": "中文", "_allStocks": "All stocks", "_empty": "No matching frames",
    "_prev": "Previous frame", "_next": "Next frame", "_detailCategory": "Subject", "_detailStock": "Stock",
    "_detailFrame": "Frame", "_detailFormat": "Format", "_detailRatio": "Ratio",
  },
};

const state = {
  lang: "zh",
  activeCategory: "all",
  activeStock: "all",
  query: "",
  view: "mosaic",
  photos: [...archive.photos],
  visiblePhotos: [],
  currentIndex: -1,
  lastFocus: null,
};

const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || key;
const $ = (selector) => document.querySelector(selector);

const hero = $(".hero");
const heroImage = $("#heroImage");
const photoCount = $("#photoCount");
const categoryCount = $("#categoryCount");
const categoryRail = $("#categoryRail");
const filters = $("#filters");
const stockSelect = $("#stockSelect");
const searchInput = $("#searchInput");
const viewMode = $("#viewMode");
const photoGrid = $("#photoGrid");
const galleryTitle = $("#galleryTitle");
const activeCount = $("#activeCount");
const categoryIndex = $("#categoryIndex");
const shuffleButton = $("#shuffleButton");
const langToggle = $("#langToggle");
const scrollProgress = $("#scrollProgress");
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
const lightboxDetails = $("#lightboxDetails");
const closeLightbox = $("#closeLightbox");
const prevPhoto = $("#prevPhoto");
const nextPhoto = $("#nextPhoto");
const filmstrip = $("#filmstrip");

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "80px 0px -8% 0px", threshold: 0.08 })
  : null;

function catLabel(category) {
  if (!category) return "";
  return state.lang === "en" ? category.labelEn || category.label : category.label;
}

function catSummary(category) {
  if (!category) return "";
  return state.lang === "en" ? category.summaryEn || category.summary : category.summary;
}

function categoryMeta(category) {
  return archive.categories.find((item) => item.category === category) || archive.categories[0] || {};
}

function observeReveal(element) {
  if (reduceMotion || !revealObserver) {
    element.classList.add("is-revealed");
    return;
  }
  revealObserver.observe(element);
}

function setHero(sourcePhoto) {
  const defaultHero =
    archive.photos.find((p) => p.src === archive.hero) ||
    archive.photos.find((p) => p.orientation === "landscape") ||
    archive.photos[0];
  const nextHero = sourcePhoto || defaultHero;
  if (!nextHero) return;
  const nextSrc = sourcePhoto ? sourcePhoto.src : archive.hero || nextHero.src;
  if (heroImage.src.endsWith(nextSrc)) return;

  heroImage.style.opacity = "0.62";
  window.setTimeout(() => {
    heroImage.src = nextSrc;
    heroImage.alt = `${catLabel(categoryMeta(nextHero.category))} ${nextHero.label} ${nextHero.frame}`;
    heroImage.onload = () => { heroImage.style.opacity = "1"; };
  }, 90);

  photoCount.textContent = archive.photos.length;
  categoryCount.textContent = archive.categories.length;
}

function makeFilterButton(label, category, count) {
  const button = document.createElement("button");
  button.className = "filter-button";
  button.type = "button";
  button.dataset.category = category;
  button.textContent = `${label} / ${count}`;
  button.classList.toggle("active", category === state.activeCategory);
  button.addEventListener("click", () => setActiveCategory(category));
  return button;
}

function renderFilters() {
  filters.innerHTML = "";
  filters.appendChild(makeFilterButton(t("_all"), "all", archive.photos.length));
  archive.categories.forEach((category) => {
    filters.appendChild(makeFilterButton(catLabel(category), category.category, category.count));
  });
}

function renderStockOptions() {
  const current = state.activeStock;
  const stocks = [...new Set(archive.photos.map((photo) => photo.stock || photo.label).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  stockSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("_allStocks");
  stockSelect.appendChild(allOption);

  stocks.forEach((stock) => {
    const option = document.createElement("option");
    option.value = stock;
    option.textContent = stock;
    stockSelect.appendChild(option);
  });

  state.activeStock = stocks.includes(current) ? current : "all";
  stockSelect.value = state.activeStock;
}

function renderCategoryRail() {
  categoryRail.innerHTML = "";
  archive.categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "category-card";
    button.type = "button";
    button.style.setProperty("--accent", category.accent);
    const plate = String(index + 1).padStart(2, "0");
    button.innerHTML = `
      <img src="${category.cover}" alt="${catLabel(category)}" loading="lazy">
      <span class="category-card-body">
        <span class="category-pill">${t("_plateWord")} ${plate} · ${category.count}</span>
        <h3>${catLabel(category)}</h3>
        <p>${catSummary(category)}</p>
      </span>
    `;
    button.addEventListener("mouseenter", () => {
      const preview = archive.photos.find((photo) => photo.category === category.category && photo.orientation === "landscape") ||
        archive.photos.find((photo) => photo.category === category.category);
      setHero(preview);
    });
    button.addEventListener("mouseleave", () => setHero());
    button.addEventListener("click", () => {
      setActiveCategory(category.category);
      $("#gallery").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
    categoryRail.appendChild(button);
    observeReveal(button);
  });
}

function renderCategoryIndex() {
  categoryIndex.innerHTML = "";
  archive.categories.forEach((category) => {
    const item = document.createElement("article");
    item.className = "index-item";
    item.style.setProperty("--accent", category.accent);
    item.innerHTML = `
      <div class="index-accent"></div>
      <h3>${catLabel(category)}</h3>
      <p>${category.count} ${t("_unit")} / ${catSummary(category)}</p>
    `;
    categoryIndex.appendChild(item);
    observeReveal(item);
  });
}

function photoMatchesQuery(photo, query) {
  if (!query) return true;
  const meta = categoryMeta(photo.category);
  const haystack = [
    photo.stock,
    photo.label,
    photo.frame,
    photo.category,
    catLabel(meta),
    catSummary(meta),
  ].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function currentPhotos() {
  return state.photos.filter((photo) => {
    const categoryMatch = state.activeCategory === "all" || photo.category === state.activeCategory;
    const stockMatch = state.activeStock === "all" || photo.stock === state.activeStock;
    return categoryMatch && stockMatch && photoMatchesQuery(photo, state.query.trim());
  });
}

function renderGallery() {
  const photos = currentPhotos();
  const meta = categoryMeta(state.activeCategory);
  state.visiblePhotos = photos;
  galleryTitle.textContent = state.activeCategory === "all" ? t("_allTitle") : catLabel(meta);
  activeCount.textContent = `${photos.length} ${t("_unit")}`;

  filters.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.activeCategory);
  });

  photoGrid.className = `photo-grid ${state.view === "mosaic" ? "" : state.view}`.trim();
  photoGrid.innerHTML = "";

  if (!photos.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("_empty");
    photoGrid.appendChild(empty);
    return;
  }

  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    const ratio = `${photo.width} / ${photo.height}`;
    const plate = String(index + 1).padStart(3, "0");
    const meta2 = categoryMeta(photo.category);
    button.className = `photo-card ${photo.orientation}`;
    button.type = "button";
    button.style.setProperty("--ratio", ratio);
    button.style.setProperty("--accent", photo.categoryAccent);
    button.innerHTML = `
      <img src="${photo.thumb}" alt="${catLabel(meta2)} ${photo.label}" loading="lazy" decoding="async">
      <span class="photo-caption">
        <span>${t("_plateWord")} ${plate}</span>
        <span>${catLabel(meta2)} · ${photo.label}</span>
      </span>
    `;
    button.addEventListener("mousemove", (event) => updateCardSpotlight(event, button));
    button.addEventListener("click", () => openPreview(index, button));
    photoGrid.appendChild(button);
    observeReveal(button);
  });
}

function updateCardSpotlight(event, element) {
  const bounds = element.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  element.style.setProperty("--mx", `${x}%`);
  element.style.setProperty("--my", `${y}%`);
}

function setActiveCategory(category) {
  state.activeCategory = category;
  renderGallery();
}

function shufflePhotos() {
  const copy = [...state.photos];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  state.photos = copy;
  renderGallery();
}

function setView(view) {
  state.view = view;
  viewMode.querySelectorAll(".view-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  renderGallery();
}

function openPreview(index, trigger) {
  if (!state.visiblePhotos[index]) return;
  state.currentIndex = index;
  state.lastFocus = trigger || document.activeElement;
  lightbox.classList.add("open");
  lightbox.classList.remove("zoomed");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  updatePreview();
  closeLightbox.focus();
}

function updatePreview() {
  const photo = state.visiblePhotos[state.currentIndex];
  if (!photo) return;

  const meta = categoryMeta(photo.category);
  const plate = `${t("_plateWord")} ${String(state.currentIndex + 1).padStart(3, "0")}`;
  lightboxImage.src = photo.src;
  lightboxImage.alt = `${catLabel(meta)} ${photo.label} ${photo.frame}`;
  lightboxCaption.textContent = `${plate} / ${catLabel(meta)} / ${photo.label} / ${photo.frame}`;
  lightboxDetails.innerHTML = `
    <p class="detail-kicker">${plate}</p>
    <h3>${catLabel(meta)}</h3>
    <dl class="detail-list">
      <div><dt>${t("_detailStock")}</dt><dd>${photo.stock || photo.label}</dd></div>
      <div><dt>${t("_detailFrame")}</dt><dd>${photo.frame}</dd></div>
      <div><dt>${t("_detailCategory")}</dt><dd>${catSummary(meta)}</dd></div>
      <div><dt>${t("_detailFormat")}</dt><dd>${photo.orientation}</dd></div>
      <div><dt>${t("_detailRatio")}</dt><dd>${photo.width} × ${photo.height}</dd></div>
    </dl>
  `;
  prevPhoto.setAttribute("aria-label", t("_prev"));
  nextPhoto.setAttribute("aria-label", t("_next"));
  renderFilmstrip();
}

function renderFilmstrip() {
  const start = Math.max(0, state.currentIndex - 5);
  const end = Math.min(state.visiblePhotos.length, state.currentIndex + 6);
  filmstrip.innerHTML = "";

  state.visiblePhotos.slice(start, end).forEach((photo, offset) => {
    const index = start + offset;
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", index === state.currentIndex);
    button.setAttribute("aria-label", `${t("_plateWord")} ${String(index + 1).padStart(3, "0")}`);
    button.innerHTML = `<img src="${photo.thumb}" alt="" loading="lazy" decoding="async">`;
    button.addEventListener("click", () => {
      state.currentIndex = index;
      lightbox.classList.remove("zoomed");
      updatePreview();
    });
    filmstrip.appendChild(button);
  });

  const active = filmstrip.querySelector(".active");
  if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
}

function movePreview(direction) {
  if (!state.visiblePhotos.length) return;
  const total = state.visiblePhotos.length;
  state.currentIndex = (state.currentIndex + direction + total) % total;
  lightbox.classList.remove("zoomed");
  updatePreview();
}

function closePreview() {
  lightbox.classList.remove("open", "zoomed");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImage.removeAttribute("src");
  if (state.lastFocus && typeof state.lastFocus.focus === "function") state.lastFocus.focus();
}

function applyStaticI18n() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = t(key);
    if (val) el.setAttribute("placeholder", val);
  });
  langToggle.textContent = t("_toggle");
}

function setLang(lang) {
  state.lang = lang;
  applyStaticI18n();
  setHero();
  renderFilters();
  renderStockOptions();
  renderCategoryRail();
  renderCategoryIndex();
  renderGallery();
  if (lightbox.classList.contains("open")) updatePreview();
}

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  scrollProgress.style.setProperty("--scroll", progress.toFixed(4));
}

function updateHeroMotion(event) {
  if (reduceMotion || !hero) return;
  const bounds = hero.getBoundingClientRect();
  if (event.clientY > bounds.bottom) return;
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  hero.style.setProperty("--hero-x", `${x / 18}px`);
  hero.style.setProperty("--hero-y", `${y / 18}px`);
}

langToggle.addEventListener("click", () => setLang(state.lang === "zh" ? "en" : "zh"));
shuffleButton.addEventListener("click", shufflePhotos);
stockSelect.addEventListener("change", (event) => {
  state.activeStock = event.target.value;
  renderGallery();
});
searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderGallery();
});
viewMode.addEventListener("click", (event) => {
  const button = event.target.closest(".view-button");
  if (button) setView(button.dataset.view);
});
closeLightbox.addEventListener("click", closePreview);
prevPhoto.addEventListener("click", () => movePreview(-1));
nextPhoto.addEventListener("click", () => movePreview(1));
lightboxImage.addEventListener("click", () => lightbox.classList.toggle("zoomed"));
lightboxImage.addEventListener("mousemove", (event) => {
  const bounds = lightboxImage.getBoundingClientRect();
  lightbox.style.setProperty("--zoom-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  lightbox.style.setProperty("--zoom-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closePreview();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closePreview();
  if (event.key === "ArrowLeft") movePreview(-1);
  if (event.key === "ArrowRight") movePreview(1);
});
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
window.addEventListener("mousemove", updateHeroMotion, { passive: true });

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
setLang(requestedLanguage === "en" ? "en" : "zh");
setView("mosaic");
updateScrollProgress();
