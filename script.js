const websiteListEl = document.getElementById("websiteList");
const websiteForm = document.getElementById("websiteForm");
const siteNameInput = document.getElementById("siteName");
const siteLinkInput = document.getElementById("siteLink");
const previewModal = document.getElementById("previewModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModal");
const modalSiteName = document.getElementById("modalSiteName");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const sitePreview = document.getElementById("sitePreview");
const visitSiteBtn = document.getElementById("visitSiteBtn");
const openAddFormBtn = document.getElementById("openAddForm");
const addWebsiteSection = document.getElementById("addWebsiteSection");

const STORAGE_KEY = "portfolioHubWebsites";

const defaultWebsites = [
  { name: "Bunga", url: "https://bungaproweb.github.io/Web/" },
  { name: "Diyah", url: "https://diyahweb09.github.io/web_portofolio/" },
  {
    name: "Chariz",
    url: "https://charizfn18-netizen.github.io/PortofolioNizar/",
  },
  {
    name: "Denis",
    url: "https://denishlutfian2008-beep.github.io/portofolio-web/",
  },
];

function normalizeWebsiteName(name) {
  return String(name).trim().toLowerCase();
}

function deduplicateWebsites(websites) {
  const seen = new Set();
  return websites.filter((site) => {
    const key = normalizeWebsiteName(site.name);
    if (!key || !site.url) {
      return false;
    }
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function mergeDefaultWebsites(existingWebsites) {
  const normalizedExisting = new Set(
    existingWebsites.map((site) => normalizeWebsiteName(site.name)),
  );
  const merged = [...existingWebsites];

  defaultWebsites.forEach((defaultSite) => {
    const defaultName = normalizeWebsiteName(defaultSite.name);
    if (!normalizedExisting.has(defaultName)) {
      merged.push(defaultSite);
      normalizedExisting.add(defaultName);
    }
  });

  return merged;
}

function loadWebsites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveWebsites(defaultWebsites);
    return [...defaultWebsites];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      saveWebsites(defaultWebsites);
      return [...defaultWebsites];
    }

    const cleaned = deduplicateWebsites(parsed);
    const merged = mergeDefaultWebsites(cleaned);

    if (merged.length !== cleaned.length) {
      saveWebsites(merged);
    }

    return merged;
  } catch (error) {
    console.warn("Gagal memuat data localStorage, gunakan default.", error);
    saveWebsites(defaultWebsites);
    return [...defaultWebsites];
  }
}

function saveWebsites(websites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
}

function renderWebsiteLinks() {
  websiteListEl.innerHTML = "";
  const websites = loadWebsites();

  websites.forEach((site) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "navbar__link";
    button.textContent = site.name;
    button.addEventListener("click", () => openPreview(site));
    websiteListEl.appendChild(button);
  });
}

function openPreview(site) {
  modalSiteName.textContent = site.name;
  modalTitle.textContent = `Preview ${site.name}`;
  modalSubtitle.textContent = `Menampilkan ${site.name} dalam mode preview.`;
  visitSiteBtn.href = site.url;
  visitSiteBtn.textContent = "Kunjungi Website";
  sitePreview.src = site.url;

  previewModal.classList.add("show-modal");
  previewModal.classList.remove("hidden");
  modalBackdrop.classList.add("show-backdrop");
  modalBackdrop.classList.remove("hidden");
  previewModal.style.zIndex = 60;
}

function closePreview() {
  previewModal.classList.remove("show-modal");
  modalBackdrop.classList.remove("show-backdrop");
  previewModal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
  sitePreview.src = "about:blank";
}

function normalizeUrl(value) {
  const trimmed = String(value).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

websiteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = siteNameInput.value.trim();
  const url = normalizeUrl(siteLinkInput.value);

  if (!name || !url) {
    return;
  }

  const websites = loadWebsites();
  websites.push({ name, url });
  saveWebsites(deduplicateWebsites(websites));
  renderWebsiteLinks();

  siteNameInput.value = "";
  siteLinkInput.value = "";
  siteNameInput.focus();
});

closeModalBtn.addEventListener("click", closePreview);
modalBackdrop.addEventListener("click", closePreview);
openAddFormBtn.addEventListener("click", () => {
  addWebsiteSection.scrollIntoView({ behavior: "smooth", block: "center" });
  siteNameInput.focus();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && previewModal.classList.contains("show-modal")) {
    closePreview();
  }
});

renderWebsiteLinks();
