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
];

// Load websites dari localStorage jika ada, atau gunakan daftar default.
function loadWebsites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWebsites));
    return defaultWebsites;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultWebsites;
  } catch (error) {
    console.warn("Gagal memuat data localStorage, gunakan default.", error);
    return defaultWebsites;
  }
}

// Simpan daftar website ke localStorage.
function saveWebsites(websites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
}

// Buat elemen navbar untuk setiap situs.
function renderWebsiteLinks() {
  websiteListEl.innerHTML = "";
  const websites = loadWebsites();

  websites.forEach((site, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "navbar__link";
    button.textContent = site.name;
    button.addEventListener("click", () => openPreview(site));
    websiteListEl.appendChild(button);
  });
}

// Tampilkan popup dengan preview website.
function openPreview(site) {
  modalSiteName.textContent = site.name;
  modalTitle.textContent = `Preview ${site.name}`;
  modalSubtitle.textContent = `Menampilkan ${site.name} dalam mode preview.`;
  visitSiteBtn.href = site.url;
  visitSiteBtn.textContent = "Kunjungi Website";

  // Pastikan URL valid dan aman untuk dipasang di iframe.
  sitePreview.src = site.url;

  previewModal.classList.add("show-modal");
  previewModal.classList.remove("hidden");
  modalBackdrop.classList.add("show-backdrop");
  modalBackdrop.classList.remove("hidden");

  // Pastikan navbar tetap terlihat di atas popup.
  previewModal.style.zIndex = 60;
}

function closePreview() {
  previewModal.classList.remove("show-modal");
  modalBackdrop.classList.remove("show-backdrop");
  previewModal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
  sitePreview.src = "about:blank";
}

// Validasi URL sederhana supaya hanya menerima protokol yang aman.
function normalizeUrl(value) {
  const trimmed = value.trim();
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
  saveWebsites(websites);
  renderWebsiteLinks();

  siteNameInput.value = "";
  siteLinkInput.value = "";
  siteNameInput.focus();
});

// Tombol tutup modal dan backdrop.
closeModalBtn.addEventListener("click", closePreview);
modalBackdrop.addEventListener("click", closePreview);

// Tombol buka form pada hero card.
openAddFormBtn.addEventListener("click", () => {
  addWebsiteSection.scrollIntoView({ behavior: "smooth", block: "center" });
  siteNameInput.focus();
});

// Tombol Esc menutup popup.
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && previewModal.classList.contains("show-modal")) {
    closePreview();
  }
});

// Inisialisasi render pertama kali.
renderWebsiteLinks();
