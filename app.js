/* ==========================================================================
   SHREE SHYAM PROPERTY — ENGINE & CRM CORE
   ========================================================================== */

// 1. DEFAULT BRANDING & CONFIGURATION
const DEFAULT_CONFIG = {
    businessName: "SHREE SHYAM PROPERTY",
    tagline: "Your Trusted Property Partner in Haryana",
    phone: "+91 98120 00000",
    phoneRaw: "919812000000",
    whatsapp: "+91 98120 00000",
    whatsappRaw: "919812000000",
    email: "info@shreeshyamproperty.com",
    address: "Julana, Jind & Gurugram, Haryana, India",
    mapsUrl: "https://maps.google.com/?q=Gurugram"
};

// 2. INITIAL REAL ESTATE DEMO DATA
const INITIAL_PROPERTIES = [
    {
        id: "PROP-101",
        title: "Luxury 3 BHK Golf Course Flat",
        type: "Flat",
        location: "Golf Course Road, Gurugram",
        price: "₹ 1.85 Cr",
        numericPrice: 18500000,
        beds: 3, baths: 3, area: "1850 Sq.Ft.",
        badge: "Hot Deal", status: "Available",
        description: "Premium 3 BHK apartment with modern modular kitchen, luxury marble floor, and private balcony view.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        builder: "Shree Shyam Projects", rera: "HR-RERA-2024-89", facing: "East", possession: "Ready to Move"
    },
    {
        id: "PROP-102",
        title: "Prime Highway Commercial Plot",
        type: "Plot",
        location: "Sector 88, Gurugram",
        price: "₹ 95 Lakhs",
        numericPrice: 9500000,
        beds: 0, baths: 0, area: "200 Sq.Yds",
        badge: "Featured", status: "Available",
        description: "Commercial plot located directly on 60m wide road, excellent potential for shops or office building.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        builder: "Ahlawat Developers", rera: "HR-RERA-2023-12", facing: "North-East", possession: "Immediate"
    },
    {
        id: "PROP-103",
        title: "4 BHK Ultra Modern Independent Villa",
        type: "Villa",
        location: "Sohna Road, Gurugram",
        price: "₹ 3.25 Cr",
        numericPrice: 32500000,
        beds: 4, baths: 4, area: "3100 Sq.Ft.",
        badge: "New Launch", status: "Available",
        description: "Gated community luxury villa with private garden, terrace lounge, and 24/7 security guard setup.",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
        builder: "Royal Acres", rera: "HR-RERA-2025-04", facing: "North", possession: "Dec 2026"
    }
];

const INITIAL_PROJECTS = [
    {
        id: "PROJ-201",
        name: "Shree Shyam Heights",
        builder: "Shree Shyam Group",
        location: "Sector 62, Gurugram",
        startingPrice: "₹ 1.25 Cr",
        configs: "2 & 3 BHK Luxury Apartments",
        possession: "Dec 2026",
        rera: "HR-RERA-2024-99",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
    }
];

// 3. STORAGE LAYER (LOCALSTORAGE / BACKEND API ADAPTER)
const DataStore = {
    getConfig: () => {
        const data = localStorage.getItem('ssp_config');
        return data ? JSON.parse(data) : DEFAULT_CONFIG;
    },
    saveConfig: (cfg) => {
        localStorage.setItem('ssp_config', JSON.stringify(cfg));
    },
    getProperties: () => {
        const data = localStorage.getItem('ssp_properties');
        return data ? JSON.parse(data) : INITIAL_PROPERTIES;
    },
    saveProperties: (props) => {
        localStorage.setItem('ssp_properties', JSON.stringify(props));
    },
    getProjects: () => {
        const data = localStorage.getItem('ssp_projects');
        return data ? JSON.parse(data) : INITIAL_PROJECTS;
    },
    saveProjects: (projs) => {
        localStorage.setItem('ssp_projects', JSON.stringify(projs));
    },
    getEnquiries: () => {
        const data = localStorage.getItem('ssp_enquiries');
        return data ? JSON.parse(data) : [];
    },
    addEnquiry: (enq) => {
        const list = DataStore.getEnquiries();
        list.unshift({ ...enq, id: 'LEAD-' + Date.now(), date: new Date().toLocaleDateString(), status: 'New' });
        localStorage.setItem('ssp_enquiries', JSON.stringify(list));
    },
    updateEnquiryStatus: (id, status) => {
        const list = DataStore.getEnquiries();
        const index = list.findIndex(e => e.id === id);
        if (index !== -1) {
            list[index].status = status;
            localStorage.setItem('ssp_enquiries', JSON.stringify(list));
        }
    },
    deleteEnquiry: (id) => {
        const list = DataStore.getEnquiries().filter(e => e.id !== id);
        localStorage.setItem('ssp_enquiries', JSON.stringify(list));
    }
};

// 4. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    applyBranding();
    initMobileNav();

    if (document.getElementById('property-grid')) {
        renderProperties(DataStore.getProperties());
        renderProjects(DataStore.getProjects());
        initSearchFilters();
        initContactForm();
    } else if (document.getElementById('crm-dashboard-view')) {
        initCRM();
    }
});

function applyBranding() {
    const config = DataStore.getConfig();
    document.querySelectorAll('[data-brand="name"]').forEach(el => el.textContent = config.businessName);
    document.querySelectorAll('[data-brand="tagline"]').forEach(el => el.textContent = config.tagline);
    document.querySelectorAll('[data-brand="phone"]').forEach(el => {
        el.textContent = config.phone;
        if (el.tagName === 'A') el.href = `tel:${config.phoneRaw}`;
    });
    document.querySelectorAll('[data-brand="whatsapp"]').forEach(el => {
        if (el.tagName === 'A') el.href = `https://wa.me/${config.whatsappRaw}`;
    });
    document.querySelectorAll('[data-brand="email"]').forEach(el => {
        el.textContent = config.email;
        if (el.tagName === 'A') el.href = `mailto:${config.email}`;
    });
    document.querySelectorAll('[data-brand="address"]').forEach(el => el.textContent = config.address);
}

function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('active'));
    }
}

// 5. PUBLIC WEBSITE RENDERERS
function renderProperties(properties) {
    const grid = document.getElementById('property-grid');
    const countEl = document.getElementById('property-count');
    if (!grid) return;

    grid.innerHTML = '';
    if (countEl) countEl.textContent = `${properties.length} Properties Available`;

    if (properties.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <h3>No Properties Found</h3>
            <p style="color: var(--text-muted)">Try adjusting your search filters.</p>
        </div>`;
        return;
    }

    const config = DataStore.getConfig();
    properties.forEach(prop => {
        const waMsg = encodeURIComponent(`Hi ${config.businessName}, I am interested in ${prop.title} (${prop.id}). Please share details.`);
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${prop.image}" alt="${prop.title}" loading="lazy">
                <span class="card-badge ${prop.badge === 'Hot Deal' ? 'badge-hot' : 'badge-gold'}">${prop.badge}</span>
            </div>
            <div class="card-body">
                <div class="card-price">${prop.price}</div>
                <h3 class="card-title">${prop.title}</h3>
                <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</div>
                <div class="card-features">
                    <span><i class="fas fa-bed"></i> ${prop.beds || 'N/A'} Beds</span>
                    <span><i class="fas fa-bath"></i> ${prop.baths || 'N/A'} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${prop.area}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" style="flex-grow: 1;" onclick="openPropertyModal('${prop.id}')">Details</button>
                    <a href="https://wa.me/${config.whatsappRaw}?text=${waMsg}" target="_blank" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i></a>
                    <a href="tel:${config.phoneRaw}" class="btn btn-outline"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${proj.image}" alt="${proj.name}" loading="lazy">
                <span class="card-badge badge-gold">${proj.builder}</span>
            </div>
            <div class="card-body">
                <div class="card-price">Starting ${proj.startingPrice}</div>
                <h3 class="card-title">${proj.name}</h3>
                <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${proj.location}</div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                    Configuration: ${proj.configs} <br>
                    Possession: ${proj.possession}
                </p>
                <button class="btn btn-accent" style="width: 100%;" onclick="openContactModalForProject('${proj.name}')">Enquire Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 6. SEARCH & FILTERS
function initSearchFilters() {
    const filterForm = document.getElementById('search-filter-form');
    if (!filterForm) return;

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('filter-type')?.value;
        const location = document.getElementById('filter-location')?.value.toLowerCase();
        const maxPrice = parseFloat(document.getElementById('filter-price')?.value) || Infinity;

        const filtered = DataStore.getProperties().filter(p => {
            const matchType = !type || p.type === type;
            const matchLoc = !location || p.location.toLowerCase().includes(location);
            const matchPrice = p.numericPrice <= maxPrice;
            return matchType && matchLoc && matchPrice;
        });

        renderProperties(filtered);
    });

    document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
        filterForm.reset();
        renderProperties(DataStore.getProperties());
    });
}

function filterByCategory(typeCategory) {
    const filtered = DataStore.getProperties().filter(p => p.type === typeCategory);
    renderProperties(filtered);
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
}

// 7. MODALS & CONTACT FORM
function openPropertyModal(id) {
    const prop = DataStore.getProperties().find(p => p.id === id);
    if (!prop) return;

    const modal = document.getElementById('property-modal');
    const modalBody = document.getElementById('modal-dynamic-content');
    const config = DataStore.getConfig();
    const waMsg = encodeURIComponent(`Hi ${config.businessName}, I would like to schedule a site visit for ${prop.title} (${prop.id}).`);

    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <div>
                <img src="${prop.image}" alt="${prop.title}" style="width: 100%; border-radius: var(--radius); object-fit: cover; max-height: 320px;">
            </div>
            <div>
                <span class="card-badge badge-gold">${prop.status}</span>
                <h2 style="margin-top: 10px;">${prop.title}</h2>
                <p style="color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                <h3 style="color: var(--accent); margin: 12px 0;">${prop.price}</h3>
                
                <table style="width: 100%; font-size: 0.88rem; margin-bottom: 20px;">
                    <tr><td><strong>Type:</strong> ${prop.type}</td><td><strong>Area:</strong> ${prop.area}</td></tr>
                    <tr><td><strong>Beds:</strong> ${prop.beds}</td><td><strong>Baths:</strong> ${prop.baths}</td></tr>
                    <tr><td><strong>Facing:</strong> ${prop.facing}</td><td><strong>Possession:</strong> ${prop.possession}</td></tr>
                    <tr><td><strong>RERA:</strong> ${prop.rera}</td><td><strong>Builder:</strong> ${prop.builder}</td></tr>
                </table>

                <p style="font-size: 0.9rem; margin-bottom: 20px; color: var(--text-dark);">${prop.description}</p>

                <div style="display: flex; gap: 10px;">
                    <a href="https://wa.me/${config.whatsappRaw}?text=${waMsg}" target="_blank" class="btn btn-whatsapp" style="flex-grow:1;"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                    <a href="tel:${config.phoneRaw}" class="btn btn-primary" style="flex-grow:1;"><i class="fas fa-phone"></i> Call Direct</a>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const enquiry = {
            name: document.getElementById('enq-name').value,
            phone: document.getElementById('enq-phone').value,
            email: document.getElementById('enq-email').value,
            property: document.getElementById('enq-property').value,
            message: document.getElementById('enq-message').value
        };

        DataStore.addEnquiry(enquiry);
        alert('Thank you! Your enquiry has been received. Our team will contact you shortly.');
        form.reset();
    });
}

function openContactModalForProject(projectName) {
    const propInput = document.getElementById('enq-property');
    if (propInput) propInput.value = `Project: ${projectName}`;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================================================
// 8. CRM DASHBOARD & AUTHENTICATION (USERNAME: admin / PASSWORD: shyam)
// ==========================================================================

function handleCrmLogin(event) {
    event.preventDefault();
    const user = document.getElementById('crm-user').value;
    const pass = document.getElementById('crm-pass').value;

    if (user === 'admin' && pass === 'shyam') {
        sessionStorage.setItem('ssp_admin_logged', 'true');
        document.getElementById('crm-auth-screen').style.display = 'none';
        document.getElementById('crm-app-screen').style.display = 'flex';
        initCRM();
    } else {
        alert('Invalid Credentials! Hint: Username=admin, Password=shyam');
    }
}

function handleCrmLogout() {
    sessionStorage.removeItem('ssp_admin_logged');
    window.location.reload();
}

function initCRM() {
    const isLogged = sessionStorage.getItem('ssp_admin_logged') === 'true';
    const authScreen = document.getElementById('crm-auth-screen');
    const appScreen = document.getElementById('crm-app-screen');

    if (!isLogged) {
        if (authScreen) authScreen.style.display = 'flex';
        if (appScreen) appScreen.style.display = 'none';
        return;
    }

    if (authScreen) authScreen.style.display = 'none';
    if (appScreen) appScreen.style.display = 'flex';

    renderCrmStats();
    renderCrmProperties();
    renderCrmEnquiries();
    renderCrmConfigForm();
}

function switchCrmTab(tabName, element) {
    document.querySelectorAll('.crm-menu a').forEach(a => a.classList.remove('active'));
    if (element) element.classList.add('active');

    document.querySelectorAll('.crm-view-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(`crm-tab-${tabName}`).style.display = 'block';
}

function renderCrmStats() {
    const props = DataStore.getProperties();
    const enqs = DataStore.getEnquiries();
    const projs = DataStore.getProjects();

    document.getElementById('stat-props-count').textContent = props.length;
    document.getElementById('stat-enqs-count').textContent = enqs.length;
    document.getElementById('stat-projs-count').textContent = projs.length;
}

function renderCrmProperties() {
    const tbody = document.getElementById('crm-props-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    DataStore.getProperties().forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.id}</strong></td>
            <td>${p.title}</td>
            <td>${p.type}</td>
            <td>${p.price}</td>
            <td>${p.location}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editPropertyModal('${p.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="deletePropertyCrm('${p.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deletePropertyCrm(id) {
    if (confirm(`Delete property listing ${id}?`)) {
        const updated = DataStore.getProperties().filter(p => p.id !== id);
        DataStore.saveProperties(updated);
        renderCrmProperties();
        renderCrmStats();
    }
}

function openAddPropertyModal() {
    document.getElementById('prop-form').reset();
    document.getElementById('prop-edit-id').value = '';
    document.getElementById('prop-modal-title').textContent = 'Add New Property';
    document.getElementById('crm-prop-modal').classList.add('active');
}

function editPropertyModal(id) {
    const prop = DataStore.getProperties().find(p => p.id === id);
    if (!prop) return;

    document.getElementById('prop-edit-id').value = prop.id;
    document.getElementById('prop-title').value = prop.title;
    document.getElementById('prop-type').value = prop.type;
    document.getElementById('prop-location').value = prop.location;
    document.getElementById('prop-price').value = prop.price;
    document.getElementById('prop-num-price').value = prop.numericPrice;
    document.getElementById('prop-area').value = prop.area;
    document.getElementById('prop-beds').value = prop.beds;
    document.getElementById('prop-baths').value = prop.baths;
    document.getElementById('prop-badge').value = prop.badge;
    document.getElementById('prop-image').value = prop.image;
    document.getElementById('prop-desc').value = prop.description;

    document.getElementById('prop-modal-title').textContent = `Edit Property (${prop.id})`;
    document.getElementById('crm-prop-modal').classList.add('active');
}

function savePropertyCrm(e) {
    e.preventDefault();
    const props = DataStore.getProperties();
    const editId = document.getElementById('prop-edit-id').value;

    const propData = {
        id: editId || "PROP-" + Math.floor(100 + Math.random() * 900),
        title: document.getElementById('prop-title').value,
        type: document.getElementById('prop-type').value,
        location: document.getElementById('prop-location').value,
        price: document.getElementById('prop-price').value,
        numericPrice: parseFloat(document.getElementById('prop-num-price').value) || 0,
        area: document.getElementById('prop-area').value,
        beds: parseInt(document.getElementById('prop-beds').value) || 0,
        baths: parseInt(document.getElementById('prop-baths').value) || 0,
        badge: document.getElementById('prop-badge').value,
        status: "Available",
        image: document.getElementById('prop-image').value || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        description: document.getElementById('prop-desc').value,
        builder: "Shree Shyam Property",
        rera: "HR-RERA-2024",
        facing: "East",
        possession: "Ready"
    };

    if (editId) {
        const idx = props.findIndex(p => p.id === editId);
        if (idx !== -1) props[idx] = propData;
    } else {
        props.unshift(propData);
    }

    DataStore.saveProperties(props);
    closeModal();
    renderCrmProperties();
    renderCrmStats();
}

function renderCrmEnquiries() {
    const tbody = document.getElementById('crm-enq-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    DataStore.getEnquiries().forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.date}</td>
            <td><strong>${e.name}</strong></td>
            <td>${e.phone}<br><small style="color:var(--text-muted)">${e.email}</small></td>
            <td>${e.property || 'General Inquiry'}</td>
            <td>${e.message}</td>
            <td>
                <select class="form-control" style="padding:4px 8px; font-size:0.8rem;" onchange="updateLeadStatus('${e.id}', this.value)">
                    <option value="New" ${e.status === 'New' ? 'selected' : ''}>New Lead</option>
                    <option value="Contacted" ${e.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Closed" ${e.status === 'Closed' ? 'selected' : ''}>Site Visit / Closed</option>
                </select>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" style="color:var(--danger)" onclick="deleteLeadCrm('${e.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateLeadStatus(id, status) {
    DataStore.updateEnquiryStatus(id, status);
}

function deleteLeadCrm(id) {
    if (confirm('Delete lead record?')) {
        DataStore.deleteEnquiry(id);
        renderCrmEnquiries();
        renderCrmStats();
    }
}

function renderCrmConfigForm() {
    const cfg = DataStore.getConfig();
    if (!document.getElementById('cfg-name')) return;

    document.getElementById('cfg-name').value = cfg.businessName;
    document.getElementById('cfg-tagline').value = cfg.tagline;
    document.getElementById('cfg-phone').value = cfg.phone;
    document.getElementById('cfg-phone-raw').value = cfg.phoneRaw;
    document.getElementById('cfg-whatsapp').value = cfg.whatsapp;
    document.getElementById('cfg-whatsapp-raw').value = cfg.whatsappRaw;
    document.getElementById('cfg-email').value = cfg.email;
    document.getElementById('cfg-address').value = cfg.address;
}

function saveCrmConfig(e) {
    e.preventDefault();
    const cfg = {
        businessName: document.getElementById('cfg-name').value,
        tagline: document.getElementById('cfg-tagline').value,
        phone: document.getElementById('cfg-phone').value,
        phoneRaw: document.getElementById('cfg-phone-raw').value,
        whatsapp: document.getElementById('cfg-whatsapp').value,
        whatsappRaw: document.getElementById('cfg-whatsapp-raw').value,
        email: document.getElementById('cfg-email').value,
        address: document.getElementById('cfg-address').value
    };

    DataStore.saveConfig(cfg);
    applyBranding();
    alert('Website Configuration Saved Successfully!');
}
