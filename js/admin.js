/* ============================================================
   Shri Syam Builder & Property — Admin Panel
   Loads data/content.json into memory, lets the owner edit it,
   then exports an updated content.json to publish via GitHub.
   NOTE: the password check here is client-side only (there is no
   server on GitHub Pages) — good enough to keep casual visitors
   out of the editing screen, but do not rely on it for real security.
   ============================================================ */

let STATE = null;
const SESSION_KEY = "ssbp_admin_session";

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

async function loadContent() {
  const res = await fetch("data/content.json", { cache: "no-store" });
  return res.json();
}

/* ---------------- Login ---------------- */
document.getElementById("loginBtn").addEventListener("click", attemptLogin);
document.getElementById("loginPw").addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptLogin();
});

async function attemptLogin() {
  if (!STATE) STATE = await loadContent();
  const pw = document.getElementById("loginPw").value;
  if (pw === STATE.adminPassword) {
    sessionStorage.setItem(SESSION_KEY, "1");
    enterDashboard();
  } else {
    document.getElementById("loginError").classList.add("show");
  }
}

function enterDashboard() {
  document.getElementById("loginWrap").style.display = "none";
  document.getElementById("dash").classList.add("show");
  populateSettingsForm();
  renderPropertyList();
  renderLeads();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ---------------- Sidebar nav ---------------- */
document.querySelectorAll(".sidebar nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.panel).classList.add("active");
  });
});

/* ---------------- Settings ---------------- */
function populateSettingsForm() {
  document.getElementById("s_siteName").value = STATE.siteName || "";
  document.getElementById("s_tagline").value = STATE.tagline || "";
  document.getElementById("s_taglineEnglish").value = STATE.taglineEnglish || "";
  document.getElementById("s_about").value = STATE.about || "";
  document.getElementById("s_phone").value = STATE.phone || "";
  document.getElementById("s_whatsapp").value = STATE.whatsapp || "";
  document.getElementById("s_email").value = STATE.email || "";
  document.getElementById("s_address").value = STATE.address || "";
  document.getElementById("s_mapQuery").value = STATE.mapQuery || "";
  document.getElementById("s_facebook").value = (STATE.social || {}).facebook || "";
  document.getElementById("s_instagram").value = (STATE.social || {}).instagram || "";
  document.getElementById("s_youtube").value = (STATE.social || {}).youtube || "";

  const statsWrap = document.getElementById("statsEditor");
  statsWrap.innerHTML = (STATE.stats || []).map((s, i) => `
    <div class="grid-2" style="margin-bottom:12px;">
      <div class="field" style="margin-bottom:0;"><label>Label ${i + 1}</label><input data-stat-label="${i}" value="${escapeAttr(s.label)}"></div>
      <div class="field" style="margin-bottom:0;"><label>Value ${i + 1}</label><input data-stat-value="${i}" value="${escapeAttr(s.value)}"></div>
    </div>
  `).join("");
}

function escapeAttr(str) {
  return (str || "").toString().replace(/"/g, "&quot;");
}

document.getElementById("saveSettingsBtn").addEventListener("click", () => {
  STATE.siteName = document.getElementById("s_siteName").value.trim();
  STATE.tagline = document.getElementById("s_tagline").value.trim();
  STATE.taglineEnglish = document.getElementById("s_taglineEnglish").value.trim();
  STATE.about = document.getElementById("s_about").value.trim();
  STATE.phone = document.getElementById("s_phone").value.trim();
  STATE.whatsapp = document.getElementById("s_whatsapp").value.trim();
  STATE.email = document.getElementById("s_email").value.trim();
  STATE.address = document.getElementById("s_address").value.trim();
  STATE.mapQuery = document.getElementById("s_mapQuery").value.trim();
  STATE.social = {
    facebook: document.getElementById("s_facebook").value.trim(),
    instagram: document.getElementById("s_instagram").value.trim(),
    youtube: document.getElementById("s_youtube").value.trim()
  };

  document.querySelectorAll("[data-stat-label]").forEach(input => {
    const i = input.dataset.statLabel;
    if (!STATE.stats[i]) STATE.stats[i] = { label: "", value: "" };
    STATE.stats[i].label = input.value.trim();
  });
  document.querySelectorAll("[data-stat-value]").forEach(input => {
    const i = input.dataset.statValue;
    if (!STATE.stats[i]) STATE.stats[i] = { label: "", value: "" };
    STATE.stats[i].value = input.value.trim();
  });

  const newPw = document.getElementById("s_newPw").value;
  const newPw2 = document.getElementById("s_newPw2").value;
  if (newPw || newPw2) {
    if (newPw !== newPw2) {
      toast("New passwords don't match — password not changed.");
    } else if (newPw.length < 4) {
      toast("Password too short — use at least 4 characters.");
    } else {
      STATE.adminPassword = newPw;
      document.getElementById("s_newPw").value = "";
      document.getElementById("s_newPw2").value = "";
      toast("Settings saved and password updated. Don't forget to publish!");
      return;
    }
  }
  toast("Settings saved in this session. Go to Publish to make it live.");
});

/* ---------------- Properties ---------------- */
function renderPropertyList() {
  const wrap = document.getElementById("propertyList");
  const list = STATE.properties || [];
  if (!list.length) {
    wrap.innerHTML = `<p style="color:var(--ink-soft);font-size:0.9rem;">No properties yet — add your first one above.</p>`;
    return;
  }
  wrap.innerHTML = list.map(p => `
    <div class="prop-row">
      <div class="meta">
        <strong>${p.title} ${p.featured ? '<span class="badge featured">Featured</span>' : ""}</strong>
        <span>${p.type} · ${p.location} · ${p.price}</span>
      </div>
      <div class="prop-actions">
        <button class="btn btn-outline btn-sm" data-edit="${p.id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-delete="${p.id}">Delete</button>
      </div>
    </div>
  `).join("");

  wrap.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editProperty(b.dataset.edit)));
  wrap.querySelectorAll("[data-delete]").forEach(b => b.addEventListener("click", () => deleteProperty(b.dataset.delete)));
}

document.getElementById("addPropertyBtn").addEventListener("click", () => {
  clearPropertyForm();
  document.getElementById("propFormTitle").textContent = "Add Property";
  document.getElementById("propForm").classList.add("show");
  document.getElementById("propForm").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("cancelPropertyBtn").addEventListener("click", () => {
  document.getElementById("propForm").classList.remove("show");
});

function clearPropertyForm() {
  document.getElementById("p_id").value = "";
  document.getElementById("p_title").value = "";
  document.getElementById("p_type").value = "Plot";
  document.getElementById("p_location").value = "";
  document.getElementById("p_status").value = "For Sale";
  document.getElementById("p_price").value = "";
  document.getElementById("p_area").value = "";
  document.getElementById("p_image").value = "";
  document.getElementById("p_description").value = "";
  document.getElementById("p_featured").checked = false;
}

function editProperty(id) {
  const p = (STATE.properties || []).find(x => x.id === id);
  if (!p) return;
  document.getElementById("p_id").value = p.id;
  document.getElementById("p_title").value = p.title || "";
  document.getElementById("p_type").value = p.type || "Plot";
  document.getElementById("p_location").value = p.location || "";
  document.getElementById("p_status").value = p.status || "For Sale";
  document.getElementById("p_price").value = p.price || "";
  document.getElementById("p_area").value = p.area || "";
  document.getElementById("p_image").value = p.image || "";
  document.getElementById("p_description").value = p.description || "";
  document.getElementById("p_featured").checked = !!p.featured;
  document.getElementById("propFormTitle").textContent = "Edit Property";
  document.getElementById("propForm").classList.add("show");
  document.getElementById("propForm").scrollIntoView({ behavior: "smooth" });
}

function deleteProperty(id) {
  if (!confirm("Delete this property? This can't be undone in this session.")) return;
  STATE.properties = (STATE.properties || []).filter(p => p.id !== id);
  renderPropertyList();
  toast("Property deleted. Publish to make it live.");
}

document.getElementById("savePropertyBtn").addEventListener("click", () => {
  const title = document.getElementById("p_title").value.trim();
  if (!title) { toast("Please enter a title."); return; }

  const id = document.getElementById("p_id").value || ("p_" + Date.now());
  const prop = {
    id,
    title,
    type: document.getElementById("p_type").value,
    location: document.getElementById("p_location").value.trim(),
    status: document.getElementById("p_status").value,
    price: document.getElementById("p_price").value.trim(),
    area: document.getElementById("p_area").value.trim(),
    image: document.getElementById("p_image").value.trim(),
    description: document.getElementById("p_description").value.trim(),
    featured: document.getElementById("p_featured").checked
  };

  const idx = (STATE.properties || []).findIndex(p => p.id === id);
  if (idx >= 0) {
    STATE.properties[idx] = prop;
  } else {
    STATE.properties = STATE.properties || [];
    STATE.properties.push(prop);
  }

  document.getElementById("propForm").classList.remove("show");
  renderPropertyList();
  toast("Property saved. Go to Publish to make it live.");
});

/* ---------------- Inquiries ---------------- */
function renderLeads() {
  // Local (this-device) leads from localStorage
  const local = JSON.parse(localStorage.getItem("ssbp_leads") || "[]");
  const localWrap = document.getElementById("leadsLocal");
  localWrap.innerHTML = local.length ? leadsTable(local) : `<p style="color:var(--ink-soft);font-size:0.9rem;">No local leads captured on this device yet.</p>`;

  // Remote (Google Sheet CSV) leads, if configured
  const remoteWrap = document.getElementById("leadsRemote");
  if (STATE.leadsSheetCsvUrl) {
    remoteWrap.innerHTML = `<p style="color:var(--ink-soft);font-size:0.9rem;">Loading shared inquiries…</p>`;
    fetch(STATE.leadsSheetCsvUrl)
      .then(r => r.text())
      .then(csv => {
        const rows = parseCsv(csv);
        remoteWrap.innerHTML = rows.length ? leadsTable(rows, true) : `<p style="color:var(--ink-soft);font-size:0.9rem;">No shared inquiries yet.</p>`;
      })
      .catch(() => {
        remoteWrap.innerHTML = `<p style="color:var(--ink-soft);font-size:0.9rem;">Couldn't load the shared Google Sheet. Check that "leadsSheetCsvUrl" is published correctly.</p>`;
      });
  } else {
    remoteWrap.innerHTML = `<p style="color:var(--ink-soft);font-size:0.9rem;">No shared Google Sheet connected yet — see the Publish tab to set one up so inquiries from every visitor show up here.</p>`;
  }
}

function leadsTable(rows, fromCsv) {
  const cols = fromCsv
    ? ["date", "name", "phone", "interest", "message"]
    : ["date", "name", "phone", "interest", "message"];
  return `<table class="leads-table"><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>
    ${rows.map(r => `<tr>${cols.map(c => `<td>${(fromCsv ? r[c.charAt(0).toUpperCase() + c.slice(1)] || r[c] : r[c]) || ""}</td>`).join("")}</tr>`).join("")}
  </tbody></table>`;
}

function parseCsv(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || "");
    return obj;
  });
}

/* ---------------- Publish / Export ---------------- */
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded content.json — upload it to GitHub to publish.");
});

/* ---------------- Boot ---------------- */
(async function boot() {
  STATE = await loadContent();
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    enterDashboard();
  }
})();
