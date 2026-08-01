const EMBEDDED_CAMPUS_DATA = {
  "campusInfo": {
    "name": "Nova Horizon University Campus",
    "mapDimensions": { "width": 1000, "height": 800 }
  },
  "locations": [
    { "id": "eng_building", "name": "Engineering & Technology Complex", "code": "ENG", "category": "Academic", "x": 220, "y": 180, "floors": 4, "accessible": true, "description": "Houses Computer Science, Electrical, and Mechanical Engineering departments.", "icon": "🛠️", "amenities": ["Wi-Fi", "Computer Labs", "Elevator", "Study Lounges"] },
    { "id": "science_hall", "name": "Science & Research Center", "code": "SCI", "category": "Academic", "x": 440, "y": 150, "floors": 3, "accessible": true, "description": "Chemistry, Physics, and Biotech research laboratories.", "icon": "🔬", "amenities": ["Wi-Fi", "Wet Labs", "Elevator", "Lecture Halls"] },
    { "id": "main_library", "name": "Central Campus Library", "code": "LIB", "category": "Library", "x": 560, "y": 320, "floors": 5, "accessible": true, "description": "24/7 university library with quiet study spaces and digital archives.", "icon": "📚", "amenities": ["Wi-Fi", "Quiet Rooms", "Café", "Elevator", "Print Center"] },
    { "id": "student_union", "name": "Student Activity Union", "code": "SAU", "category": "Student Center", "x": 380, "y": 360, "floors": 3, "accessible": true, "description": "Hub for student clubs, events, and career placement.", "icon": "🏛️", "amenities": ["Wi-Fi", "Event Hall", "ATM", "Information Desk"] },
    { "id": "central_dining", "name": "Campus Dining Commons", "code": "DIN", "category": "Dining", "x": 220, "y": 420, "floors": 2, "accessible": true, "description": "Main dining hall with organic meals and international cuisine.", "icon": "🍴", "amenities": ["Vegan Options", "Outdoor Seating", "Accessible Restrooms"] },
    { "id": "sports_arena", "name": "Athletics & Recreation Arena", "code": "SPT", "category": "Sports", "x": 200, "y": 660, "floors": 2, "accessible": true, "description": "Olympic pool, indoor courts, and gym facility.", "icon": "⚽", "amenities": ["Lockers", "Showers", "Gym Equipment", "Elevator"] },
    { "id": "admin_building", "name": "University Administration", "code": "ADM", "category": "Admin", "x": 720, "y": 180, "floors": 3, "accessible": true, "description": "Office of Admissions, Registrar, Financial Aid.", "icon": "🏢", "amenities": ["Wi-Fi", "Registrar Desk", "Elevator", "Visitor Lounge"] },
    { "id": "dorm_north", "name": "North Quad Residences", "code": "NQR", "category": "Residence", "x": 680, "y": 480, "floors": 6, "accessible": true, "description": "Modern student residence halls with community kitchens.", "icon": "🏠", "amenities": ["Laundry", "Kitchen", "Study Rooms", "Security Desk"] },
    { "id": "dorm_south", "name": "South Quad Residences", "code": "SQR", "category": "Residence", "x": 460, "y": 680, "floors": 5, "accessible": true, "description": "Residence halls adjacent to sports fields.", "icon": "🏠", "amenities": ["Laundry", "Game Room", "Elevator"] },
    { "id": "innovation_hub", "name": "Tech & Entrepreneurship Hub", "code": "HUB", "category": "Academic", "x": 840, "y": 350, "floors": 4, "accessible": true, "description": "Incubator space for student startups and 3D printing labs.", "icon": "💡", "amenities": ["3D Printers", "Co-working Space", "High-speed Fiber"] },
    { "id": "health_center", "name": "Campus Health & Wellness Center", "code": "HLC", "category": "Medical", "x": 780, "y": 640, "floors": 2, "accessible": true, "description": "Full-service health clinic, counseling, and pharmacy.", "icon": "🏥", "amenities": ["Pharmacy", "Urgent Care", "Wheelchair Access", "Counseling"] },
    { "id": "arts_center", "name": "Performing Arts Center", "code": "PAC", "category": "Arts", "x": 380, "y": 540, "floors": 3, "accessible": true, "description": "700-seat auditorium, music rooms, and fine arts gallery.", "icon": "🎭", "amenities": ["Auditorium", "Gallery", "Elevator", "Acoustic Rooms"] }
  ],
  "routes": [
    { "id": "r1", "from": "eng_building", "to": "science_hall", "distance": 220, "time": 3, "type": "Paved Walkway", "accessible": true },
    { "id": "r2", "from": "eng_building", "to": "central_dining", "distance": 240, "time": 3, "type": "Paved Walkway", "accessible": true },
    { "id": "r3", "from": "eng_building", "to": "student_union", "distance": 250, "time": 4, "type": "Paved Walkway", "accessible": true },
    { "id": "r4", "from": "science_hall", "to": "admin_building", "distance": 290, "time": 4, "type": "Tree-lined Path", "accessible": true },
    { "id": "r5", "from": "science_hall", "to": "main_library", "distance": 210, "time": 3, "type": "Paved Walkway", "accessible": true },
    { "id": "r6", "from": "admin_building", "to": "innovation_hub", "distance": 200, "time": 3, "type": "Modern Plaza Path", "accessible": true },
    { "id": "r7", "from": "main_library", "to": "student_union", "distance": 180, "time": 2, "type": "Central Quad Walkway", "accessible": true },
    { "id": "r8", "from": "main_library", "to": "dorm_north", "distance": 200, "time": 3, "type": "Shaded Path", "accessible": true },
    { "id": "r9", "from": "main_library", "to": "innovation_hub", "distance": 280, "time": 4, "type": "Paved Walkway", "accessible": true },
    { "id": "r10", "from": "student_union", "to": "central_dining", "distance": 170, "time": 2, "type": "Courtyard Walk", "accessible": true },
    { "id": "r11", "from": "student_union", "to": "arts_center", "distance": 180, "time": 3, "type": "Paved Walkway", "accessible": true },
    { "id": "r12", "from": "central_dining", "to": "sports_arena", "distance": 240, "time": 3, "type": "Outdoor Staircase Shortcut", "accessible": false },
    { "id": "r13", "from": "central_dining", "to": "arts_center", "distance": 200, "time": 3, "type": "Accessible Slope Path", "accessible": true },
    { "id": "r14", "from": "arts_center", "to": "dorm_south", "distance": 160, "time": 2, "type": "Paved Walkway", "accessible": true },
    { "id": "r15", "from": "dorm_south", "to": "sports_arena", "distance": 260, "time": 4, "type": "Wheelchair Ramp & Walk", "accessible": true },
    { "id": "r16", "from": "dorm_north", "to": "health_center", "distance": 190, "time": 3, "type": "Paved Walkway", "accessible": true },
    { "id": "r17", "from": "innovation_hub", "to": "health_center", "distance": 310, "time": 4, "type": "East Quad Walkway", "accessible": true },
    { "id": "r18", "from": "dorm_north", "to": "dorm_south", "distance": 300, "time": 4, "type": "Central Corridor Path", "accessible": true },
    { "id": "r19", "from": "arts_center", "to": "main_library", "distance": 230, "time": 3, "type": "Plaza Walkway", "accessible": true }
  ]
};

const currentHost = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
  ? window.location.hostname
  : 'localhost';
const API_BASE_URL = `http://${currentHost}:8080/api`;

let campusData = { locations: [], routes: [] };
let locationMap = new Map();
let currentRoute = null;
let isServerOnline = false;
let mapTransform = { scale: 1, translateX: 0, translateY: 0 };
let isDraggingMap = false;
let dragStart = { x: 0, y: 0 };

// Admin State
let isAdminUnlocked = false;
let isPickingCoords = false;
let authenticatedAdminEmail = 'admin@campus.edu';
let adminSessionToken = null; // Stored in memory, sent as X-Session-Token header

const elements = {
  serverStatus: document.getElementById('server-status'),
  startLocation: document.getElementById('start-location'),
  endLocation: document.getElementById('end-location'),
  swapBtn: document.getElementById('swap-locations'),
  accessibleCheckbox: document.getElementById('accessible-only'),
  routeForm: document.getElementById('route-form'),
  routeResults: document.getElementById('route-results'),
  statDistance: document.getElementById('stat-distance'),
  statTime: document.getElementById('stat-time'),
  directionsList: document.getElementById('directions-list'),
  badgeAccessible: document.getElementById('route-badge-accessible'),
  btnClearRoute: document.getElementById('btn-clear-route'),
  globalSearch: document.getElementById('global-search'),
  searchDropdown: document.getElementById('search-results-dropdown'),
  clearSearchBtn: document.getElementById('clear-search'),
  themeToggle: document.getElementById('theme-toggle'),
  categoryPills: document.getElementById('category-pills'),
  directoryList: document.getElementById('directory-list'),
  campusSvg: document.getElementById('campus-svg'),
  layerEdges: document.getElementById('layer-edges'),
  layerActiveRoute: document.getElementById('layer-active-route'),
  layerNodes: document.getElementById('layer-nodes'),
  layerLabels: document.getElementById('layer-labels'),
  layerAdminPreview: document.getElementById('layer-admin-preview'),
  locationModal: document.getElementById('location-modal'),
  modalClose: document.getElementById('modal-close'),
  modalIcon: document.getElementById('modal-icon'),
  modalTitle: document.getElementById('modal-title'),
  modalCategory: document.getElementById('modal-category'),
  modalDescription: document.getElementById('modal-description'),
  modalCode: document.getElementById('modal-code'),
  modalFloors: document.getElementById('modal-floors'),
  modalAccessible: document.getElementById('modal-accessible'),
  modalAmenities: document.getElementById('modal-amenities-tags'),
  btnSetStart: document.getElementById('btn-set-start'),
  btnSetDestination: document.getElementById('btn-set-destination'),
  adminAuthCard: document.getElementById('admin-auth-card'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminDashboard: document.getElementById('admin-dashboard'),
  adminEmail: document.getElementById('admin-email'),
  adminPassword: document.getElementById('admin-password'),
  adminAuthError: document.getElementById('admin-auth-error'),
  adminProfileEmail: document.getElementById('admin-profile-email'),
  btnAdminLogin: document.getElementById('btn-admin-login'),
  btnAdminLogout: document.getElementById('btn-admin-logout'),
  adminAddNodeForm: document.getElementById('admin-add-node-form'),
  btnPickCoords: document.getElementById('btn-pick-coords'),
  coordPickerStatus: document.getElementById('coord-picker-status'),
  adminNodeX: document.getElementById('admin-node-x'),
  adminNodeY: document.getElementById('admin-node-y'),
  adminNodesList: document.getElementById('admin-nodes-list'),
  adminNodeCountBadge: document.getElementById('admin-node-count-badge')
};

let activeModalLocationId = null;

// ==========================================================================
// 1. App Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setupEventListeners();
  setupMapPanZoom();
  setupAdminListeners();
  await checkServerStatus();
  await loadCampusData();
  await checkAdminSession();
  setInterval(checkServerStatus, 10000);
});

function initTheme() {
  const savedTheme = localStorage.getItem('novanav_theme') || 'dark';
  document.body.className = `${savedTheme}-theme`;
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

elements.themeToggle.addEventListener('click', () => {
  const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.className = `${next}-theme`;
  localStorage.setItem('novanav_theme', next);
  updateThemeIcon(next);
});

// ==========================================================================
// 2. Server Status
// ==========================================================================
async function checkServerStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) { setServerStatus(true, `Online (${currentHost}:8080)`); return; }
  } catch (err) {}
  setServerStatus(false, 'Standalone Mode');
}

function setServerStatus(online, text) {
  isServerOnline = online;
  if (!elements.serverStatus) return;
  elements.serverStatus.className = `status-badge ${online ? 'status-online' : 'status-connecting'}`;
  const statusText = elements.serverStatus.querySelector('.status-text');
  if (statusText) statusText.textContent = text;
}

// ==========================================================================
// 3. Data Loading
// ==========================================================================
async function loadCampusData() {
  let data = null;
  if (isServerOnline) {
    try { const r = await fetch(`${API_BASE_URL}/data`); if (r.ok) data = await r.json(); } catch (e) {}
  }
  if (!data?.locations?.length) {
    try { const r = await fetch('data.json'); if (r.ok) data = await r.json(); } catch (e) {}
  }
  if (!data?.locations?.length) data = EMBEDDED_CAMPUS_DATA;

  campusData = data;
  locationMap.clear();
  campusData.locations.forEach(l => locationMap.set(l.id, l));
  populateSelectDropdowns();
  renderDirectoryCards('ALL');
  renderSvgMap();
  renderAdminNodesList();
}

// ==========================================================================
// 4. UI Population
// ==========================================================================
function populateSelectDropdowns() {
  const html = ['<option value="" disabled selected>Select location...</option>']
    .concat(campusData.locations.map(l => `<option value="${l.id}">${l.icon} ${l.name} (${l.code})</option>`)).join('');
  elements.startLocation.innerHTML = html;
  elements.endLocation.innerHTML = html;
}

function renderDirectoryCards(cat = 'ALL') {
  const list = cat === 'ALL' ? campusData.locations : campusData.locations.filter(l => l.category === cat);
  if (!list.length) { elements.directoryList.innerHTML = `<div class="empty-state">No locations found.</div>`; return; }
  elements.directoryList.innerHTML = list.map(l => `
    <div class="building-card" onclick="openLocationModal('${l.id}')">
      <div class="building-icon">${l.icon}</div>
      <div class="building-details">
        <div class="building-header"><h4>${l.name}</h4><span class="building-code-badge">${l.code}</span></div>
        <p class="building-desc">${l.description}</p>
      </div>
    </div>`).join('');
}

// ==========================================================================
// 5. SVG Map
// ==========================================================================
function renderSvgMap() {
  elements.layerEdges.innerHTML = '';
  elements.layerNodes.innerHTML = '';
  elements.layerLabels.innerHTML = '';

  campusData.routes.forEach(route => {
    const a = locationMap.get(route.from), b = locationMap.get(route.to);
    if (!a || !b) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    let cls = 'edge-line';
    if (!route.accessible) cls += ' staircase';
    else if (route.type.includes('Ramp') || route.type.includes('Accessible')) cls += ' accessible';
    line.setAttribute('class', cls);
    elements.layerEdges.appendChild(line);
  });

  campusData.locations.forEach(loc => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'location-node');
    g.setAttribute('id', `node-${loc.id}`);
    g.setAttribute('transform', `translate(${loc.x}, ${loc.y})`);

    const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulse.setAttribute('r', '14'); pulse.setAttribute('class', 'node-pulse');
    g.appendChild(pulse);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '10'); circle.setAttribute('class', 'node-circle');
    g.appendChild(circle);

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle'); icon.setAttribute('dy', '4'); icon.setAttribute('font-size', '10');
    icon.textContent = loc.icon;
    g.appendChild(icon);

    g.addEventListener('click', e => { e.stopPropagation(); openLocationModal(loc.id); });
    elements.layerNodes.appendChild(g);

    const gl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gl.setAttribute('transform', `translate(${loc.x}, ${loc.y + 24})`);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label-text'); label.textContent = loc.code;
    gl.appendChild(label);
    elements.layerLabels.appendChild(gl);
  });
}

// ==========================================================================
// 6. Route Finding
// ==========================================================================
elements.routeForm.addEventListener('submit', async e => {
  e.preventDefault();
  const start = elements.startLocation.value, end = elements.endLocation.value;
  if (!start || !end) return;
  if (start === end) { alert('Start and destination must be different.'); return; }
  await computeRoute(start, end, elements.accessibleCheckbox.checked);
});

async function computeRoute(from, to, accessible) {
  let data = null;
  if (isServerOnline) {
    try { const r = await fetch(`${API_BASE_URL}/navigate?from=${from}&to=${to}&accessible=${accessible}`); if (r.ok) data = await r.json(); } catch (e) {}
  }
  if (!data?.success) data = solveDijkstraClientSide(from, to, accessible);
  if (data?.success) { currentRoute = data; renderRouteResults(data); highlightRouteSvg(data); }
  else alert('No suitable route found.');
}

function renderRouteResults(data) {
  elements.routeResults.classList.remove('hidden');
  elements.statDistance.textContent = `${data.totalDistance} m`;
  elements.statTime.textContent = `${data.totalTime} min`;
  data.accessibleOnly ? elements.badgeAccessible.classList.remove('hidden') : elements.badgeAccessible.classList.add('hidden');
  elements.directionsList.innerHTML = data.directions.map(d => `
    <li class="direction-item">
      <span class="step-num">${d.step}</span>
      <div class="step-details">
        <strong>${d.instruction}</strong>
        <div class="step-meta"><span>📏 ${d.distance}m</span> &bull; <span>⏱️ ${d.time} min</span> &bull; <span class="step-type">${d.type}</span></div>
      </div>
    </li>`).join('');
}

function highlightRouteSvg(data) {
  elements.layerActiveRoute.innerHTML = '';
  document.querySelectorAll('.location-node').forEach(n => n.classList.remove('start-node', 'end-node'));
  const np = data.nodePath;
  if (!np || np.length < 2) return;
  const s = document.getElementById(`node-${np[0]}`), e = document.getElementById(`node-${np[np.length-1]}`);
  if (s) s.classList.add('start-node');
  if (e) e.classList.add('end-node');
  let d = '';
  np.forEach((id, i) => { const l = locationMap.get(id); if (l) d += i === 0 ? `M ${l.x} ${l.y}` : ` L ${l.x} ${l.y}`; });
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d); path.setAttribute('class', 'active-route-line');
  elements.layerActiveRoute.appendChild(path);
}

function solveDijkstraClientSide(fromId, toId, accessibleOnly) {
  const dist = new Map(), prev = new Map(), prevEdge = new Map(), unvisited = new Set();
  campusData.locations.forEach(l => { dist.set(l.id, Infinity); unvisited.add(l.id); });
  dist.set(fromId, 0);
  while (unvisited.size > 0) {
    let curr = null, minD = Infinity;
    unvisited.forEach(id => { if (dist.get(id) < minD) { minD = dist.get(id); curr = id; } });
    if (!curr || curr === toId || minD === Infinity) break;
    unvisited.delete(curr);
    campusData.routes.forEach(r => {
      if (accessibleOnly && !r.accessible) return;
      let nb = r.from === curr ? r.to : r.to === curr ? r.from : null;
      if (nb && unvisited.has(nb)) {
        const alt = dist.get(curr) + r.distance;
        if (alt < dist.get(nb)) { dist.set(nb, alt); prev.set(nb, curr); prevEdge.set(nb, r); }
      }
    });
  }
  if (dist.get(toId) === Infinity) return { success: false };
  const nodePath = [], edgePath = [];
  let curr = toId;
  while (curr) { nodePath.unshift(curr); const e = prevEdge.get(curr); if (e) edgePath.unshift(e); curr = prev.get(curr); }
  let totalTime = 0;
  const directions = edgePath.map((r, i) => {
    totalTime += r.time;
    return { step: i+1, from: locationMap.get(nodePath[i]).name, to: locationMap.get(nodePath[i+1]).name,
      distance: r.distance, time: r.time, type: r.type,
      instruction: `Walk along ${r.type} from ${locationMap.get(nodePath[i]).name} towards ${locationMap.get(nodePath[i+1]).name}` };
  });
  return { success: true, from: fromId, to: toId, accessibleOnly, totalDistance: dist.get(toId), totalTime, nodePath, directions };
}

elements.btnClearRoute.addEventListener('click', () => {
  currentRoute = null; elements.layerActiveRoute.innerHTML = ''; elements.routeResults.classList.add('hidden');
  document.querySelectorAll('.location-node').forEach(n => n.classList.remove('start-node', 'end-node'));
});
elements.swapBtn.addEventListener('click', () => {
  const tmp = elements.startLocation.value;
  elements.startLocation.value = elements.endLocation.value;
  elements.endLocation.value = tmp;
});

// Search
elements.globalSearch.addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { elements.searchDropdown.classList.add('hidden'); elements.clearSearchBtn.classList.add('hidden'); return; }
  elements.clearSearchBtn.classList.remove('hidden');
  const matches = campusData.locations.filter(l => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.category.toLowerCase().includes(q));
  elements.searchDropdown.innerHTML = matches.length
    ? matches.map(l => `<div class="search-item" onclick="selectSearchResult('${l.id}')"><span>${l.icon}</span><div><strong>${l.name} (${l.code})</strong><div style="font-size:0.75rem;color:var(--text-muted)">${l.category}</div></div></div>`).join('')
    : `<div class="search-item">No results found</div>`;
  elements.searchDropdown.classList.remove('hidden');
});
elements.clearSearchBtn.addEventListener('click', () => {
  elements.globalSearch.value = ''; elements.searchDropdown.classList.add('hidden'); elements.clearSearchBtn.classList.add('hidden');
});
function selectSearchResult(id) {
  elements.globalSearch.value = ''; elements.searchDropdown.classList.add('hidden'); elements.clearSearchBtn.classList.add('hidden');
  openLocationModal(id);
}

elements.categoryPills.addEventListener('click', e => {
  if (!e.target.classList.contains('pill-btn')) return;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderDirectoryCards(e.target.dataset.category);
});

document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}));

// Modal
function openLocationModal(id) {
  const loc = locationMap.get(id); if (!loc) return;
  activeModalLocationId = id;
  elements.modalIcon.textContent = loc.icon;
  elements.modalTitle.textContent = loc.name;
  elements.modalCategory.textContent = loc.category;
  elements.modalDescription.textContent = loc.description;
  elements.modalCode.textContent = loc.code;
  elements.modalFloors.textContent = loc.floors;
  elements.modalAccessible.textContent = loc.accessible ? 'Yes (Ramp/Elevator)' : 'No';
  elements.modalAmenities.innerHTML = (loc.amenities || []).map(a => `<span class="amenity-chip">${a}</span>`).join('');
  elements.locationModal.classList.remove('hidden');
}
elements.modalClose.addEventListener('click', () => elements.locationModal.classList.add('hidden'));
elements.locationModal.addEventListener('click', e => { if (e.target === elements.locationModal) elements.locationModal.classList.add('hidden'); });
elements.btnSetStart.addEventListener('click', () => {
  if (activeModalLocationId) { elements.startLocation.value = activeModalLocationId; elements.locationModal.classList.add('hidden'); document.querySelector('[data-tab="tab-route"]').click(); }
});
elements.btnSetDestination.addEventListener('click', () => {
  if (activeModalLocationId) { elements.endLocation.value = activeModalLocationId; elements.locationModal.classList.add('hidden'); document.querySelector('[data-tab="tab-route"]').click(); }
});

// Map Controls
function setupMapPanZoom() {
  document.getElementById('btn-zoom-in').addEventListener('click', () => zoomMap(1.2));
  document.getElementById('btn-zoom-out').addEventListener('click', () => zoomMap(0.8));
  document.getElementById('btn-reset-view').addEventListener('click', resetMapView);
  elements.campusSvg.addEventListener('mousedown', e => { if (isPickingCoords) return; isDraggingMap = true; dragStart = { x: e.clientX - mapTransform.translateX, y: e.clientY - mapTransform.translateY }; });
  window.addEventListener('mousemove', e => { if (!isDraggingMap || isPickingCoords) return; mapTransform.translateX = e.clientX - dragStart.x; mapTransform.translateY = e.clientY - dragStart.y; applyMapTransform(); });
  window.addEventListener('mouseup', () => isDraggingMap = false);
  elements.campusSvg.addEventListener('wheel', e => { e.preventDefault(); zoomMap(e.deltaY < 0 ? 1.1 : 0.9); });
  elements.campusSvg.addEventListener('click', e => {
    if (!isPickingCoords) return;
    e.stopPropagation();
    const rect = elements.campusSvg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 800);
    elements.adminNodeX.value = x; elements.adminNodeY.value = y;
    renderAdminPreviewPin(x, y);
    isPickingCoords = false;
    elements.campusSvg.classList.remove('picking-coords');
    elements.btnPickCoords.classList.remove('btn-secondary'); elements.btnPickCoords.classList.add('btn-primary');
    elements.coordPickerStatus.textContent = `Picked coordinates: X=${x}, Y=${y}`;
  });
}

function renderAdminPreviewPin(x, y) {
  elements.layerAdminPreview.innerHTML = `<g transform="translate(${x}, ${y})"><circle r="16" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.8"><animate attributeName="r" values="10;22;10" dur="1.5s" repeatCount="indefinite"/></circle><circle r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/></g>`;
}
function zoomMap(f) { mapTransform.scale = Math.max(0.6, Math.min(3.0, mapTransform.scale * f)); applyMapTransform(); }
function resetMapView() { mapTransform = { scale: 1, translateX: 0, translateY: 0 }; applyMapTransform(); }
function applyMapTransform() {
  const g = elements.layerEdges.parentElement;
  g.style.transform = `translate(${mapTransform.translateX}px, ${mapTransform.translateY}px) scale(${mapTransform.scale})`;
  g.style.transformOrigin = 'center center';
}

function setupEventListeners() {
  document.getElementById('btn-toggle-paths').addEventListener('click', e => {
    e.target.classList.toggle('active');
    elements.layerEdges.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });
  document.getElementById('btn-toggle-labels').addEventListener('click', e => {
    e.target.classList.toggle('active');
    elements.layerLabels.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });
}

// ==========================================================================
// 7. Admin Auth & Session (Token-based)
// ==========================================================================
function setupAdminListeners() {
  if (elements.adminLoginForm) elements.adminLoginForm.addEventListener('submit', async e => { e.preventDefault(); await handleAdminLogin(); });
  if (elements.btnAdminLogout) elements.btnAdminLogout.addEventListener('click', handleAdminLogout);

  elements.btnPickCoords.addEventListener('click', () => {
    isPickingCoords = true;
    elements.campusSvg.classList.add('picking-coords');
    elements.btnPickCoords.classList.remove('btn-secondary'); elements.btnPickCoords.classList.add('btn-primary');
    elements.coordPickerStatus.textContent = '🎯 CLICK ANYWHERE ON THE CAMPUS MAP TO PLACE PIN!';
  });

  elements.adminAddNodeForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('admin-node-name').value.trim();
    const code = document.getElementById('admin-node-code').value.trim().toUpperCase();
    const category = document.getElementById('admin-node-category').value;
    const icon = document.getElementById('admin-node-icon').value.trim() || '🏢';
    const x = parseInt(elements.adminNodeX.value);
    const y = parseInt(elements.adminNodeY.value);
    const floors = parseInt(document.getElementById('admin-node-floors').value);
    const accessible = document.getElementById('admin-node-accessible').checked;
    const description = document.getElementById('admin-node-desc').value.trim() || `${name} facility.`;
    const id = `loc_${code.toLowerCase()}_${Date.now()}`;
    await addLocationNode({ id, name, code, category, x, y, floors, accessible, description, icon, amenities: ["Elevator", "Wi-Fi"] });
    elements.adminAddNodeForm.reset();
    elements.layerAdminPreview.innerHTML = '';
    elements.coordPickerStatus.textContent = `✓ Successfully added ${name} (${code})!`;
  });
}

async function checkAdminSession() {
  if (!isServerOnline) return;
  try {
    const headers = {};
    if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
    const res = await fetch(`${API_BASE_URL}/admin/session`, { method: 'GET', credentials: 'include', headers });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        authenticatedAdminEmail = data.email || 'admin@campus.edu';
        if (data.sessionToken) adminSessionToken = data.sessionToken;
        unlockAdminDashboard();
      } else { lockAdminDashboard(); }
    } else { lockAdminDashboard(); }
  } catch (e) { lockAdminDashboard(); }
}

async function handleAdminLogin() {
  const email = elements.adminEmail.value.trim();
  const password = elements.adminPassword.value.trim();
  hideAuthError();
  if (!email || !password) { showAuthError('Please enter both email and password.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAuthError('Please enter a valid email address.'); return; }

  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        authenticatedAdminEmail = data.email || email;
        // Store token in memory — sent as X-Session-Token header on all admin requests
        if (data.sessionToken) adminSessionToken = data.sessionToken;
        elements.adminPassword.value = '';
        unlockAdminDashboard();
      } else { showAuthError(data.error || 'Authentication failed.'); }
    } catch (e) { showAuthError('Network error connecting to server.'); }
  } else {
    showAuthError('Server is offline. Admin authentication requires active backend server.');
  }
}

async function handleAdminLogout() {
  if (isServerOnline) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
      await fetch(`${API_BASE_URL}/admin/logout`, { method: 'POST', credentials: 'include', headers });
    } catch (e) {}
  }
  adminSessionToken = null;
  lockAdminDashboard();
}

function unlockAdminDashboard() {
  isAdminUnlocked = true;
  if (elements.adminProfileEmail) elements.adminProfileEmail.textContent = authenticatedAdminEmail;
  elements.adminAuthCard.classList.add('hidden');
  elements.adminDashboard.classList.remove('hidden');
  renderAdminNodesList();
}

function lockAdminDashboard() {
  isAdminUnlocked = false;
  elements.adminAuthCard.classList.remove('hidden');
  elements.adminDashboard.classList.add('hidden');
}

function showAuthError(msg) {
  if (!elements.adminAuthError) return;
  elements.adminAuthError.textContent = `⚠️ ${msg}`;
  elements.adminAuthError.classList.remove('hidden');
}

function hideAuthError() {
  if (!elements.adminAuthError) return;
  elements.adminAuthError.classList.add('hidden');
  elements.adminAuthError.textContent = '';
}

function renderAdminNodesList() {
  if (!elements.adminNodesList) return;
  elements.adminNodeCountBadge.textContent = `${campusData.locations.length} Total Nodes`;
  elements.adminNodesList.innerHTML = campusData.locations.map(l => `
    <div class="admin-node-item">
      <div class="node-meta">
        <span style="font-size:1.3rem">${l.icon}</span>
        <div class="node-title-box"><strong>${l.name} (${l.code})</strong><small>${l.category} &bull; Pos: (${l.x}, ${l.y})</small></div>
      </div>
      <button type="button" class="btn-delete-node" onclick="deleteLocationNode('${l.id}')">🗑️ Delete</button>
    </div>`).join('');
}

async function addLocationNode(newNode) {
  if (!isAdminUnlocked) { alert('Unauthorized: Please sign in as admin.'); lockAdminDashboard(); return; }
  if (isServerOnline) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
      const res = await fetch(`${API_BASE_URL}/admin/node/add`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify(newNode) });
      if (res.status === 401) { alert('Session expired. Please sign in again.'); adminSessionToken = null; lockAdminDashboard(); return; }
    } catch (e) { console.warn('Add node API failed:', e); }
  }
  campusData.locations.push(newNode); locationMap.set(newNode.id, newNode);
  let closest = null, minDist = Infinity;
  campusData.locations.forEach(l => { if (l.id !== newNode.id) { const d = Math.round(Math.hypot(l.x - newNode.x, l.y - newNode.y)); if (d < minDist) { minDist = d; closest = l; } } });
  if (closest) campusData.routes.push({ id: `r_auto_${Date.now()}`, from: newNode.id, to: closest.id, distance: minDist, time: Math.max(1, Math.round(minDist / 70)), type: "Paved Walkway", accessible: true });
  populateSelectDropdowns(); renderDirectoryCards('ALL'); renderSvgMap(); renderAdminNodesList();
}

async function deleteLocationNode(id) {
  if (!isAdminUnlocked) { alert('Unauthorized: Please sign in as admin.'); lockAdminDashboard(); return; }
  const loc = locationMap.get(id);
  if (!confirm(loc ? `Delete '${loc.name}'?` : 'Delete this node?')) return;
  if (isServerOnline) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
      const res = await fetch(`${API_BASE_URL}/admin/node/delete`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify({ id }) });
      if (res.status === 401) { alert('Session expired. Please sign in again.'); adminSessionToken = null; lockAdminDashboard(); return; }
    } catch (e) { console.warn('Delete node API failed:', e); }
  }
  campusData.locations = campusData.locations.filter(l => l.id !== id);
  locationMap.delete(id);
  campusData.routes = campusData.routes.filter(r => r.from !== id && r.to !== id);
  populateSelectDropdowns(); renderDirectoryCards('ALL'); renderSvgMap(); renderAdminNodesList();
}