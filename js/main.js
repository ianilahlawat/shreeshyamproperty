/* ============================================================
   Shri Syam Builder & Property — site renderer
   Everything on the page is driven by data/content.json so the
   admin panel can change it without touching this file.
   ============================================================ */

const ICONS = {
  plot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21h18"/><path d="M4 21V9l8-6 8 6v12"/><path d="M9 21v-7h6v7"/></svg>',
  flat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  contract: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v5h5"/><path d="M6 3h8l5 5v13H6z"/><path d="M9 13h6M9 17h6M9 9h2"/></svg>'
};

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="16" height="16"><path d="M22 8.5s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.3 5 12 5 12 5h0s-4.3 0-7.1.2c-.4.1-1.3.1-2.1 1C2.2 6.9 2 8.5 2 8.5S1.8 10.3 1.8 12v1.9c0 1.7.2 3.5.2 3.5s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1C6.9 20.9 12 21 12 21s4.3 0 7.1-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-1.7.2-3.5V12c0-1.7-.2-3.5-.2-3.5z"/><path d="M10 9.7 15 12l-5 2.3z"/></svg>'
};

let SITE = null;
let activeFilter = "All";

function waLink(number, text) {
  const clean = (number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text || "")}`;
}

function telLink(number) {
  return `tel:${(number || "").replace(/\s+/g, "")}`;
}

async function loadContent() {
  const res = await fetch("data/content.json", { cache: "no-store" });
  return res.json();
}

function render(site) {
  SITE = site;
  document.title = `${site.siteName} | Plots, Flats & Construction in Dehradun`;

  // Brand / header
  document.getElementById("brandMark").textContent = (site.siteName || "S").trim().charAt(0);
  document.getElementById("brandName").innerHTML = `${site.siteName}<small>${site.address || "Dehradun"}</small>`;
  document.getElementById("footerBrandName").textContent = site.siteName;

  const waMsg = `Hi ${site.siteName}, I found your website and want to enquire about a property.`;
  document.getElementById("headerWaBtn").href = waLink(site.whatsapp, waMsg);
  document.getElementById("heroWaBtn").href = waLink(site.whatsapp, waMsg);
  document.getElementById("floatWaBtn").href = waLink(site.whatsapp, waMsg);

  document.getElementById("heroSub").textContent = site.taglineEnglish || site.about;

  // Hero stats
  const statsWrap = document.getElementById("heroStats");
  statsWrap.innerHTML = (site.stats || []).map(s => `
    <div class="hero-stat">
      <div class="num">${s.value}</div>
      <div class="lbl">${s.label}</div>
    </div>`).join("");

  // Hero snapshot (top 3 featured/first properties)
  const snapshot = (site.properties || []).slice(0, 3);
  document.getElementById("heroSnapshot").innerHTML = snapshot.map(p => `
    <div class="row"><span>${p.type} · ${p.location}</span><span>${p.price}</span></div>
  `).join("") || `<div class="row"><span>No listings yet</span><span>—</span></div>`;

  // Services
  document.getElementById("servicesGrid").innerHTML = (site.services || []).map(s => `
    <div class="service-card">
      <div class="service-icon">${ICONS[s.icon] || ICONS.home}</div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>`).join("");

  // Properties + filters
  const types = ["All", ...new Set((site.properties || []).map(p => p.type))];
  document.getElementById("filterBar").innerHTML = types.map(t => `
    <button class="filter-chip ${t === activeFilter ? "active" : ""}" data-filter="${t}">${t}</button>
  `).join("");
  renderProperties();

  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProperties();
    });
  });

  // About
  document.getElementById("aboutText").textContent = site.about;

  // Contact info
  document.getElementById("contactPhone").textContent = site.phone;
  document.getElementById("contactWa").textContent = site.phone;
  document.getElementById("contactEmail").textContent = site.email;
  document.getElementById("contactAddress").textContent = site.address;
  document.getElementById("footerPhone").textContent = site.phone;
  document.getElementById("footerEmail").textContent = site.email;
  document.getElementById("footerAddress").textContent = site.address;

  document.getElementById("mapFrame").src = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery || site.address || "Dehradun")}&output=embed`;

  // Social row
  const social = site.social || {};
  const socialHtml = Object.entries(social)
    .filter(([, url]) => url)
    .map(([key, url]) => `<a href="${url}" target="_blank" rel="noopener">${SOCIAL_ICONS[key] || ""}</a>`)
    .join("");
  document.getElementById("socialRow").innerHTML = socialHtml || `<span style="font-size:0.8rem;color:var(--ink-soft);">Coming soon</span>`;

  document.getElementById("year").textContent = new Date().getFullYear();
}

function renderProperties() {
  const list = (SITE.properties || []).filter(p => activeFilter === "All" || p.type === activeFilter);
  const grid = document.getElementById("propertiesGrid");
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">No properties in this category right now — check back soon or ask us directly on WhatsApp.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="property-card">
      <div class="property-media" style="${p.image ? `background-image:url('${p.image}');background-size:cover;background-position:center;` : ""}">
        ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ""}
        <span class="property-tag ${p.featured ? "featured" : ""}">${p.featured ? "Featured" : p.status}</span>
      </div>
      <div class="property-body">
        <h3>${p.title}</h3>
        <div class="property-loc">${p.location}</div>
        <p>${p.description || ""}</p>
        <div class="property-specs">
          <span>${p.area}</span>
          <span class="price">${p.price}</span>
        </div>
        <button class="btn btn-outline btn-block" data-view="${p.id}">View Details</button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.view));
  });
}

function openModal(id) {
  const p = (SITE.properties || []).find(x => x.id === id);
  if (!p) return;
  const msg = `Hi, I'm interested in "${p.title}" (${p.location}, ${p.price}) listed on your website.`;
  document.getElementById("modalContent").innerHTML = `
    <span class="eyebrow">${p.type} · ${p.status}</span>
    <h3 style="margin-top:10px;">${p.title}</h3>
    <p>${p.location}</p>
    <div class="property-specs" style="border-top:1px dashed var(--line);margin-top:6px;">
      <span>${p.area}</span><span class="price">${p.price}</span>
    </div>
    <p style="margin-top:14px;">${p.description || ""}</p>
    <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
      <a class="btn btn-whatsapp" href="${waLink(SITE.whatsapp, msg)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
      <a class="btn btn-outline" href="${telLink(SITE.phone)}">Call Now</a>
    </div>
  `;
  document.getElementById("propertyModal").classList.add("show");
}

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("propertyModal").classList.remove("show");
});
document.getElementById("propertyModal").addEventListener("click", (e) => {
  if (e.target.id === "propertyModal") e.target.classList.remove("show");
});

// Mobile nav
document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("mobile-open");
});
document.querySelectorAll("#navLinks a").forEach(a => {
  a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("mobile-open"));
});

/* ============ Lead capture ============
   GitHub Pages is static hosting, so there is no server to save
   leads to. Every submission is:
   1. Stored in this browser's localStorage (shows up in Admin > Inquiries
      on THIS device only — useful for testing).
   2. Sent to a Google Sheet via a Google Apps Script webhook, if the
      owner has set "leadsWebhookUrl" in content.json (see README).
   3. Backed up with a one-tap WhatsApp message so the lead reaches the
      owner's phone instantly either way.
*/
function saveLeadLocally(lead) {
  const key = "ssbp_leads";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.unshift(lead);
  localStorage.setItem(key, JSON.stringify(existing));
}

async function sendLeadToWebhook(lead) {
  if (!SITE.leadsWebhookUrl) return;
  try {
    await fetch(SITE.leadsWebhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
  } catch (err) {
    console.warn("Lead webhook failed (this is expected if leadsWebhookUrl isn't set up yet):", err);
  }
}

document.getElementById("leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const lead = {
    id: "lead_" + Date.now(),
    date: new Date().toISOString(),
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    interest: form.interest.value,
    message: form.message.value.trim()
  };

  saveLeadLocally(lead);
  sendLeadToWebhook(lead); // fires in background, doesn't block the UI

  const successBox = document.getElementById("formSuccess");
  const waText = `New enquiry from website:\nName: ${lead.name}\nPhone: ${lead.phone}\nLooking for: ${lead.interest}\nMessage: ${lead.message || "-"}`;
  successBox.innerHTML = `Thanks ${lead.name || ""} — your enquiry has been received.
    <a href="${waLink(SITE.whatsapp, waText)}" target="_blank" rel="noopener" style="font-weight:600;text-decoration:underline;">Tap here to also send it on WhatsApp</a> for the fastest reply.`;
  successBox.classList.add("show");
  form.reset();
});

loadContent().then(render).catch(err => {
  console.error("Failed to load content.json", err);
});
