const WHATSAPP_PHONE = "919999999999"; // Set your friend's phone number here (with country code)
const ADMIN_PIN = "1234";

let properties = [];

// Fetch initial data from properties.json or LocalStorage fallback
async function loadProperties() {
    const localData = localStorage.getItem("properties_json_data");
    if (localData) {
        properties = JSON.parse(localData);
        renderListings();
        return;
    }

    try {
        const res = await fetch("data/properties.json");
        properties = await res.json();
        localStorage.setItem("properties_json_data", JSON.stringify(properties));
    } catch (err) {
        console.warn("Could not load data/properties.json, using fallback.");
        properties = [];
    }
    renderListings();
}

// Render Listings
function renderListings(filtered = null) {
    const list = filtered || properties;
    const grid = document.getElementById("propertyGrid");
    const countBadge = document.getElementById("listingCount");

    countBadge.innerText = `${list.length} Properties Found`;

    if (!list.length) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 2rem;">No matching properties found.</p>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="prop-card">
            <div class="prop-img-wrap">
                <img src="${p.image}" alt="${p.title}">
                <span class="badge-tag">${p.category}</span>
                ${p.status === 'Sold' ? '<span class="badge-sold">SOLD</span>' : ''}
            </div>
            <div class="prop-body">
                <h3>${p.title}</h3>
                <p class="prop-location"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
                <div class="prop-specs-grid">
                    <div>📐 <strong>Area:</strong> ${p.area}</div>
                    <div>🛏️ <strong>Type:</strong> ${p.bhk}</div>
                    <div>🧭 <strong>Facing:</strong> ${p.facing || 'Standard'}</div>
                    <div>🚗 <strong>Parking:</strong> ${p.parking || 'Available'}</div>
                </div>
                <div class="prop-price">${p.displayPrice}</div>
                <div class="prop-card-actions">
                    <button class="btn-details" onclick="openDetails('${p.id}')">View Details</button>
                    <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi, I am interested in ' + p.title + ' (' + p.displayPrice + ', ID: ' + p.id + ')')}" target="_blank" class="btn-wa">
                        <i class="fa-brands fa-whatsapp"></i> Inquire
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Search and Multi-Filter
function filterListings() {
    const keyword = document.getElementById("searchKeyword").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;
    const bhk = document.getElementById("bhkSelect").value;
    const maxBudget = document.getElementById("budgetSelect").value;

    const filtered = properties.filter(p => {
        const matchKeyword = !keyword || p.title.toLowerCase().includes(keyword) || p.location.toLowerCase().includes(keyword) || p.sector.toLowerCase().includes(keyword);
        const matchCat = category === "All" || p.category === category;
        const matchBhk = bhk === "All" || p.bhk === bhk;
        const matchBudget = maxBudget === "All" || p.price <= Number(maxBudget);

        return matchKeyword && matchCat && matchBhk && matchBudget;
    });

    renderListings(filtered);
}

function filterByCategory(cat) {
    document.getElementById("categorySelect").value = cat;
    filterListings();
}

// Construction Calculator
function runCalculator() {
    const area = parseFloat(document.getElementById("calcArea").value) || 0;
    const rate = parseFloat(document.getElementById("calcPackage").value) || 0;
    const total = area * rate;
    document.getElementById("calcTotal").innerText = "₹ " + total.toLocaleString('en-IN');
}

function sendConstructionWhatsApp() {
    const area = document.getElementById("calcArea").value;
    const pkg = document.getElementById("calcPackage").selectedOptions[0].text;
    const total = document.getElementById("calcTotal").innerText;
    const msg = `Hi, I want a construction quotation:\n- Area: ${area} Sq. Ft\n- Selected Package: ${pkg}\n- Estimated Cost: ${total}`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Lead form submit
function submitLead(e) {
    e.preventDefault();
    const name = document.getElementById("leadName").value;
    const phone = document.getElementById("leadPhone").value;
    const service = document.getElementById("leadService").value;
    const msg = document.getElementById("leadMsg").value;

    const fullText = `*New Website Inquiry*\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullText)}`, '_blank');
    document.getElementById("leadForm").reset();
}

// Details Modal
function openDetails(id) {
    const p = properties.find(item => item.id === id);
    if (!p) return;

    document.getElementById("modalBody").innerHTML = `
        <img src="${p.image}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
        <h2>${p.title}</h2>
        <p style="color: var(--muted); margin-bottom: 1rem;"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
        <h3 style="color: var(--accent); margin-bottom: 1rem;">${p.displayPrice}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--primary); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
            <div><strong>Area:</strong> ${p.area}</div>
            <div><strong>Status:</strong> ${p.status}</div>
            <div><strong>Facing:</strong> ${p.facing}</div>
            <div><strong>Parking:</strong> ${p.parking}</div>
        </div>
        <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi, please share floor plans and visit details for ' + p.title + ' (' + p.id + ')')}" target="_blank" class="btn-submit" style="display: block; text-align: center; text-decoration: none;">
            <i class="fa-brands fa-whatsapp"></i> Schedule Site Visit on WhatsApp
        </a>
    `;
    document.getElementById("detailsModal").style.display = "flex";
}

function closeDetails() {
    document.getElementById("detailsModal").style.display = "none";
}

// Admin Operations
function openAdmin() {
    document.getElementById("adminModal").style.display = "flex";
}

function closeAdmin() {
    document.getElementById("adminModal").style.display = "none";
}

function verifyAdminPin() {
    const pin = document.getElementById("adminPinInput").value;
    if (pin === ADMIN_PIN) {
        document.getElementById("adminAuth").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        renderAdminTable();
    } else {
        alert("Incorrect PIN");
    }
}

function renderAdminTable() {
    document.getElementById("adminListCount").innerText = properties.length;
    const container = document.getElementById("adminTableContainer");

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${properties.map(p => `
                    <tr>
                        <td>${p.title}</td>
                        <td>${p.category}</td>
                        <td>${p.displayPrice}</td>
                        <td>${p.status}</td>
                        <td>
                            <button onclick="toggleSold('${p.id}')" style="background: var(--border); color: #fff; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Toggle Status</button>
                            <button onclick="deleteProp('${p.id}')" style="background: var(--danger); color: #fff; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function adminSaveProperty(e) {
    e.preventDefault();
    const newP = {
        id: "DH-" + Date.now().toString().slice(-4),
        title: document.getElementById("admTitle").value,
        category: document.getElementById("admCategory").value,
        bhk: document.getElementById("admBhk").value,
        area: document.getElementById("admArea").value,
        price: Number(document.getElementById("admPrice").value),
        displayPrice: document.getElementById("admDisplayPrice").value,
        sector: document.getElementById("admSector").value,
        location: document.getElementById("admLocation").value,
        image: document.getElementById("admImage").value,
        status: document.getElementById("admStatus").value,
        facing: "North-East",
        parking: "Covered"
    };

    properties.unshift(newP);
    localStorage.setItem("properties_json_data", JSON.stringify(properties));
    document.getElementById("addPropertyForm").reset();
    renderListings();
    renderAdminTable();
    alert("Property added successfully!");
}

function toggleSold(id) {
    const item = properties.find(p => p.id === id);
    if (item) {
        item.status = item.status === "Available" ? "Sold" : "Available";
        localStorage.setItem("properties_json_data", JSON.stringify(properties));
        renderListings();
        renderAdminTable();
    }
}

function deleteProp(id) {
    if (confirm("Delete this listing?")) {
        properties = properties.filter(p => p.id !== id);
        localStorage.setItem("properties_json_data", JSON.stringify(properties));
        renderListings();
        renderAdminTable();
    }
}

// Download the updated JSON to replace `data/properties.json` on the server
function exportUpdatedJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(properties, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "properties.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
    runCalculator();
});
