/**
 * Campus Navigation System - Interactive Client Controller & Admin Portal
 * Features real-time route pathfinding, accessibility routing, and Secure Admin Portal.
 */

// Embedded Campus Dataset (guarantees instant loading even on file:// protocol without local webserver)
const EMBEDDED_CAMPUS_DATA = {
  "campusInfo": {
    "name": "Nova Horizon University Campus",
    "mapDimensions": { "width": 1000, "height": 800 }
  },
  "locations": [
    {
      "id": "eng_building",
      "name": "Engineering & Technology Complex",
      "code": "ENG",
      "category": "Academic",
      "x": 220,
      "y": 180,
      "floors": 4,
      "accessible": true,
      "description": "Houses Computer Science, Electrical, and Mechanical Engineering departments with advanced robotics labs.",
      "icon": "🛠️",
      "amenities": ["Wi-Fi", "Computer Labs", "Elevator", "Study Lounges"]
    },
    {
      "id": "science_hall",
      "name": "Science & Research Center",
      "code": "SCI",
      "category": "Academic",
      "x": 440,
      "y": 150,
      "floors": 3,
      "accessible": true,
      "description": "Chemistry, Physics, and Biotech research laboratories equipped with state-of-the-art instruments.",
      "icon": "🔬",
      "amenities": ["Wi-Fi", "Wet Labs", "Elevator", "Lecture Halls"]
    },
    {
      "id": "main_library",
      "name": "Central Campus Library",
      "code": "LIB",
      "category": "Library",
      "x": 560,
      "y": 320,
      "floors": 5,
      "accessible": true,
      "description": "24/7 university library with quiet study spaces, media suites, and extensive digital archives.",
      "icon": "📚",
      "amenities": ["Wi-Fi", "Quiet Rooms", "Café", "Elevator", "Print Center"]
    },
    {
      "id": "student_union",
      "name": "Student Activity Union",
      "code": "SAU",
      "category": "Student Center",
      "x": 380,
      "y": 360,
      "floors": 3,
      "accessible": true,
      "description": "Hub for student clubs, campus events, career placement center, and relaxation zones.",
      "icon": "🏛️",
      "amenities": ["Wi-Fi", "Event Hall", "ATM", "Information Desk"]
    },
    {
      "id": "central_dining",
      "name": "Campus Dining Commons",
      "code": "DIN",
      "category": "Dining",
      "x": 220,
      "y": 420,
      "floors": 2,
      "accessible": true,
      "description": "Main dining hall serving organic meals, international cuisine, coffee, and fresh bakery.",
      "icon": "🍴",
      "amenities": ["Vegan Options", "Outdoor Seating", "Accessible Restrooms"]
    },
    {
      "id": "sports_arena",
      "name": "Athletics & Recreation Arena",
      "code": "SPT",
      "category": "Sports",
      "x": 200,
      "y": 660,
      "floors": 2,
      "accessible": true,
      "description": "Olympic-size pool, indoor basketball courts, gym facility, and athletics office.",
      "icon": "⚽",
      "amenities": ["Lockers", "Showers", "Gym Equipment", "Elevator"]
    },
    {
      "id": "admin_building",
      "name": "University Administration",
      "code": "ADM",
      "category": "Admin",
      "x": 720,
      "y": 180,
      "floors": 3,
      "accessible": true,
      "description": "Office of Admissions, Registrar, Financial Aid, and Executive Administration.",
      "icon": "🏢",
      "amenities": ["Wi-Fi", "Registrar Desk", "Elevator", "Visitor Lounge"]
    },
    {
      "id": "dorm_north",
      "name": "North Quad Residences",
      "code": "NQR",
      "category": "Residence",
      "x": 680,
      "y": 480,
      "floors": 6,
      "accessible": true,
      "description": "Modern student residence halls with community kitchens, laundry, and courtyard.",
      "icon": "🏠",
      "amenities": ["Laundry", "Kitchen", "Study Rooms", "Security Desk"]
    },
    {
      "id": "dorm_south",
      "name": "South Quad Residences",
      "code": "SQR",
      "category": "Residence",
      "x": 460,
      "y": 680,
      "floors": 5,
      "accessible": true,
      "description": "Residence halls adjacent to sports fields and dining facilities.",
      "icon": "🏠",
      "amenities": ["Laundry", "Game Room", "Elevator"]
    },
    {
      "id": "innovation_hub",
      "name": "Tech & Entrepreneurship Hub",
      "code": "HUB",
      "category": "Academic",
      "x": 840,
      "y": 350,
      "floors": 4,
      "accessible": true,
      "description": "Incubator space for student startups, 3D printing labs, and maker spaces.",
      "icon": "💡",
      "amenities": ["3D Printers", "Co-working Space", "High-speed Fiber"]
    },
    {
      "id": "health_center",
      "name": "Campus Health & Wellness Center",
      "code": "HLC",
      "category": "Medical",
      "x": 780,
      "y": 640,
      "floors": 2,
      "accessible": true,
      "description": "Full-service health clinic providing medical care, counseling, and pharmacy services.",
      "icon": "🏥",
      "amenities": ["Pharmacy", "Urgent Care", "Wheelchair Access", "Counseling"]
    },
    {
      "id": "arts_center",
      "name": "Performing Arts Center",
      "code": "PAC",
      "category": "Arts",
      "x": 380,
      "y": 540,
      "floors": 3,
      "accessible": true,
      "description": "700-seat auditorium, music practice rooms, and fine arts gallery.",
      "icon": "🎭",
      "amenities": ["Auditorium", "Gallery", "Elevator", "Acoustic Rooms"]
    }
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

// Configuration & State
const API_BASE_URL = 'http://localhost:8080/api';
let campusData = { locations: [], routes: [] };
let locationMap = new Map();
let currentRoute = null;
let isServerOnline = false;
let mapTransform = { scale: 1, translateX: 0, translateY: 0 };
let isDraggingMap = false;
let dragStart = { x: 0, y: 0 };

// Admin Portal State
let isAdminUnlocked = false;
let isPickingCoords = false;
let authenticatedAdminEmail = 'admin@campus.edu';

// DOM Elements Cache
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
  
  // SVG Elements
  campusSvg: document.getElementById('campus-svg'),
  layerEdges: document.getElementById('layer-edges'),
  layerActiveRoute: document.getElementById('layer-active-route'),
  layerNodes: document.getElementById('layer-nodes'),
  layerLabels: document.getElementById('layer-labels'),
  layerAdminPreview: document.getElementById('layer-admin-preview'),
  
  // Modal Elements
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

  // Admin Elements
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
// 1. App Initialization
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
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.className = `${newTheme}-theme`;
  localStorage.setItem('novanav_theme', newTheme);
  updateThemeIcon(newTheme);
});

// ==========================================================================
// 2. Server API Communication
// ==========================================================================
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2500) });
    if (response.ok) {
      setServerStatus(true, 'Online (App.java:8080)');
      return;
    }
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

async function loadCampusData() {
  let loadedData = null;

  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/data`);
      if (res.ok) loadedData = await res.json();
    } catch (err) {}
  }

  if (!loadedData || !loadedData.locations || loadedData.locations.length === 0) {
    try {
      const res = await fetch('data.json');
      if (res.ok) loadedData = await res.json();
    } catch (err) {}
  }

  if (!loadedData || !loadedData.locations || loadedData.locations.length === 0) {
    loadedData = EMBEDDED_CAMPUS_DATA;
  }

  campusData = loadedData;
  locationMap.clear();
  campusData.locations.forEach(loc => locationMap.set(loc.id, loc));

  populateSelectDropdowns();
  renderDirectoryCards('ALL');
  renderSvgMap();
  renderAdminNodesList();
}

// ==========================================================================
// 3. Dynamic UI Population
// ==========================================================================
function populateSelectDropdowns() {
  const optionsHtml = ['<option value="" disabled selected>Select location...</option>']
    .concat(campusData.locations.map(loc => 
      `<option value="${loc.id}">${loc.icon} ${loc.name} (${loc.code})</option>`
    )).join('');

  elements.startLocation.innerHTML = optionsHtml;
  elements.endLocation.innerHTML = optionsHtml;
}

function renderDirectoryCards(categoryFilter = 'ALL') {
  const filtered = categoryFilter === 'ALL'
    ? campusData.locations
    : campusData.locations.filter(l => l.category === categoryFilter);

  if (filtered.length === 0) {
    elements.directoryList.innerHTML = `<div class="empty-state">No locations found in this category.</div>`;
    return;
  }

  elements.directoryList.innerHTML = filtered.map(loc => `
    <div class="building-card" onclick="openLocationModal('${loc.id}')">
      <div class="building-icon">${loc.icon}</div>
      <div class="building-details">
        <div class="building-header">
          <h4>${loc.name}</h4>
          <span class="building-code-badge">${loc.code}</span>
        </div>
        <p class="building-desc">${loc.description}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// 4. Interactive SVG Map Rendering
// ==========================================================================
function renderSvgMap() {
  elements.layerEdges.innerHTML = '';
  elements.layerNodes.innerHTML = '';
  elements.layerLabels.innerHTML = '';

  campusData.routes.forEach(route => {
    const locA = locationMap.get(route.from);
    const locB = locationMap.get(route.to);
    if (!locA || !locB) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', locA.x);
    line.setAttribute('y1', locA.y);
    line.setAttribute('x2', locB.x);
    line.setAttribute('y2', locB.y);
    
    let edgeClass = 'edge-line';
    if (!route.accessible) edgeClass += ' staircase';
    else if (route.type.includes('Ramp') || route.type.includes('Accessible')) edgeClass += ' accessible';
    
    line.setAttribute('class', edgeClass);
    line.setAttribute('data-route-id', route.id);
    elements.layerEdges.appendChild(line);
  });

  campusData.locations.forEach(loc => {
    const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gNode.setAttribute('class', 'location-node');
    gNode.setAttribute('id', `node-${loc.id}`);
    gNode.setAttribute('transform', `translate(${loc.x}, ${loc.y})`);

    const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulseCircle.setAttribute('r', '14');
    pulseCircle.setAttribute('class', 'node-pulse');
    gNode.appendChild(pulseCircle);

    const mainCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    mainCircle.setAttribute('r', '10');
    mainCircle.setAttribute('class', 'node-circle');
    gNode.appendChild(mainCircle);

    const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    iconText.setAttribute('text-anchor', 'middle');
    iconText.setAttribute('dy', '4');
    iconText.setAttribute('font-size', '10');
    iconText.textContent = loc.icon;
    gNode.appendChild(iconText);

    gNode.addEventListener('click', (e) => {
      e.stopPropagation();
      openLocationModal(loc.id);
    });

    elements.layerNodes.appendChild(gNode);

    const gLabel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gLabel.setAttribute('transform', `translate(${loc.x}, ${loc.y + 24})`);

    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('class', 'node-label-text');
    labelText.textContent = loc.code;

    gLabel.appendChild(labelText);
    elements.layerLabels.appendChild(gLabel);
  });
}

// ==========================================================================
// 5. Route Pathfinding & Highlight
// ==========================================================================
elements.routeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const start = elements.startLocation.value;
  const end = elements.endLocation.value;
  const accessibleOnly = elements.accessibleCheckbox.checked;

  if (!start || !end) return;
  if (start === end) {
    alert('Start and destination locations must be different.');
    return;
  }

  await computeRoute(start, end, accessibleOnly);
});

async function computeRoute(fromId, toId, accessibleOnly) {
  let routeData = null;

  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/navigate?from=${fromId}&to=${toId}&accessible=${accessibleOnly}`);
      if (res.ok) routeData = await res.json();
    } catch (err) {}
  }

  if (!routeData || !routeData.success) {
    routeData = solveDijkstraClientSide(fromId, toId, accessibleOnly);
  }

  if (routeData && routeData.success) {
    currentRoute = routeData;
    renderRouteResults(routeData);
    highlightRouteSvg(routeData);
  } else {
    alert('No suitable route found matching your criteria.');
  }
}

function renderRouteResults(data) {
  elements.routeResults.classList.remove('hidden');
  elements.statDistance.textContent = `${data.totalDistance} m`;
  elements.statTime.textContent = `${data.totalTime} min`;

  if (data.accessibleOnly) {
    elements.badgeAccessible.classList.remove('hidden');
  } else {
    elements.badgeAccessible.classList.add('hidden');
  }

  elements.directionsList.innerHTML = data.directions.map(dir => `
    <li class="direction-item">
      <span class="step-num">${dir.step}</span>
      <div class="step-details">
        <strong>${dir.instruction}</strong>
        <div class="step-meta">
          <span>📏 ${dir.distance}m</span> &bull; 
          <span>⏱️ ${dir.time} min</span> &bull; 
          <span class="step-type">${dir.type}</span>
        </div>
      </div>
    </li>
  `).join('');
}

function highlightRouteSvg(data) {
  elements.layerActiveRoute.innerHTML = '';

  document.querySelectorAll('.location-node').forEach(node => {
    node.classList.remove('start-node', 'end-node');
  });

  const nodePath = data.nodePath;
  if (!nodePath || nodePath.length < 2) return;

  const startEl = document.getElementById(`node-${nodePath[0]}`);
  const endEl = document.getElementById(`node-${nodePath[nodePath.length - 1]}`);
  if (startEl) startEl.classList.add('start-node');
  if (endEl) endEl.classList.add('end-node');

  let pathD = '';
  nodePath.forEach((nodeId, idx) => {
    const loc = locationMap.get(nodeId);
    if (loc) {
      pathD += (idx === 0 ? `M ${loc.x} ${loc.y}` : ` L ${loc.x} ${loc.y}`);
    }
  });

  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', pathD);
  pathEl.setAttribute('class', 'active-route-line');
  elements.layerActiveRoute.appendChild(pathEl);
}

function solveDijkstraClientSide(fromId, toId, accessibleOnly) {
  const dist = new Map();
  const prevNode = new Map();
  const prevEdge = new Map();
  const unvisited = new Set();

  campusData.locations.forEach(loc => {
    dist.set(loc.id, Infinity);
    unvisited.add(loc.id);
  });
  dist.set(fromId, 0);

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;
    unvisited.forEach(nodeId => {
      if (dist.get(nodeId) < minD) {
        minD = dist.get(nodeId);
        curr = nodeId;
      }
    });

    if (!curr || curr === toId || minD === Infinity) break;
    unvisited.delete(curr);

    campusData.routes.forEach(r => {
      if (accessibleOnly && !r.accessible) return;

      let neighbor = null;
      if (r.from === curr) neighbor = r.to;
      else if (r.to === curr) neighbor = r.from;

      if (neighbor && unvisited.has(neighbor)) {
        const alt = dist.get(curr) + r.distance;
        if (alt < dist.get(neighbor)) {
          dist.set(neighbor, alt);
          prevNode.set(neighbor, curr);
          prevEdge.set(neighbor, r);
        }
      }
    });
  }

  if (dist.get(toId) === Infinity) return { success: false };

  const nodePath = [];
  const edgePath = [];
  let curr = toId;
  while (curr) {
    nodePath.unshift(curr);
    const edge = prevEdge.get(curr);
    if (edge) edgePath.unshift(edge);
    curr = prevNode.get(curr);
  }

  let totalTime = 0;
  const directions = edgePath.map((r, i) => {
    totalTime += r.time;
    const stepFrom = locationMap.get(nodePath[i]).name;
    const stepTo = locationMap.get(nodePath[i + 1]).name;
    return {
      step: i + 1,
      from: stepFrom,
      to: stepTo,
      distance: r.distance,
      time: r.time,
      type: r.type,
      instruction: `Walk along ${r.type} from ${stepFrom} towards ${stepTo}`
    };
  });

  return {
    success: true,
    from: fromId,
    to: toId,
    accessibleOnly,
    totalDistance: dist.get(toId),
    totalTime,
    nodePath,
    directions
  };
}

// Clear & Swap Controls
elements.btnClearRoute.addEventListener('click', () => {
  currentRoute = null;
  elements.layerActiveRoute.innerHTML = '';
  elements.routeResults.classList.add('hidden');
  document.querySelectorAll('.location-node').forEach(node => {
    node.classList.remove('start-node', 'end-node');
  });
});

elements.swapBtn.addEventListener('click', () => {
  const tmp = elements.startLocation.value;
  elements.startLocation.value = elements.endLocation.value;
  elements.endLocation.value = tmp;
});

// Search & Directory Filters
elements.globalSearch.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    elements.searchDropdown.classList.add('hidden');
    elements.clearSearchBtn.classList.add('hidden');
    return;
  }

  elements.clearSearchBtn.classList.remove('hidden');
  const matches = campusData.locations.filter(loc =>
    loc.name.toLowerCase().includes(query) ||
    loc.code.toLowerCase().includes(query) ||
    loc.category.toLowerCase().includes(query) ||
    loc.description.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    elements.searchDropdown.innerHTML = `<div class="search-item">No matching buildings found</div>`;
  } else {
    elements.searchDropdown.innerHTML = matches.map(loc => `
      <div class="search-item" onclick="selectSearchResult('${loc.id}')">
        <span>${loc.icon}</span>
        <div>
          <strong>${loc.name} (${loc.code})</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${loc.category}</div>
        </div>
      </div>
    `).join('');
  }
  elements.searchDropdown.classList.remove('hidden');
});

elements.clearSearchBtn.addEventListener('click', () => {
  elements.globalSearch.value = '';
  elements.searchDropdown.classList.add('hidden');
  elements.clearSearchBtn.classList.add('hidden');
});

function selectSearchResult(id) {
  elements.globalSearch.value = '';
  elements.searchDropdown.classList.add('hidden');
  elements.clearSearchBtn.classList.add('hidden');
  openLocationModal(id);
}

elements.categoryPills.addEventListener('click', (e) => {
  if (!e.target.classList.contains('pill-btn')) return;
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  renderDirectoryCards(e.target.dataset.category);
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Modal Drawer
function openLocationModal(id) {
  const loc = locationMap.get(id);
  if (!loc) return;

  activeModalLocationId = id;
  elements.modalIcon.textContent = loc.icon;
  elements.modalTitle.textContent = loc.name;
  elements.modalCategory.textContent = loc.category;
  elements.modalDescription.textContent = loc.description;
  elements.modalCode.textContent = loc.code;
  elements.modalFloors.textContent = loc.floors;
  elements.modalAccessible.textContent = loc.accessible ? 'Yes (Ramp/Elevator)' : 'No';

  elements.modalAmenities.innerHTML = (loc.amenities || []).map(a =>
    `<span class="amenity-chip">${a}</span>`
  ).join('');

  elements.locationModal.classList.remove('hidden');
}

elements.modalClose.addEventListener('click', () => {
  elements.locationModal.classList.add('hidden');
});

elements.locationModal.addEventListener('click', (e) => {
  if (e.target === elements.locationModal) {
    elements.locationModal.classList.add('hidden');
  }
});

elements.btnSetStart.addEventListener('click', () => {
  if (activeModalLocationId) {
    elements.startLocation.value = activeModalLocationId;
    elements.locationModal.classList.add('hidden');
    document.querySelector('[data-tab="tab-route"]').click();
  }
});

elements.btnSetDestination.addEventListener('click', () => {
  if (activeModalLocationId) {
    elements.endLocation.value = activeModalLocationId;
    elements.locationModal.classList.add('hidden');
    document.querySelector('[data-tab="tab-route"]').click();
    if (elements.startLocation.value && elements.startLocation.value !== activeModalLocationId) {
      elements.routeForm.dispatchEvent(new Event('submit'));
    }
  }
});

// Map Controls
function setupMapPanZoom() {
  document.getElementById('btn-zoom-in').addEventListener('click', () => zoomMap(1.2));
  document.getElementById('btn-zoom-out').addEventListener('click', () => zoomMap(0.8));
  document.getElementById('btn-reset-view').addEventListener('click', () => resetMapView());

  elements.campusSvg.addEventListener('mousedown', (e) => {
    if (isPickingCoords) return;
    isDraggingMap = true;
    dragStart = { x: e.clientX - mapTransform.translateX, y: e.clientY - mapTransform.translateY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingMap || isPickingCoords) return;
    mapTransform.translateX = e.clientX - dragStart.x;
    mapTransform.translateY = e.clientY - dragStart.y;
    applyMapTransform();
  });

  window.addEventListener('mouseup', () => {
    isDraggingMap = false;
  });

  elements.campusSvg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomMap(zoomFactor);
  });

  // Map Click event for Coordinate Picking Mode
  elements.campusSvg.addEventListener('click', (e) => {
    if (!isPickingCoords) return;
    e.stopPropagation();

    const rect = elements.campusSvg.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 800);

    elements.adminNodeX.value = clickX;
    elements.adminNodeY.value = clickY;

    // Render Preview Pin
    renderAdminPreviewPin(clickX, clickY);

    isPickingCoords = false;
    elements.campusSvg.classList.remove('picking-coords');
    elements.btnPickCoords.classList.remove('btn-secondary');
    elements.btnPickCoords.classList.add('btn-primary');
    elements.coordPickerStatus.textContent = `Picked coordinates: X=${clickX}, Y=${clickY}`;
  });
}

function renderAdminPreviewPin(x, y) {
  elements.layerAdminPreview.innerHTML = `
    <g transform="translate(${x}, ${y})">
      <circle r="16" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.8">
        <animate attributeName="r" values="10;22;10" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>
    </g>
  `;
}

function zoomMap(factor) {
  mapTransform.scale = Math.max(0.6, Math.min(3.0, mapTransform.scale * factor));
  applyMapTransform();
}

function resetMapView() {
  mapTransform = { scale: 1, translateX: 0, translateY: 0 };
  applyMapTransform();
}

function applyMapTransform() {
  elements.layerEdges.parentElement.style.transform = 
    `translate(${mapTransform.translateX}px, ${mapTransform.translateY}px) scale(${mapTransform.scale})`;
  elements.layerEdges.parentElement.style.transformOrigin = 'center center';
}

function setupEventListeners() {
  document.getElementById('btn-toggle-paths').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    elements.layerEdges.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });

  document.getElementById('btn-toggle-labels').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    elements.layerLabels.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });
}

// ==========================================================================
// 6. Administrator Security, Authentication & Session Handlers
// ==========================================================================
function setupAdminListeners() {
  // Login Form Submission
  if (elements.adminLoginForm) {
    elements.adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleAdminLogin();
    });
  }

  // Logout Click
  if (elements.btnAdminLogout) {
    elements.btnAdminLogout.addEventListener('click', async () => {
      await handleAdminLogout();
    });
  }

  // Pick Coordinates mode
  elements.btnPickCoords.addEventListener('click', () => {
    isPickingCoords = true;
    elements.campusSvg.classList.add('picking-coords');
    elements.btnPickCoords.classList.remove('btn-secondary');
    elements.btnPickCoords.classList.add('btn-primary');
    elements.coordPickerStatus.textContent = '🎯 CLICK ANYWHERE ON THE CAMPUS MAP CANVAS TO PLACE PIN!';
  });

  // Add Node Form Submit
  elements.adminAddNodeForm.addEventListener('submit', async (e) => {
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

    const newNode = { id, name, code, category, x, y, floors, accessible, description, icon, amenities: ["Elevator", "Wi-Fi"] };

    await addLocationNode(newNode);
    elements.adminAddNodeForm.reset();
    elements.layerAdminPreview.innerHTML = '';
    elements.coordPickerStatus.textContent = `✓ Successfully added ${name} (${code})!`;
  });
}

async function checkAdminSession() {
  if (!isServerOnline) return;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/session`, {
      method: 'GET',
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        authenticatedAdminEmail = data.email || 'admin@campus.edu';
        unlockAdminDashboard();
      } else {
        lockAdminDashboard();
      }
    } else {
      lockAdminDashboard();
    }
  } catch (err) {
    lockAdminDashboard();
  }
}

async function handleAdminLogin() {
  const email = elements.adminEmail.value.trim();
  const password = elements.adminPassword.value.trim();

  hideAuthError();

  if (!email || !password) {
    showAuthError('Please enter both admin email address and password.');
    return;
  }

  // Simple email format check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showAuthError('Please enter a valid email address (e.g. admin@campus.edu).');
    return;
  }

  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        authenticatedAdminEmail = data.email || email;
        elements.adminPassword.value = '';
        unlockAdminDashboard();
      } else {
        showAuthError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      showAuthError('Network error connecting to authentication server.');
    }
  } else {
    // Client-side fallback mode prompt
    showAuthError('Server is currently offline. Administrator authentication requires active backend server.');
  }
}

async function handleAdminLogout() {
  if (isServerOnline) {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {}
  }
  lockAdminDashboard();
}

function unlockAdminDashboard() {
  isAdminUnlocked = true;
  if (elements.adminProfileEmail) {
    elements.adminProfileEmail.textContent = authenticatedAdminEmail;
  }
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

  elements.adminNodesList.innerHTML = campusData.locations.map(loc => `
    <div class="admin-node-item">
      <div class="node-meta">
        <span style="font-size:1.3rem">${loc.icon}</span>
        <div class="node-title-box">
          <strong>${loc.name} (${loc.code})</strong>
          <small>${loc.category} &bull; Pos: (${loc.x}, ${loc.y})</small>
        </div>
      </div>
      <button type="button" class="btn-delete-node" onclick="deleteLocationNode('${loc.id}')">
        🗑️ Delete
      </button>
    </div>
  `).join('');
}

async function addLocationNode(newNode) {
  if (!isAdminUnlocked) {
    alert('Unauthorized: You must be logged in as an administrator.');
    lockAdminDashboard();
    return;
  }

  // 1. Post to Server API if online
  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/node/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newNode)
      });

      if (res.status === 401) {
        alert('Admin session expired. Please sign in again.');
        lockAdminDashboard();
        return;
      }
    } catch (err) {
      console.warn('API add node failed:', err);
    }
  }

  // 2. Add to local state
  campusData.locations.push(newNode);
  locationMap.set(newNode.id, newNode);

  // Auto-connect to closest existing node within 280m radius
  let closestLoc = null;
  let minDistance = Infinity;

  campusData.locations.forEach(loc => {
    if (loc.id !== newNode.id) {
      const dist = Math.round(Math.hypot(loc.x - newNode.x, loc.y - newNode.y));
      if (dist < minDistance) {
        minDistance = dist;
        closestLoc = loc;
      }
    }
  });

  if (closestLoc) {
    const newRoute = {
      id: `r_auto_${Date.now()}`,
      from: newNode.id,
      to: closestLoc.id,
      distance: minDistance,
      time: Math.max(1, Math.round(minDistance / 70)),
      type: "Paved Walkway",
      accessible: true
    };
    campusData.routes.push(newRoute);
  }

  // Refresh UI Components
  populateSelectDropdowns();
  renderDirectoryCards('ALL');
  renderSvgMap();
  renderAdminNodesList();
}

async function deleteLocationNode(id) {
  if (!isAdminUnlocked) {
    alert('Unauthorized: You must be logged in as an administrator.');
    lockAdminDashboard();
    return;
  }

  const loc = locationMap.get(id);
  const confirmMsg = loc ? `Are you sure you want to delete '${loc.name}'?` : 'Delete node?';
  if (!confirm(confirmMsg)) return;

  // 1. Post to Server API if online
  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/node/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      if (res.status === 401) {
        alert('Admin session expired. Please sign in again.');
        lockAdminDashboard();
        return;
      }
    } catch (err) {
      console.warn('API delete node failed:', err);
    }
  }

  // 2. Remove from local memory
  campusData.locations = campusData.locations.filter(l => l.id !== id);
  locationMap.delete(id);
  campusData.routes = campusData.routes.filter(r => r.from !== id && r.to !== id);

  // Refresh UI Components
  populateSelectDropdowns();
  renderDirectoryCards('ALL');
  renderSvgMap();
  renderAdminNodesList();
}