/* ==========================================================================
   REAL ESTATE MASTER JAVASCRIPT ENGINE
   ========================================================================== */

// 1. BRANDING & CONFIGURATION
const CONFIG = {
    businessName: "ROYAL ACRES",
    tagline: "Find Your Perfect Property",
    phone: "+91 98765 43210",
    phoneRaw: "919876543210",
    whatsapp: "+91 98765 43210",
    whatsappRaw: "919876543210",
    email: "info@royalacres.in",
    address: "Golf Course Road, Sector 54, Gurugram, Haryana, India",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    mapsUrl: "https://maps.google.com/?q=Gurugram",
    // Endpoint for Formspree / Web3Forms / Custom Backend API:
    contactApiEndpoint: "https://formspree.io/f/demo_id"
};

// 2. DEMO SEED DATA
const INITIAL_PROPERTIES = [
    {
        id: "PROP-101",
        title: "Luxury 3 BHK Golf View Apartment",
        type: "Flat",
        location: "Golf Course Road, Gurugram",
        price: "₹ 2.45 Cr",
        numericPrice: 24500000,
        beds: 3,
        baths: 3,
        area: "2100 Sq.Ft.",
        badge: "Featured",
        status: "Available",
        description: "Ultra-luxury modern apartment with panoramic golf course views, high-end Italian marble flooring, and modular kitchen.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        builder: "DLF Limited",
        rera: "GGM/304/2019/36",
        facing: "North-East",
        possession: "Ready to Move"
    },
    {
        id: "PROP-102",
        title: "Premium Residential Plot in Gated Community",
        type: "Plot",
        location: "Sector 88, Gurugram",
        price: "₹ 1.20 Cr",
        numericPrice: 12000000,
        beds: 0,
        baths: 0,
        area: "250 Sq.Yds",
        badge: "Hot Deal",
        status: "Available",
        description: "East-facing residential plot in a prime gated township with wide roads, underground utilities, and 24/7 security.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        builder: "Vatika Group",
        rera: "GGM/112/2018/10",
        facing: "East",
        possession: "Immediate"
    },
    {
        id: "PROP-103",
        title: "4 BHK Ultra-Luxury Independent Villa",
        type: "Villa",
        location: "Sohna Road, Gurugram",
        price: "₹ 4.80 Cr",
        numericPrice: 48000000,
        beds: 4,
        baths: 5,
        area: "3800 Sq.Ft.",
        badge: "New Launch",
        status: "Available",
        description: "Independent luxury villa featuring a private swimming pool, private terrace garden, and home automation systems.",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
        builder: "Emaar India",
        rera: "GGM/412/2021/55",
        facing: "North",
        possession: "Dec 2026"
    },
    {
        id: "PROP-104",
        title: "Grade-A Commercial Office Space",
        type: "Commercial",
        location: "Cyber City, Gurugram",
        price: "₹ 3.10 Cr",
        numericPrice: 31000000,
        beds: 0,
        baths: 2,
        area: "1500 Sq.Ft.",
        badge: "Featured",
        status: "Available",
        description: "Fully furnished commercial office space with high rental yield capability in the heart of the corporate hub.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        builder: "M3M India",
        rera: "GGM/221/2020/12",
        facing: "West",
        possession: "Ready to Move"
    }
];

const INITIAL_PROJECTS = [
    {
        id: "PROJ-201",
        name: "Imperial Sky Heights",
        builder: "Emaar India",
        location: "Sector 62, Gurugram",
        startingPrice: "₹ 1.85 Cr",
        configs: "2, 3 & 4 BHK Apartments",
        possession: "Dec 2026",
        rera: "GGM/602/2022/88",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "PROJ-202",
        name: "Grand Central Commercial Hub",
        builder: "M3M India",
        location: "Golf Course Ext. Road, Gurugram",
        startingPrice: "₹ 85 Lakhs",
        configs: "Retail Shops & Office Suites",
        possession: "Ready to Move",
        rera: "GGM/511/2021/04",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    }
];

// 3. DECOUPLED DATA ACCESS LAYER (LocalStorage / API Ready)
const DataStore = {
    getProperties: () => {
        const data = localStorage.getItem('re_properties');
        return data ? JSON.parse(data) : INITIAL_PROPERTIES;
    },
    saveProperties: (properties) => {
        localStorage.setItem('re_properties', JSON.stringify(properties));
    },
    getProjects: () => {
        const data = localStorage.getItem('re_projects');
        return data ? JSON.parse(data) : INITIAL_PROJECTS;
    },
    saveProjects: (projects) => {
        localStorage.setItem('re_projects', JSON.stringify(projects));
    },
    getEnquiries: () => {
        const data = localStorage.getItem('re_enquiries');
        return data ? JSON.parse(data) : [];
    },
    addEnquiry: (enquiry) => {
        const enquiries = DataStore.getEnquiries();
        enquiries.unshift({ ...enquiry, id: 'ENQ-' + Date.now(), date: new Date().toLocaleDateString(), status: 'New' });
        localStorage.setItem('re_enquiries', JSON.stringify(enquiries));
    },
    updateEnquiryStatus: (id, status) => {
        const enquiries = DataStore.getEnquiries();
        const index = enquiries.findIndex(e => e.id === id);
        if (index !== -1) {
            enquiries[index].status = status;
            localStorage.setItem('re_enquiries', JSON.stringify(enquiries));
        }
    },
    deleteEnquiry: (id) => {
        const enquiries = DataStore.getEnquiries().filter(e => e.id !== id);
        localStorage.setItem('re_enquiries', JSON.stringify(enquiries));
    }
};

// 4. UI INITIALIZATION & DOM BINDING
document.addEventListener('DOMContentLoaded', () => {
    applyBranding();
    initMobileNav();
    
    // Check if on public index page or admin page
    if (document.getElementById('property-grid')) {
        renderProperties(DataStore.getProperties());
        renderProjects(DataStore.getProjects());
        initSearchAndFilters();
        initContactForm();
    } else if (document.getElementById('admin-stats')) {
        initAdminDashboard();
    }
});

function applyBranding() {
    // Populate dynamic text from CONFIG
    document.querySelectorAll('[data-brand="name"]').forEach(el => el.textContent = CONFIG.businessName);
    document.querySelectorAll('[data-brand="tagline"]').forEach(el => el.textContent = CONFIG.tagline);
    document.querySelectorAll('[data-brand="phone"]').forEach(el => {
        el.textContent = CONFIG.phone;
        if (el.tagName === 'A') el.href = `tel:${CONFIG.phoneRaw}`;
    });
    document.querySelectorAll('[data-brand="whatsapp"]').forEach(el => {
        if (el.tagName === 'A') el.href = `https://wa.me/${CONFIG.whatsappRaw}`;
    });
    document.querySelectorAll('[data-brand="email"]').forEach(el => {
        el.textContent = CONFIG.email;
        if (el.tagName === 'A') el.href = `mailto:${CONFIG.email}`;
    });
    document.querySelectorAll('[data-brand="address"]').forEach(el => el.textContent = CONFIG.address);
}

function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('active'));
    }
}

// 5. RENDER PROPERTY CARDS
function renderProperties(properties) {
    const grid = document.getElementById('property-grid');
    const countEl = document.getElementById('property-count');
    if (!grid) return;

    grid.innerHTML = '';
    if (countEl) countEl.textContent = `${properties.length} Properties Found`;

    if (properties.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <h3>No Properties Found</h3>
            <p style="color: var(--text-muted)">Try loosening your search filters.</p>
        </div>`;
        return;
    }

    properties.forEach(prop => {
        const waMsg = encodeURIComponent(`Hi, I am interested in ${prop.title} (${prop.id}). Please share more details.`);
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${prop.image}" alt="${prop.title}" loading="lazy">
                <span class="card-badge ${prop.badge === 'Hot Deal' ? 'badge-hot' : 'badge-new'}">${prop.badge}</span>
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
                    <button class="btn btn-primary" style="flex-grow: 1;" onclick="openPropertyModal('${prop.id}')">View Details</button>
                    <a href="https://wa.me/${CONFIG.whatsappRaw}?text=${waMsg}" target="_blank" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i></a>
                    <a href="tel:${CONFIG.phoneRaw}" class="btn btn-outline"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 6. RENDER BUILDER PROJECTS
function renderProjects(projects) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card property-card';
        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${proj.image}" alt="${proj.name}" loading="lazy">
                <span class="card-badge">${proj.builder}</span>
            </div>
            <div class="card-body">
                <div class="card-price">Starting ${proj.startingPrice}</div>
                <h3 class="card-title">${proj.name}</h3>
                <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${proj.location}</div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                    Config: ${proj.configs} <br>
                    Possession: ${proj.possession}
                </p>
                <button class="btn btn-accent" style="width: 100%;" onclick="openContactModalForProject('${proj.name}')">Enquire Project</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 7. PROPERTY FILTERING SYSTEM
function initSearchAndFilters() {
    const filterForm = document.getElementById('search-filter-form');
    if (!filterForm) return;

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
        filterForm.reset();
        renderProperties(DataStore.getProperties());
    });
}

function applyFilters() {
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
}

function filterByCategory(typeCategory) {
    const filtered = DataStore.getProperties().filter(p => p.type === typeCategory);
    renderProperties(filtered);
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// 8. PROPERTY DETAILS MODAL
function openPropertyModal(id) {
    const prop = DataStore.getProperties().find(p => p.id === id);
    if (!prop) return;

    const modal = document.getElementById('property-modal');
    const modalBody = document.getElementById('modal-dynamic-content');
    const waMsg = encodeURIComponent(`Hi, I am interested in ${prop.title} (${prop.id}). Please share visit details.`);

    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
            <div>
                <img src="${prop.image}" alt="${prop.title}" style="width: 100%; border-radius: var(--radius);">
            </div>
            <div>
                <span class="card-badge">${prop.status}</span>
                <h2 style="margin-top: 10px;">${prop.title}</h2>
                <p style="color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                <h3 style="color: var(--accent); margin: 15px 0;">${prop.price}</h3>
                
                <table style="width: 100%; font-size: 0.9rem; margin-bottom: 20px;">
                    <tr><td><strong>Type:</strong> ${prop.type}</td><td><strong>Area:</strong> ${prop.area}</td></tr>
                    <tr><td><strong>Bedrooms:</strong> ${prop.beds}</td><td><strong>Bathrooms:</strong> ${prop.baths}</td></tr>
                    <tr><td><strong>Facing:</strong> ${prop.facing}</td><td><strong>Possession:</strong> ${prop.possession}</td></tr>
                    <tr><td><strong>Builder:</strong> ${prop.builder}</td><td><strong>RERA:</strong> ${prop.rera}</td></tr>
                </table>

                <p style="font-size: 0.9rem; margin-bottom: 20px;">${prop.description}</p>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="https://wa.me/${CONFIG.whatsappRaw}?text=${waMsg}" target="_blank" class="btn btn-whatsapp" style="flex-grow:1;"><i class="fab fa-whatsapp"></i> WhatsApp Enquiry</a>
                    <a href="tel:${CONFIG.phoneRaw}" class="btn btn-primary" style="flex-grow:1;"><i class="fas fa-phone"></i> Call Now</a>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// 9. PUBLIC CONTACT & ENQUIRY FORM
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

        // Save locally for demo admin portal
        DataStore.addEnquiry(enquiry);

        /* ==================================================================
           FUTURE BACKEND API INTEGRATION POINT:
           Uncomment the fetch below to send data to Formspree, Web3Forms, or PHP backend.
           ------------------------------------------------------------------
           fetch(CONFIG.contactApiEndpoint, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(enquiry)
           });
           ================================================================== */

        alert('Thank you! Your enquiry has been received. Our team will contact you shortly.');
        form.reset();
    });
}

function openContactModalForProject(projectName) {
    const propInput = document.getElementById('enq-property');
    if (propInput) propInput.value = `Project: ${projectName}`;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// 10. ADMIN DASHBOARD LOGIC
function initAdminDashboard() {
    // Check Demo Auth
    if (sessionStorage.getItem('re_admin_logged') !== 'true') {
        const pass = prompt('Admin Login (Demo Password: admin123):');
        if (pass === 'admin123') {
            sessionStorage.setItem('re_admin_logged', 'true');
        } else {
            alert('Unauthorized');
            window.location.href = 'index.html';
            return;
        }
    }

    renderAdminStats();
    renderAdminProperties();
    renderAdminEnquiries();
}

function renderAdminStats() {
    const props = DataStore.getProperties();
    const enqs = DataStore.getEnquiries();
    const projs = DataStore.getProjects();

    document.getElementById('stat-total-props').textContent = props.length;
    document.getElementById('stat-total-enqs').textContent = enqs.length;
    document.getElementById('stat-total-projs').textContent = projs.length;
}

function renderAdminProperties() {
    const tbody = document.getElementById('admin-props-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    DataStore.getProperties().forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><strong>${p.title}</strong></td>
            <td>${p.type}</td>
            <td>${p.price}</td>
            <td>${p.location}</td>
            <td>
                <button class="btn btn-outline" style="padding: 4px 8px; font-size:0.8rem;" onclick="deletePropertyAdmin('${p.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deletePropertyAdmin(id) {
    if (confirm(`Are you sure you want to delete property ${id}?`)) {
        const updated = DataStore.getProperties().filter(p => p.id !== id);
        DataStore.saveProperties(updated);
        renderAdminProperties();
        renderAdminStats();
    }
}

function addNewPropertyAdmin(event) {
    event.preventDefault();
    const props = DataStore.getProperties();
    
    const newProp = {
        id: "PROP-" + Math.floor(100 + Math.random() * 900),
        title: document.getElementById('add-title').value,
        type: document.getElementById('add-type').value,
        location: document.getElementById('add-location').value,
        price: document.getElementById('add-price').value,
        numericPrice: parseFloat(document.getElementById('add-num-price').value) || 0,
        beds: parseInt(document.getElementById('add-beds').value) || 0,
        baths: parseInt(document.getElementById('add-baths').value) || 0,
        area: document.getElementById('add-area').value,
        badge: "New",
        status: "Available",
        description: document.getElementById('add-desc').value,
        image: document.getElementById('add-image').value || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        builder: "Independent",
        rera: "N/A",
        facing: "North",
        possession: "Ready"
    };

    props.unshift(newProp);
    DataStore.saveProperties(props);
    alert('Property Added Successfully!');
    closeModal();
    renderAdminProperties();
    renderAdminStats();
}

function renderAdminEnquiries() {
    const tbody = document.getElementById('admin-enq-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    DataStore.getEnquiries().forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.date}</td>
            <td><strong>${e.name}</strong></td>
            <td>${e.phone}<br><small>${e.email}</small></td>
            <td>${e.property || 'General'}</td>
            <td>${e.message}</td>
            <td>
                <span class="card-badge">${e.status}</span>
            </td>
            <td>
                <button class="btn btn-outline" style="padding: 4px 8px; font-size:0.8rem;" onclick="deleteEnquiryAdmin('${e.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteEnquiryAdmin(id) {
    if (confirm('Delete this enquiry?')) {
        DataStore.deleteEnquiry(id);
        renderAdminEnquiries();
        renderAdminStats();
    }
}
