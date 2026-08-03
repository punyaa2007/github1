/**
 * NovaNav - Smart Campus Navigation System for Persons with Disabilities
 * Features Voice Navigation (Web Speech API), Indoor Positioning System (IPS) Simulator,
 * Accessibility Multi-Mode Pathfinder, Map Overlay Features, and Admin Portal.
 */

// Embedded Campus Dataset with complete accessibility metadata
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
      "amenities": ["Wi-Fi", "Computer Labs", "Elevator", "Study Lounges"],
      "ramps": [{"id": "r_eng", "name": "ENG Main Entrance Ramp", "x": 235, "y": 195}],
      "elevators": [{"id": "e_eng", "name": "ENG Central Elevator", "x": 215, "y": 170, "floors": "1-4"}],
      "accessibleEntrances": [{"id": "ae_eng", "name": "ENG Automatic Power Door", "x": 230, "y": 190}],
      "accessibleRestrooms": [{"id": "ar_eng", "name": "ENG ADA Unisex Restroom (Floor 1)", "x": 210, "y": 175}],
      "emergencyExits": [{"id": "ex_eng", "name": "ENG North Emergency Exit", "x": 205, "y": 165}]
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
      "amenities": ["Wi-Fi", "Wet Labs", "Elevator", "Lecture Halls"],
      "ramps": [{"id": "r_sci", "name": "SCI South Ramp", "x": 445, "y": 165}],
      "elevators": [{"id": "e_sci", "name": "SCI Main Elevator", "x": 435, "y": 140, "floors": "1-3"}],
      "accessibleEntrances": [{"id": "ae_sci", "name": "SCI Accessible Entrance", "x": 450, "y": 160}],
      "accessibleRestrooms": [{"id": "ar_sci", "name": "SCI Accessible Washroom", "x": 430, "y": 145}],
      "emergencyExits": [{"id": "ex_sci", "name": "SCI West Fire Exit", "x": 425, "y": 155}]
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
      "amenities": ["Wi-Fi", "Quiet Rooms", "Café", "Elevator", "Print Center"],
      "ramps": [{"id": "r_lib", "name": "LIB Front Quad Ramp", "x": 570, "y": 335}],
      "elevators": [{"id": "e_lib", "name": "LIB High-Capacity Elevator", "x": 550, "y": 310, "floors": "1-5"}],
      "accessibleEntrances": [{"id": "ae_lib", "name": "LIB Power Sliding Entrance", "x": 565, "y": 330}],
      "accessibleRestrooms": [{"id": "ar_lib", "name": "LIB ADA Washroom (All Floors)", "x": 555, "y": 315}],
      "emergencyExits": [{"id": "ex_lib", "name": "LIB East Emergency Exit", "x": 575, "y": 305}]
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
      "amenities": ["Wi-Fi", "Event Hall", "ATM", "Information Desk"],
      "ramps": [{"id": "r_sau", "name": "SAU Plaza Ramp", "x": 390, "y": 375}],
      "elevators": [{"id": "e_sau", "name": "SAU Passenger Elevator", "x": 370, "y": 350, "floors": "1-3"}],
      "accessibleEntrances": [{"id": "ae_sau", "name": "SAU Automatic Entrance", "x": 385, "y": 370}],
      "accessibleRestrooms": [{"id": "ar_sau", "name": "SAU Inclusive Restroom", "x": 375, "y": 355}],
      "emergencyExits": [{"id": "ex_sau", "name": "SAU South Exit", "x": 365, "y": 365}]
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
      "amenities": ["Vegan Options", "Outdoor Seating", "Accessible Restrooms"],
      "ramps": [{"id": "r_din", "name": "DIN Courtyard Ramp", "x": 230, "y": 435}],
      "elevators": [{"id": "e_din", "name": "DIN Service Elevator", "x": 210, "y": 410, "floors": "1-2"}],
      "accessibleEntrances": [{"id": "ae_din", "name": "DIN Wide Entrance", "x": 225, "y": 430}],
      "accessibleRestrooms": [{"id": "ar_din", "name": "DIN ADA Restroom", "x": 215, "y": 415}],
      "emergencyExits": [{"id": "ex_din", "name": "DIN West Fire Exit", "x": 205, "y": 425}]
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
      "amenities": ["Lockers", "Showers", "Gym Equipment", "Elevator"],
      "ramps": [{"id": "r_spt", "name": "SPT Arena Access Ramp", "x": 215, "y": 675}],
      "elevators": [{"id": "e_spt", "name": "SPT Arena Elevator", "x": 190, "y": 650, "floors": "1-2"}],
      "accessibleEntrances": [{"id": "ae_spt", "name": "SPT Ground Level Entrance", "x": 210, "y": 670}],
      "accessibleRestrooms": [{"id": "ar_spt", "name": "SPT Accessible Locker Washroom", "x": 195, "y": 655}],
      "emergencyExits": [{"id": "ex_spt", "name": "SPT Emergency Stairs & Exit", "x": 185, "y": 665}]
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
      "amenities": ["Wi-Fi", "Registrar Desk", "Elevator", "Visitor Lounge"],
      "ramps": [{"id": "r_adm", "name": "ADM East Ramp", "x": 730, "y": 195}],
      "elevators": [{"id": "e_adm", "name": "ADM Main Elevator", "x": 710, "y": 170, "floors": "1-3"}],
      "accessibleEntrances": [{"id": "ae_adm", "name": "ADM Automatic Door Entrance", "x": 725, "y": 190}],
      "accessibleRestrooms": [{"id": "ar_adm", "name": "ADM ADA Restroom", "x": 715, "y": 175}],
      "emergencyExits": [{"id": "ex_adm", "name": "ADM Rear Exit", "x": 705, "y": 185}]
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
      "amenities": ["Laundry", "Kitchen", "Study Rooms", "Security Desk"],
      "ramps": [{"id": "r_nqr", "name": "NQR Entrance Ramp", "x": 690, "y": 495}],
      "elevators": [{"id": "e_nqr", "name": "NQR Elevator A & B", "x": 670, "y": 470, "floors": "1-6"}],
      "accessibleEntrances": [{"id": "ae_nqr", "name": "NQR Keycard Accessible Gate", "x": 685, "y": 490}],
      "accessibleRestrooms": [{"id": "ar_nqr", "name": "NQR Ground Floor ADA Washroom", "x": 675, "y": 475}],
      "emergencyExits": [{"id": "ex_nqr", "name": "NQR Fire Escape Exit", "x": 665, "y": 485}]
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
      "amenities": ["Laundry", "Game Room", "Elevator"],
      "ramps": [{"id": "r_sqr", "name": "SQR Courtyard Ramp", "x": 470, "y": 695}],
      "elevators": [{"id": "e_sqr", "name": "SQR Quad Elevator", "x": 450, "y": 670, "floors": "1-5"}],
      "accessibleEntrances": [{"id": "ae_sqr", "name": "SQR Power Door", "x": 465, "y": 690}],
      "accessibleRestrooms": [{"id": "ar_sqr", "name": "SQR Accessible Restroom", "x": 455, "y": 675}],
      "emergencyExits": [{"id": "ex_sqr", "name": "SQR South Exit", "x": 445, "y": 685}]
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
      "amenities": ["3D Printers", "Co-working Space", "High-speed Fiber"],
      "ramps": [{"id": "r_hub", "name": "HUB Plaza Ramp", "x": 850, "y": 365}],
      "elevators": [{"id": "e_hub", "name": "HUB Glass Elevator", "x": 830, "y": 340, "floors": "1-4"}],
      "accessibleEntrances": [{"id": "ae_hub", "name": "HUB Sensor Door Entrance", "x": 845, "y": 360}],
      "accessibleRestrooms": [{"id": "ar_hub", "name": "HUB Inclusive Washrooms", "x": 835, "y": 345}],
      "emergencyExits": [{"id": "ex_hub", "name": "HUB East Fire Exit", "x": 825, "y": 355}]
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
      "amenities": ["Pharmacy", "Urgent Care", "Wheelchair Access", "Counseling"],
      "ramps": [{"id": "r_hlc", "name": "HLC Ambulance & Wheelchair Ramp", "x": 790, "y": 655}],
      "elevators": [{"id": "e_hlc", "name": "HLC Patient Elevator", "x": 770, "y": 630, "floors": "1-2"}],
      "accessibleEntrances": [{"id": "ae_hlc", "name": "HLC Automatic Entrance", "x": 785, "y": 650}],
      "accessibleRestrooms": [{"id": "ar_hlc", "name": "HLC Medical ADA Restroom", "x": 775, "y": 635}],
      "emergencyExits": [{"id": "ex_hlc", "name": "HLC Emergency Exit Door", "x": 765, "y": 645}]
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
      "amenities": ["Auditorium", "Gallery", "Elevator", "Acoustic Rooms"],
      "ramps": [{"id": "r_pac", "name": "PAC Theater Entrance Ramp", "x": 390, "y": 555}],
      "elevators": [{"id": "e_pac", "name": "PAC Backstage & Public Elevator", "x": 370, "y": 530, "floors": "1-3"}],
      "accessibleEntrances": [{"id": "ae_pac", "name": "PAC Main Foyer Automatic Doors", "x": 385, "y": 550}],
      "accessibleRestrooms": [{"id": "ar_pac", "name": "PAC ADA Unisex Washrooms", "x": 375, "y": 535}],
      "emergencyExits": [{"id": "ex_pac", "name": "PAC Stage Fire Exits", "x": 365, "y": 545}]
    }
  ],
  "routes": [
    { "id": "r1", "from": "eng_building", "to": "science_hall", "distance": 220, "time": 3, "type": "Paved Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r2", "from": "eng_building", "to": "central_dining", "distance": 240, "time": 3, "type": "Paved Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r3", "from": "eng_building", "to": "student_union", "distance": 250, "time": 4, "type": "Paved Walkway", "accessible": true, "safetyScore": 4, "tactilePaving": false, "hasStairs": false, "wellLit": true },
    { "id": "r4", "from": "science_hall", "to": "admin_building", "distance": 290, "time": 4, "type": "Tree-lined Path", "accessible": true, "safetyScore": 4, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r5", "from": "science_hall", "to": "main_library", "distance": 210, "time": 3, "type": "Paved Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r6", "from": "admin_building", "to": "innovation_hub", "distance": 200, "time": 3, "type": "Modern Plaza Path", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r7", "from": "main_library", "to": "student_union", "distance": 180, "time": 2, "type": "Central Quad Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r8", "from": "main_library", "to": "dorm_north", "distance": 200, "time": 3, "type": "Shaded Path", "accessible": true, "safetyScore": 4, "tactilePaving": false, "hasStairs": false, "wellLit": true },
    { "id": "r9", "from": "main_library", "to": "innovation_hub", "distance": 280, "time": 4, "type": "Paved Walkway", "accessible": true, "safetyScore": 4, "tactilePaving": false, "hasStairs": false, "wellLit": true },
    { "id": "r10", "from": "student_union", "to": "central_dining", "distance": 170, "time": 2, "type": "Courtyard Walk", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r11", "from": "student_union", "to": "arts_center", "distance": 180, "time": 3, "type": "Paved Walkway", "accessible": true, "safetyScore": 4, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r12", "from": "central_dining", "to": "sports_arena", "distance": 240, "time": 3, "type": "Outdoor Staircase Shortcut", "accessible": false, "safetyScore": 2, "tactilePaving": false, "hasStairs": true, "wellLit": false },
    { "id": "r13", "from": "central_dining", "to": "arts_center", "distance": 200, "time": 3, "type": "Accessible Slope Path", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r14", "from": "arts_center", "to": "dorm_south", "distance": 160, "time": 2, "type": "Paved Walkway", "accessible": true, "safetyScore": 4, "tactilePaving": false, "hasStairs": false, "wellLit": true },
    { "id": "r15", "from": "dorm_south", "to": "sports_arena", "distance": 260, "time": 4, "type": "Wheelchair Ramp & Walk", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r16", "from": "dorm_north", "to": "health_center", "distance": 190, "time": 3, "type": "Paved Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r17", "from": "innovation_hub", "to": "health_center", "distance": 310, "time": 4, "type": "East Quad Walkway", "accessible": true, "safetyScore": 4, "tactilePaving": false, "hasStairs": false, "wellLit": true },
    { "id": "r18", "from": "dorm_north", "to": "dorm_south", "distance": 300, "time": 4, "type": "Central Corridor Path", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true },
    { "id": "r19", "from": "arts_center", "to": "main_library", "distance": 230, "time": 3, "type": "Plaza Walkway", "accessible": true, "safetyScore": 5, "tactilePaving": true, "hasStairs": false, "wellLit": true }
  ]
};

// API Base URL config
const currentHost = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') 
  ? window.location.hostname 
  : 'localhost';
const API_BASE_URL = `http://${currentHost}:8080/api`;

// Application State
let campusData = { locations: [], routes: [] };
let locationMap = new Map();
let currentRoute = null;
let selectedMode = 'wheelchair';
let isServerOnline = false;
let mapTransform = { scale: 1, translateX: 0, translateY: 0 };
let isDraggingMap = false;
let dragStart = { x: 0, y: 0 };
let isMasterVoiceEnabled = true;
let isAccessibilityIconsVisible = true;

// Admin Session State
let isAdminUnlocked = false;
let isPickingCoords = false;
let authenticatedAdminEmail = 'admin@campus.edu';
let adminSessionToken = null;

// ==========================================================================
// 1. Voice Navigation Engine (Browser SpeechSynthesis API)
// ==========================================================================
class VoiceNavigator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isMuted = false;
    this.isPaused = false;
    this.currentUtterance = null;
    // BUG 2 FIX: Use an internal speech queue so rapid calls do not cancel each other
    this._queue = [];
    this._isSpeaking = false;
  }

  speak(text, priority = false) {
    // BUG 1 FIX: Voice is strictly silenced in Hearing Impaired mode or when muted
    if (!this.synth || this.isMuted || !isMasterVoiceEnabled || selectedMode === 'hearing_impaired') {
      return;
    }
    if (!text || text.trim() === '') return;

    if (priority) {
      // Priority messages clear the queue and speak immediately
      this._queue = [text];
      this._stopCurrentAndProcess();
    } else {
      // Regular messages are appended to the queue
      this._queue.push(text);
      if (!this._isSpeaking) {
        this._processQueue();
      }
    }
  }

  _stopCurrentAndProcess() {
    this._isSpeaking = false;
    try { this.synth.cancel(); } catch (e) {}
    // Small delay to allow browser to flush the cancel before new utterance
    setTimeout(() => this._processQueue(), 80);
  }

  _processQueue() {
    if (this._queue.length === 0) {
      this._isSpeaking = false;
      return;
    }
    const text = this._queue.shift();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      );
      if (preferred) utterance.voice = preferred;
    }

    utterance.onend = () => {
      this._isSpeaking = false;
      this._processQueue();
    };
    utterance.onerror = () => {
      this._isSpeaking = false;
      this._processQueue();
    };

    this.currentUtterance = utterance;
    this._isSpeaking = true;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    this._queue = [];
    this._isSpeaking = false;
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
      this.isPaused = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stop();
    return this.isMuted;
  }
}

const voiceEngine = new VoiceNavigator();

// ==========================================================================
// 2. Indoor Positioning System (IPS) Simulator
// ==========================================================================
class IndoorPositioningEngine {
  constructor() {
    this.userPos = null;
    this.animationId = null;
    this.isNavigating = false;
    this.isPaused = false;
    this.currentRoute = null;
    this.speed = 1.5;
  }

  startNavigation(route) {
    if (!route || !route.nodePath || route.nodePath.length < 2) return;
    this.currentRoute = route;
    this.isNavigating = true;
    this.isPaused = false;

    // BUG 1 FIX: Always stop voice first; for hearing impaired it stays silent
    voiceEngine.stop();

    this.waypoints = route.nodePath.map(nodeId => locationMap.get(nodeId)).filter(Boolean);
    if (this.waypoints.length < 2) return;

    this.currentSegment = 0;
    this.progress = 0;

    const startLoc = this.waypoints[0];
    const destLoc = this.waypoints[this.waypoints.length - 1];

    this.userPos = {
      x: startLoc.x,
      y: startLoc.y,
      building: startLoc.name,
      floor: `Floor 1`,
      heading: 0
    };

    // BUG 2 FIX: Queue start announcement + first step instruction together.
    // They are chained via the speech queue so neither cancels the other.
    if (selectedMode === 'visually_impaired') {
      voiceEngine.speak(`Navigation started. Heading to ${destLoc.name}.`, true);
      if (route.directions && route.directions.length > 0 && route.directions[0].spokenText) {
        voiceEngine.speak(route.directions[0].spokenText);
      }
    }

    if (route.directions && route.directions.length > 0) {
      updateNavBanner(route.directions[0].instruction, 0, route.directions.length, route.directions[0].turnIcon);
    }

    this.runLoop();
  }

  runLoop() {
    if (!this.isNavigating || this.isPaused) return;

    if (this.currentSegment >= this.waypoints.length - 1) {
      this.isNavigating = false;
      const dest = this.waypoints[this.waypoints.length - 1];

      // BUG 1 & 2 FIX: Voice speaks arrival only in Visually Impaired mode; stopped in Hearing Impaired
      if (selectedMode === 'visually_impaired') {
        voiceEngine.speak("You have reached your destination.", true);
      } else {
        voiceEngine.stop();
      }

      updateNavBanner(`🎉 You have reached your destination: ${dest.name}!`, 100, 100, '🎯');
      onNavigationFinished();
      return;
    }

    const p1 = this.waypoints[this.currentSegment];
    const p2 = this.waypoints[this.currentSegment + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    this.progress += this.speed;
    const t = Math.min(this.progress / dist, 1.0);

    this.userPos.x = p1.x + dx * t;
    this.userPos.y = p1.y + dy * t;
    this.userPos.building = t > 0.5 ? p2.name : p1.name;
    this.userPos.floor = `Floor 1 • Waypoint ${this.currentSegment + 1}`;
    this.userPos.heading = Math.atan2(dy, dx) * (180 / Math.PI);

    renderUserLocationMarker(this.userPos);
    updateIPSStatusWidget(this.userPos.building, this.userPos.floor);

    const overallProgress = Math.round(((this.currentSegment + t) / (this.waypoints.length - 1)) * 100);
    updateProgressBar(overallProgress);

    if (t >= 1.0) {
      this.currentSegment++;
      this.progress = 0;
      if (this.currentRoute.directions && this.currentRoute.directions[this.currentSegment]) {
        const nextStep = this.currentRoute.directions[this.currentSegment];

        // BUG 2 FIX: Spoken turn-by-turn announcement triggered on waypoint arrival
        if (selectedMode === 'visually_impaired' && nextStep.spokenText) {
          voiceEngine.speak(nextStep.spokenText);
        }
        updateNavBanner(nextStep.instruction, this.currentSegment, this.currentRoute.directions.length, nextStep.turnIcon);
      }
    }

    this.animationId = requestAnimationFrame(() => this.runLoop());
  }

  pause() {
    this.isPaused = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    voiceEngine.pause();
  }

  resume() {
    if (!this.isNavigating) return;
    this.isPaused = false;
    voiceEngine.resume();
    this.runLoop();
  }

  stop() {
    this.isNavigating = false;
    this.isPaused = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    voiceEngine.stop();
    removeUserLocationMarker();
  }

  connectBLEBeacon(beaconId) { console.log(`[IPS Simulator] Connected to BLE Beacon ${beaconId}`); }
  scanWiFi(ssid) { console.log(`[IPS Simulator] Triangulating position via Wi-Fi ${ssid}`); }
  processQRCodeCheckpoint(code) { console.log(`[IPS Simulator] Scanned QR Checkpoint ${code}`); }
}

const ipsEngine = new IndoorPositioningEngine();

// DOM Cache
const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMCache();
  initTheme();
  initEventListeners();
  loadCampusData();
});

function initDOMCache() {
  elements.serverStatus = document.getElementById('server-status');
  elements.startLocation = document.getElementById('start-location');
  elements.endLocation = document.getElementById('end-location');
  elements.swapBtn = document.getElementById('swap-locations');
  elements.routeForm = document.getElementById('route-form');
  elements.routeResults = document.getElementById('route-results');
  elements.statDistance = document.getElementById('stat-distance');
  elements.statTime = document.getElementById('stat-time');
  elements.directionsList = document.getElementById('directions-list');
  elements.badgeAccessible = document.getElementById('route-badge-accessible');
  elements.btnClearRoute = document.getElementById('btn-clear-route');
  elements.globalSearch = document.getElementById('global-search');
  elements.searchDropdown = document.getElementById('search-results-dropdown');
  elements.clearSearchBtn = document.getElementById('clear-search');
  elements.themeToggle = document.getElementById('theme-toggle');
  elements.voiceMasterToggle = document.getElementById('voice-master-toggle');
  elements.categoryPills = document.getElementById('category-pills');
  elements.directoryList = document.getElementById('directory-list');

  elements.navControlDeck = document.getElementById('navigation-control-deck');
  elements.btnNavStart = document.getElementById('btn-nav-start');
  elements.btnNavPause = document.getElementById('btn-nav-pause');
  elements.btnNavResume = document.getElementById('btn-nav-resume');
  elements.btnNavStop = document.getElementById('btn-nav-stop');
  elements.btnNavMute = document.getElementById('btn-nav-mute');
  elements.navProgressBar = document.getElementById('nav-progress-bar');
  elements.currentStepInstruction = document.getElementById('current-step-instruction');
  elements.ipsBuilding = document.getElementById('ips-building');
  elements.ipsFloor = document.getElementById('ips-floor');
  elements.navModeBadge = document.getElementById('nav-mode-badge');
  elements.navStatusLabel = document.getElementById('nav-status-label');

  elements.campusSvg = document.getElementById('campus-svg');
  elements.layerGrounds = document.getElementById('layer-grounds');
  elements.layerAccessibilityFeatures = document.getElementById('layer-accessibility-features');
  elements.layerEdges = document.getElementById('layer-edges');
  elements.layerActiveRoute = document.getElementById('layer-active-route');
  elements.layerWaypoints = document.getElementById('layer-waypoints');
  elements.layerNodes = document.getElementById('layer-nodes');
  elements.layerLabels = document.getElementById('layer-labels');
  elements.layerUserLocation = document.getElementById('layer-user-location');
  elements.layerAdminPreview = document.getElementById('layer-admin-preview');

  elements.locationModal = document.getElementById('location-modal');
  elements.modalClose = document.getElementById('modal-close');
  elements.modalIcon = document.getElementById('modal-icon');
  elements.modalTitle = document.getElementById('modal-title');
  elements.modalCategory = document.getElementById('modal-category');
  elements.modalDescription = document.getElementById('modal-description');
  elements.modalCode = document.getElementById('modal-code');
  elements.modalFloors = document.getElementById('modal-floors');
  elements.modalAccessible = document.getElementById('modal-accessible');
  elements.modalAmenitiesTags = document.getElementById('modal-amenities-tags');
  elements.btnSetStart = document.getElementById('btn-set-start');
  elements.btnSetDestination = document.getElementById('btn-set-destination');

  elements.adminAuthCard = document.getElementById('admin-auth-card');
  elements.adminDashboard = document.getElementById('admin-dashboard');
  elements.adminLoginForm = document.getElementById('admin-login-form');
  elements.adminEmail = document.getElementById('admin-email');
  elements.adminPassword = document.getElementById('admin-password');
  elements.btnAdminLogin = document.getElementById('btn-admin-login');
  elements.btnAdminLogout = document.getElementById('btn-admin-logout');
  elements.adminAuthError = document.getElementById('admin-auth-error');
  elements.adminProfileEmail = document.getElementById('admin-profile-email');
  elements.adminAddNodeForm = document.getElementById('admin-add-node-form');
  elements.btnPickCoords = document.getElementById('btn-pick-coords');
  elements.coordPickerStatus = document.getElementById('coord-picker-status');
  elements.adminNodesList = document.getElementById('admin-nodes-list');
  elements.adminNodeCountBadge = document.getElementById('admin-node-count-badge');
}

function initTheme() {
  const savedTheme = localStorage.getItem('novanav_theme') || 'dark';
  document.body.className = `${savedTheme}-theme`;
  if (elements.themeToggle) {
    elements.themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  }
}

function initEventListeners() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      document.body.className = `${newTheme}-theme`;
      localStorage.setItem('novanav_theme', newTheme);
      elements.themeToggle.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }

  if (elements.voiceMasterToggle) {
    elements.voiceMasterToggle.addEventListener('click', () => {
      isMasterVoiceEnabled = !isMasterVoiceEnabled;
      elements.voiceMasterToggle.classList.toggle('active', isMasterVoiceEnabled);
      elements.voiceMasterToggle.querySelector('.voice-icon').textContent = isMasterVoiceEnabled ? '🔊' : '🔇';
      if (!isMasterVoiceEnabled) voiceEngine.stop();
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // BUG 1 FIX: Mode Pill Selector — updates selectedMode, stops voice if Hearing Impaired,
  // refreshes the nav control deck UI, legend, and recalculates any existing route.
  document.querySelectorAll('#mode-pills .mode-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#mode-pills .mode-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedMode = pill.dataset.mode;

      // Immediately silence voice when switching to Hearing Impaired
      if (selectedMode === 'hearing_impaired') {
        voiceEngine.stop();
      }

      // BUG 1 FIX: Update nav control deck UI (button labels, mute button visibility)
      updateNavControlDeckForMode(selectedMode);
      updateLegendForMode(selectedMode);

      // Recalculate route with new mode if both endpoints are chosen
      if (elements.startLocation.value && elements.endLocation.value) {
        findRoute(elements.startLocation.value, elements.endLocation.value, selectedMode);
      }
    });
  });

  if (elements.routeForm) {
    elements.routeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const start = elements.startLocation.value;
      const end = elements.endLocation.value;
      if (start && end) {
        findRoute(start, end, selectedMode);
      }
    });
  }

  if (elements.swapBtn) {
    elements.swapBtn.addEventListener('click', () => {
      const temp = elements.startLocation.value;
      elements.startLocation.value = elements.endLocation.value;
      elements.endLocation.value = temp;
    });
  }

  if (elements.btnClearRoute) {
    elements.btnClearRoute.addEventListener('click', clearActiveRoute);
  }

  if (elements.btnNavStart) {
    elements.btnNavStart.addEventListener('click', () => {
      if (!currentRoute) return;
      ipsEngine.startNavigation(currentRoute);
      elements.btnNavStart.classList.add('hidden');
      elements.btnNavPause.classList.remove('hidden');
      elements.btnNavStop.classList.remove('hidden');
      if (elements.navStatusLabel) elements.navStatusLabel.textContent = "Live Navigation Active";
    });
  }

  if (elements.btnNavPause) {
    elements.btnNavPause.addEventListener('click', () => {
      ipsEngine.pause();
      elements.btnNavPause.classList.add('hidden');
      elements.btnNavResume.classList.remove('hidden');
      if (elements.navStatusLabel) elements.navStatusLabel.textContent = "Navigation Paused";
    });
  }

  if (elements.btnNavResume) {
    elements.btnNavResume.addEventListener('click', () => {
      ipsEngine.resume();
      elements.btnNavResume.classList.add('hidden');
      elements.btnNavPause.classList.remove('hidden');
      if (elements.navStatusLabel) elements.navStatusLabel.textContent = "Live Navigation Active";
    });
  }

  if (elements.btnNavStop) {
    elements.btnNavStop.addEventListener('click', () => {
      ipsEngine.stop();
      elements.btnNavPause.classList.add('hidden');
      elements.btnNavResume.classList.add('hidden');
      elements.btnNavStop.classList.add('hidden');
      elements.btnNavStart.classList.remove('hidden');
      if (elements.navStatusLabel) elements.navStatusLabel.textContent = "Navigation Stopped";
    });
  }

  if (elements.btnNavMute) {
    elements.btnNavMute.addEventListener('click', () => {
      const isMuted = voiceEngine.toggleMute();
      document.getElementById('mute-icon').textContent = isMuted ? '🔇' : '🔊';
    });
  }

  if (elements.globalSearch) {
    elements.globalSearch.addEventListener('input', handleGlobalSearch);
  }
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.globalSearch.value = '';
      elements.searchDropdown.classList.add('hidden');
      elements.clearSearchBtn.classList.add('hidden');
    });
  }

  if (elements.categoryPills) {
    elements.categoryPills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        elements.categoryPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderDirectory(btn.dataset.category);
      });
    });
  }

  initMapPanAndZoom();

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => zoomMap(1.2));
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => zoomMap(0.8));
  document.getElementById('btn-reset-view')?.addEventListener('click', resetMapView);
  document.getElementById('btn-toggle-labels')?.addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    elements.layerLabels.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });
  document.getElementById('btn-toggle-paths')?.addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    elements.layerEdges.style.display = e.target.classList.contains('active') ? 'block' : 'none';
  });
  document.getElementById('btn-toggle-accessibility-features')?.addEventListener('click', (e) => {
    e.target.classList.toggle('active');
    isAccessibilityIconsVisible = e.target.classList.contains('active');
    elements.layerAccessibilityFeatures.style.display = isAccessibilityIconsVisible ? 'block' : 'none';
  });

  if (elements.modalClose) elements.modalClose.addEventListener('click', closeModal);
  if (elements.btnAdminLogin) elements.btnAdminLogin.addEventListener('click', handleAdminLogin);
  if (elements.btnAdminLogout) elements.btnAdminLogout.addEventListener('click', handleAdminLogout);
  if (elements.adminAddNodeForm) elements.adminAddNodeForm.addEventListener('submit', handleAddNodeSubmit);
  if (elements.btnPickCoords) elements.btnPickCoords.addEventListener('click', toggleCoordPicker);
}

// ==========================================================================
// 3. Data Loading & Initialization
// ==========================================================================
async function loadCampusData() {
  updateServerStatus('connecting', 'Connecting Server...');
  try {
    const res = await fetch(`${API_BASE_URL}/data`, { credentials: 'include' });
    if (!res.ok) throw new Error('API offline');
    campusData = await res.json();
    isServerOnline = true;
    updateServerStatus('online', 'App.java Backend Connected');
    checkAdminSession();
  } catch (err) {
    console.warn('Backend server offline. Loaded embedded campus dataset.');
    campusData = EMBEDDED_CAMPUS_DATA;
    isServerOnline = false;
    updateServerStatus('offline', 'Offline Mode (Local Engine)');
  }
  processDataset();
}

function processDataset() {
  locationMap.clear();
  campusData.locations.forEach(loc => locationMap.set(loc.id, loc));
  populateSelectDropdowns();
  renderDirectory('ALL');
  renderMap();
  renderAccessibilityMapFeatures();
}

function updateServerStatus(type, label) {
  if (!elements.serverStatus) return;
  elements.serverStatus.className = `status-badge status-${type}`;
  elements.serverStatus.querySelector('.status-text').textContent = label;
}

function populateSelectDropdowns() {
  const startSel = elements.startLocation;
  const endSel = elements.endLocation;
  if (!startSel || !endSel) return;
  startSel.innerHTML = '<option value="" disabled selected>Select starting location...</option>';
  endSel.innerHTML = '<option value="" disabled selected>Select destination...</option>';
  campusData.locations.forEach(loc => {
    const opt1 = new Option(`${loc.icon} ${loc.name} (${loc.code})`, loc.id);
    const opt2 = new Option(`${loc.icon} ${loc.name} (${loc.code})`, loc.id);
    startSel.add(opt1);
    endSel.add(opt2);
  });
}

// ==========================================================================
// 4. Map Rendering & Accessibility Features Layer
// ==========================================================================
function renderMap() {
  renderEdges();
  renderNodes();
  renderLabels();
}

function renderEdges() {
  if (!elements.layerEdges) return;
  elements.layerEdges.innerHTML = '';
  campusData.routes.forEach(r => {
    const fromLoc = locationMap.get(r.from);
    const toLoc = locationMap.get(r.to);
    if (!fromLoc || !toLoc) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromLoc.x);
    line.setAttribute('y1', fromLoc.y);
    line.setAttribute('x2', toLoc.x);
    line.setAttribute('y2', toLoc.y);
    line.setAttribute('stroke', r.accessible ? 'var(--map-edge-accessible)' : 'var(--map-edge-stair)');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-dasharray', r.accessible ? 'none' : '6,6');
    line.setAttribute('opacity', '0.6');
    elements.layerEdges.appendChild(line);
  });
}

function renderAccessibilityMapFeatures() {
  if (!elements.layerAccessibilityFeatures) return;
  elements.layerAccessibilityFeatures.innerHTML = '';
  campusData.locations.forEach(loc => {
    if (loc.ramps) loc.ramps.forEach(ramp => {
      const t = createSvgText(ramp.x, ramp.y, '♿', 14); t.setAttribute('title', ramp.name); elements.layerAccessibilityFeatures.appendChild(t);
    });
    if (loc.elevators) loc.elevators.forEach(e => {
      const t = createSvgText(e.x, e.y, '🛗', 14); t.setAttribute('title', e.name); elements.layerAccessibilityFeatures.appendChild(t);
    });
    if (loc.accessibleEntrances) loc.accessibleEntrances.forEach(ent => {
      const t = createSvgText(ent.x, ent.y, '🚪', 12); t.setAttribute('title', ent.name); elements.layerAccessibilityFeatures.appendChild(t);
    });
    if (loc.accessibleRestrooms) loc.accessibleRestrooms.forEach(ar => {
      const t = createSvgText(ar.x, ar.y, '🚻', 12); t.setAttribute('title', ar.name); elements.layerAccessibilityFeatures.appendChild(t);
    });
    if (loc.emergencyExits) loc.emergencyExits.forEach(ex => {
      const t = createSvgText(ex.x, ex.y, '🚨', 12); t.setAttribute('title', ex.name); elements.layerAccessibilityFeatures.appendChild(t);
    });
  });
}

function createSvgText(x, y, char, size) {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('font-size', size);
  t.setAttribute('text-anchor', 'middle'); t.setAttribute('dominant-baseline', 'central');
  t.textContent = char;
  return t;
}

function renderNodes() {
  if (!elements.layerNodes) return;
  elements.layerNodes.innerHTML = '';
  campusData.locations.forEach(loc => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'map-node-group'); g.setAttribute('cursor', 'pointer');
    g.addEventListener('click', () => showLocationModal(loc));
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', loc.x); circle.setAttribute('cy', loc.y); circle.setAttribute('r', '18');
    circle.setAttribute('fill', 'url(#node-gradient)'); circle.setAttribute('stroke', '#ffffff'); circle.setAttribute('stroke-width', '2');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('x', loc.x); icon.setAttribute('y', loc.y); icon.setAttribute('font-size', '14');
    icon.setAttribute('text-anchor', 'middle'); icon.setAttribute('dominant-baseline', 'central');
    icon.textContent = loc.icon || '🏢';
    g.appendChild(circle); g.appendChild(icon);
    elements.layerNodes.appendChild(g);
  });
}

function renderLabels() {
  if (!elements.layerLabels) return;
  elements.layerLabels.innerHTML = '';
  campusData.locations.forEach(loc => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', loc.x); text.setAttribute('y', loc.y + 30);
    text.setAttribute('fill', 'var(--text-primary)'); text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '600'); text.setAttribute('text-anchor', 'middle');
    text.textContent = loc.code;
    elements.layerLabels.appendChild(text);
  });
}

// ==========================================================================
// 5. Multi-Mode Pathfinding Engine
// ==========================================================================
async function findRoute(fromId, toId, mode) {
  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/navigate?from=${fromId}&to=${toId}&mode=${mode}`, { credentials: 'include' });
      if (res.ok) {
        currentRoute = await res.json();
        renderActiveRoute(currentRoute);
        return;
      }
    } catch (e) {
      console.warn('Server navigate API failed, using client pathfinder.');
    }
  }
  currentRoute = calculateRouteClient(fromId, toId, mode);
  if (currentRoute) {
    renderActiveRoute(currentRoute);
  } else {
    alert("No path found matching selected accessibility mode criteria.");
  }
}

function calculateRouteClient(fromId, toId, mode) {
  const dist = new Map();
  const prevNode = new Map();
  const prevEdge = new Map();

  campusData.locations.forEach(l => dist.set(l.id, Infinity));
  dist.set(fromId, 0);

  const pq = [{ node: fromId, cost: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const curr = pq.shift();
    if (curr.cost > dist.get(curr.node)) continue;
    if (curr.node === toId) break;

    campusData.routes.forEach(r => {
      if (mode === 'wheelchair' && (!r.accessible || r.hasStairs)) return;
      let neighbor = null;
      if (r.from === curr.node) neighbor = r.to;
      else if (r.to === curr.node) neighbor = r.from;
      if (neighbor) {
        let weight = r.distance;
        if (mode === 'wheelchair' && (r.type.toLowerCase().includes('ramp') || r.type.toLowerCase().includes('slope'))) weight *= 0.7;
        if (mode === 'visually_impaired' && r.tactilePaving) weight *= 0.6;
        if (mode === 'safest') weight = r.distance * (6 - (r.safetyScore || 4));
        const newDist = curr.cost + weight;
        if (newDist < dist.get(neighbor)) {
          dist.set(neighbor, newDist);
          prevNode.set(neighbor, curr.node);
          prevEdge.set(neighbor, r);
          pq.push({ node: neighbor, cost: newDist });
        }
      }
    });
  }

  if (dist.get(toId) === Infinity) return null;

  const nodePath = [];
  const edgePath = [];
  let curr = toId;
  while (curr) {
    nodePath.unshift(curr);
    const edge = prevEdge.get(curr);
    if (edge) edgePath.unshift(edge);
    curr = prevNode.get(curr);
  }

  let totalDist = 0;
  let totalTime = 0;

  const directions = edgePath.map((r, idx) => {
    totalDist += r.distance;
    totalTime += r.time;
    const stepFromLoc = locationMap.get(nodePath[idx]);
    const stepToLoc = locationMap.get(nodePath[idx + 1]);
    const stepFrom = stepFromLoc.name;
    const stepTo = stepToLoc.name;

    let turn = "Go straight";
    let icon = "⬆️";

    if (idx > 0 && idx < nodePath.length - 1) {
      const prevLoc = locationMap.get(nodePath[idx - 1]);
      const dx1 = stepFromLoc.x - prevLoc.x;
      const dy1 = stepFromLoc.y - prevLoc.y;
      const dx2 = stepToLoc.x - stepFromLoc.x;
      const dy2 = stepToLoc.y - stepFromLoc.y;
      const crossProduct = (dx1 * dy2) - (dy1 * dx2);
      if (crossProduct > 1500) { turn = "Turn right"; icon = "➡️"; }
      else if (crossProduct < -1500) { turn = "Turn left"; icon = "⬅️"; }
      else { turn = "Continue straight"; icon = "⬆️"; }
    }

    let spokenText = "";
    if (mode === 'visually_impaired') {
      spokenText = idx === 0
        ? `Go straight along ${r.type} towards ${stepTo}.`
        : `${turn} onto ${r.type} towards ${stepTo}.`;
    } else if (mode !== 'hearing_impaired') {
      spokenText = `${turn} along ${r.type}.`;
    }

    return {
      step: idx + 1,
      from: stepFrom,
      to: stepTo,
      distance: r.distance,
      time: r.time,
      type: r.type,
      accessible: r.accessible,
      instruction: `${turn} along ${r.type} towards ${stepTo}`,
      spokenText: spokenText,
      turnDirection: turn,
      turnIcon: icon
    };
  });

  return {
    success: true, from: fromId, to: toId, mode: mode,
    accessibleOnly: mode === 'wheelchair',
    totalDistance: totalDist, totalTime: totalTime,
    nodePath: nodePath, directions: directions
  };
}

function renderActiveRoute(routeData) {
  if (!elements.layerActiveRoute || !routeData || !routeData.nodePath) return;

  // BUG 1 FIX: Always use the current selectedMode as the authoritative mode source.
  // The server response may carry a stale or different mode value; we override it.
  const activeMode = selectedMode;
  routeData.mode = activeMode;

  elements.layerActiveRoute.innerHTML = '';
  elements.layerWaypoints.innerHTML = '';

  const colorMap = {
    wheelchair: 'var(--mode-wheelchair)',
    visually_impaired: 'var(--mode-visually)',
    hearing_impaired: 'var(--mode-hearing)',
    shortest: 'var(--mode-shortest)',
    safest: 'var(--mode-safest)'
  };
  const routeColor = colorMap[activeMode] || 'var(--mode-wheelchair)';

  const points = routeData.nodePath.map(id => {
    const loc = locationMap.get(id);
    return loc ? `${loc.x},${loc.y}` : null;
  }).filter(Boolean).join(' ');

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', routeColor);
  polyline.setAttribute('stroke-width', '8');
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  polyline.setAttribute('filter', 'url(#glow-route)');
  elements.layerActiveRoute.appendChild(polyline);

  routeData.nodePath.forEach((id) => {
    const loc = locationMap.get(id);
    if (!loc) return;
    const wp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    wp.setAttribute('cx', loc.x); wp.setAttribute('cy', loc.y); wp.setAttribute('r', '6');
    wp.setAttribute('fill', routeColor); wp.setAttribute('stroke', '#ffffff'); wp.setAttribute('stroke-width', '2');
    elements.layerWaypoints.appendChild(wp);
  });

  if (elements.statDistance) elements.statDistance.textContent = `${routeData.totalDistance} m`;
  if (elements.statTime) elements.statTime.textContent = `${routeData.totalTime} min`;

  // BUG 1 FIX: Regenerate spokenText in directions using the CURRENT mode.
  if (routeData.directions && routeData.nodePath) {
    routeData.directions.forEach((step, idx) => {
      const turn = step.turnDirection || 'Go straight';
      if (activeMode === 'visually_impaired') {
        step.spokenText = idx === 0
          ? `Go straight along ${step.type} towards ${step.to}.`
          : `${turn} onto ${step.type} towards ${step.to}.`;
      } else if (activeMode === 'hearing_impaired') {
        step.spokenText = '';
      } else {
        step.spokenText = `${turn} along ${step.type}.`;
      }
    });
  }

  // BUG 1 FIX: Format directions list differently for Hearing Impaired (visual-only, no speak button)
  if (elements.directionsList) {
    const isHearing = activeMode === 'hearing_impaired';
    const dirContainer = elements.directionsList.closest('.directions-list-container');
    if (dirContainer) {
      const heading = dirContainer.querySelector('h4');
      if (heading) {
        heading.textContent = isHearing ? '🦻 Visual Turn-by-Turn Instructions' : '🔊 Turn-by-Turn Spoken Steps';
      }
    }
    elements.directionsList.innerHTML = (routeData.directions || []).map(step => `
      <li style="${isHearing ? 'border-left: 4px solid var(--mode-hearing); padding-left: 12px; background: rgba(217,70,239,0.07);' : ''}">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size: ${isHearing ? '22px' : '16px'};">${step.turnIcon || '⬆️'}</span>
          <div>
            <strong>Step ${step.step}:</strong> ${step.instruction}
            <br><small style="color:var(--text-muted);">${step.distance}m, ~${step.time}min • ${step.type}</small>
            ${isHearing ? `<br><small style="color:var(--mode-hearing); font-weight:700;">👁 VISUAL ALERT — NO AUDIO</small>` : ''}
          </div>
        </div>
        ${!isHearing ? `
          <button class="btn-speak-step" onclick="voiceEngine.speak('${(step.spokenText || step.instruction).replace(/'/g, "\\'")}')" title="Speak step">🔊</button>
        ` : ''}
      </li>
    `).join('');
  }

  elements.routeResults.classList.remove('hidden');
  elements.navControlDeck.classList.remove('hidden');

  if (elements.navModeBadge) {
    const modeBadgeLabels = {
      wheelchair: '♿ WHEELCHAIR MODE',
      visually_impaired: '👁️ VISUALLY IMPAIRED MODE',
      hearing_impaired: '👂 HEARING IMPAIRED — VISUAL ONLY',
      shortest: '⚡ SHORTEST ROUTE MODE',
      safest: '🛡️ SAFEST CORRIDOR MODE'
    };
    elements.navModeBadge.textContent = modeBadgeLabels[activeMode] || `${activeMode.toUpperCase()} MODE`;
  }

  // BUG 1 FIX: Update nav control deck UI for this mode (button labels, mute visibility)
  updateNavControlDeckForMode(activeMode);
}

function clearActiveRoute() {
  currentRoute = null;
  ipsEngine.stop();
  if (elements.layerActiveRoute) elements.layerActiveRoute.innerHTML = '';
  if (elements.layerWaypoints) elements.layerWaypoints.innerHTML = '';
  if (elements.routeResults) elements.routeResults.classList.add('hidden');
  if (elements.navControlDeck) elements.navControlDeck.classList.add('hidden');
}

/**
 * BUG 1 FIX: Update Nav Control Deck UI based on selected accessibility mode.
 * - Hearing Impaired: hide Mute button (voice n/a), relabel Start button to "Visual Navigation".
 * - All other modes: show Mute button, restore Start button label appropriately.
 */
function updateNavControlDeckForMode(mode) {
  const isHearing = mode === 'hearing_impaired';
  const isVisual = mode === 'visually_impaired';

  if (elements.btnNavStart) {
    const startSpan = elements.btnNavStart.querySelector('span');
    if (startSpan) {
      if (isHearing) startSpan.textContent = '▶ Start Visual Navigation';
      else if (isVisual) startSpan.textContent = '▶ Start Voice Navigation';
      else startSpan.textContent = '▶ Start Navigation';
    }
  }

  if (elements.btnNavMute) {
    elements.btnNavMute.style.display = isHearing ? 'none' : '';
  }

  const stepLabelTag = document.querySelector('.step-label-tag');
  if (stepLabelTag) {
    stepLabelTag.textContent = isHearing ? 'NEXT VISUAL INSTRUCTION:' : 'NEXT INSTRUCTION:';
  }
}

function updateLegendForMode(mode) {
  const indicator = document.getElementById('legend-active-indicator');
  if (!indicator) return;
  const colorMap = {
    wheelchair: '#00f2fe',
    visually_impaired: '#ffb700',
    hearing_impaired: '#d946ef',
    shortest: '#10b981',
    safest: '#06b6d4'
  };
  indicator.style.backgroundColor = colorMap[mode] || '#00f2fe';
}

// ==========================================================================
// 6. User Position Avatar & Status Deck Helpers
// ==========================================================================
function renderUserLocationMarker(pos) {
  if (!elements.layerUserLocation) return;
  elements.layerUserLocation.innerHTML = '';
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
  const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  halo.setAttribute('r', '24'); halo.setAttribute('fill', 'url(#user-location-glow)');
  const cone = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  cone.setAttribute('points', '0,-20 -10,0 10,0'); cone.setAttribute('fill', '#3b82f6');
  cone.setAttribute('opacity', '0.7'); cone.setAttribute('transform', `rotate(${pos.heading})`);
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('r', '8'); dot.setAttribute('fill', '#2563eb');
  dot.setAttribute('stroke', '#ffffff'); dot.setAttribute('stroke-width', '3');
  g.appendChild(halo); g.appendChild(cone); g.appendChild(dot);
  elements.layerUserLocation.appendChild(g);
}

function removeUserLocationMarker() {
  if (elements.layerUserLocation) elements.layerUserLocation.innerHTML = '';
}

function updateIPSStatusWidget(building, floor) {
  if (elements.ipsBuilding) elements.ipsBuilding.textContent = building;
  if (elements.ipsFloor) elements.ipsFloor.textContent = floor;
}

function updateProgressBar(percentage) {
  if (elements.navProgressBar) elements.navProgressBar.style.width = `${percentage}%`;
}

function updateNavBanner(instructionText, stepIdx, totalSteps, icon = '⬆️') {
  if (elements.currentStepInstruction) {
    if (selectedMode === 'hearing_impaired') {
      elements.currentStepInstruction.innerHTML = `<span style="color:var(--mode-hearing); font-weight:800;">${icon} VISUAL ALERT:</span> ${instructionText}`;
    } else {
      elements.currentStepInstruction.innerHTML = `<span style="font-weight:800;">${icon}</span> ${instructionText}`;
    }
  }
}

function onNavigationFinished() {
  if (elements.btnNavPause) elements.btnNavPause.classList.add('hidden');
  if (elements.btnNavResume) elements.btnNavResume.classList.add('hidden');
  if (elements.btnNavStop) elements.btnNavStop.classList.add('hidden');
  if (elements.btnNavStart) elements.btnNavStart.classList.remove('hidden');
  if (elements.navStatusLabel) elements.navStatusLabel.textContent = "Destination Reached";
}

// ==========================================================================
// 7. Map Interaction, Zoom & Pan
// ==========================================================================
function initMapPanAndZoom() {
  const container = document.getElementById('map-container');
  if (!container) return;
  container.addEventListener('mousedown', (e) => {
    if (isPickingCoords) return;
    isDraggingMap = true;
    dragStart = { x: e.clientX - mapTransform.translateX, y: e.clientY - mapTransform.translateY };
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDraggingMap) return;
    mapTransform.translateX = e.clientX - dragStart.x;
    mapTransform.translateY = e.clientY - dragStart.y;
    applyMapTransform();
  });
  window.addEventListener('mouseup', () => isDraggingMap = false);
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomMap(e.deltaY < 0 ? 1.1 : 0.9);
  }, { passive: false });
  container.addEventListener('click', handleMapClick);
}

function zoomMap(factor) {
  mapTransform.scale = Math.min(Math.max(0.5, mapTransform.scale * factor), 4.0);
  applyMapTransform();
}

function resetMapView() {
  mapTransform = { scale: 1, translateX: 0, translateY: 0 };
  applyMapTransform();
}

function applyMapTransform() {
  if (elements.campusSvg) {
    elements.campusSvg.style.transform = `translate(${mapTransform.translateX}px, ${mapTransform.translateY}px) scale(${mapTransform.scale})`;
    elements.campusSvg.style.transformOrigin = '0 0';
  }
}

function handleMapClick(e) {
  if (!isPickingCoords) return;
  const rect = elements.campusSvg.getBoundingClientRect();
  const rawX = (e.clientX - rect.left) / mapTransform.scale;
  const rawY = (e.clientY - rect.top) / mapTransform.scale;
  const x = Math.round(Math.min(Math.max(20, rawX), 980));
  const y = Math.round(Math.min(Math.max(20, rawY), 780));
  document.getElementById('admin-node-x').value = x;
  document.getElementById('admin-node-y').value = y;
  renderAdminPreviewPin(x, y);
  toggleCoordPicker(false);
}

// ==========================================================================
// 8. Directory & Search
// ==========================================================================
function renderDirectory(category) {
  if (!elements.directoryList) return;
  const filtered = category === 'ALL' ? campusData.locations : campusData.locations.filter(l => l.category === category);
  elements.directoryList.innerHTML = filtered.map(loc => `
    <div class="dir-card" onclick="showLocationModalById('${loc.id}')">
      <span class="dir-icon">${loc.icon}</span>
      <div>
        <h4>${loc.name} (${loc.code})</h4>
        <p style="font-size: 12px; color: var(--text-secondary);">${loc.description}</p>
        <span style="font-size: 11px; color: var(--status-online);">♿ Accessible • ${loc.floors} Floors</span>
      </div>
    </div>
  `).join('');
}

function handleGlobalSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    elements.searchDropdown.classList.add('hidden');
    elements.clearSearchBtn.classList.add('hidden');
    return;
  }
  elements.clearSearchBtn.classList.remove('hidden');
  const matches = campusData.locations.filter(l =>
    l.name.toLowerCase().includes(query) ||
    l.code.toLowerCase().includes(query) ||
    l.category.toLowerCase().includes(query)
  );
  if (matches.length === 0) {
    elements.searchDropdown.innerHTML = '<div class="search-result-item">No campus building found</div>';
  } else {
    elements.searchDropdown.innerHTML = matches.map(l => `
      <div class="search-result-item" onclick="selectSearchResult('${l.id}')">
        <span>${l.icon}</span>
        <div><strong>${l.name}</strong> (${l.code})<br><small style="color:var(--text-muted);">${l.category}</small></div>
      </div>
    `).join('');
  }
  elements.searchDropdown.classList.remove('hidden');
}

function selectSearchResult(id) {
  const loc = locationMap.get(id);
  if (loc) { showLocationModal(loc); elements.searchDropdown.classList.add('hidden'); }
}

// ==========================================================================
// 9. Location Detail Modal
// ==========================================================================
function showLocationModalById(id) {
  const loc = locationMap.get(id);
  if (loc) showLocationModal(loc);
}

function showLocationModal(loc) {
  elements.modalIcon.textContent = loc.icon || '🏢';
  elements.modalTitle.textContent = loc.name;
  elements.modalCategory.textContent = loc.category;
  elements.modalDescription.textContent = loc.description;
  elements.modalCode.textContent = loc.code;
  elements.modalFloors.textContent = loc.floors;
  elements.modalAccessible.textContent = loc.accessible ? 'Yes (ADA Compliant)' : 'No';
  elements.modalAmenitiesTags.innerHTML = (loc.amenities || ['Wi-Fi', 'Elevator']).map(a => `<span class="amenity-tag">✓ ${a}</span>`).join('');
  elements.btnSetStart.onclick = () => { elements.startLocation.value = loc.id; closeModal(); };
  elements.btnSetDestination.onclick = () => { elements.endLocation.value = loc.id; closeModal(); };
  elements.locationModal.classList.remove('hidden');
}

function closeModal() {
  elements.locationModal.classList.add('hidden');
}

// ==========================================================================
// 10. Administrator Portal (Auth & Dynamic Node Management)
// ==========================================================================
async function checkAdminSession() {
  if (!isServerOnline) return;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/session`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) unlockAdminPortal(data.email, data.sessionToken);
    }
  } catch (e) { console.warn('Admin session check failed.'); }
}

async function handleAdminLogin() {
  const email = elements.adminEmail.value;
  const password = elements.adminPassword.value;
  if (!email || !password) return;
  if (isServerOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) { unlockAdminPortal(data.email, data.sessionToken); return; }
      else { showAdminAuthError(data.error || 'Authentication failed.'); return; }
    } catch (e) { console.warn('Server auth failed. Trying local admin check.'); }
  }
  if (email === 'admin@campus.edu' && password === 'AdminPassword123!') {
    unlockAdminPortal(email, 'local_token');
  } else {
    showAdminAuthError('Invalid credentials. Default: admin@campus.edu / AdminPassword123!');
  }
}

function unlockAdminPortal(email, token) {
  isAdminUnlocked = true;
  authenticatedAdminEmail = email;
  adminSessionToken = token;
  elements.adminAuthCard.classList.add('hidden');
  elements.adminDashboard.classList.remove('hidden');
  elements.adminProfileEmail.textContent = email;
  renderAdminNodesList();
}

async function handleAdminLogout() {
  if (isServerOnline) await fetch(`${API_BASE_URL}/admin/logout`, { method: 'POST', credentials: 'include' });
  isAdminUnlocked = false;
  elements.adminAuthCard.classList.remove('hidden');
  elements.adminDashboard.classList.add('hidden');
}

function showAdminAuthError(msg) {
  elements.adminAuthError.textContent = msg;
  elements.adminAuthError.classList.remove('hidden');
}

function toggleCoordPicker(forceState) {
  isPickingCoords = forceState !== undefined ? forceState : !isPickingCoords;
  if (isPickingCoords) {
    elements.btnPickCoords.classList.add('btn-warning');
    elements.coordPickerStatus.textContent = '📍 Click anywhere on the map canvas to set coordinates!';
  } else {
    elements.btnPickCoords.classList.remove('btn-warning');
    elements.coordPickerStatus.textContent = 'Coordinates picked!';
  }
}

function renderAdminPreviewPin(x, y) {
  if (!elements.layerAdminPreview) return;
  elements.layerAdminPreview.innerHTML = `
    <circle cx="${x}" cy="${y}" r="12" fill="#ef4444" opacity="0.5" />
    <circle cx="${x}" cy="${y}" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
  `;
}

async function handleAddNodeSubmit(e) {
  e.preventDefault();
  const newNode = {
    id: `node_${Date.now()}`,
    name: document.getElementById('admin-node-name').value,
    code: document.getElementById('admin-node-code').value.toUpperCase(),
    category: document.getElementById('admin-node-category').value,
    icon: document.getElementById('admin-node-icon').value,
    x: parseInt(document.getElementById('admin-node-x').value),
    y: parseInt(document.getElementById('admin-node-y').value),
    floors: parseInt(document.getElementById('admin-node-floors').value),
    accessible: document.getElementById('admin-node-accessible').checked,
    description: document.getElementById('admin-node-desc').value || 'Newly added campus location.'
  };
  if (isServerOnline) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
      const res = await fetch(`${API_BASE_URL}/admin/node/add`, {
        method: 'POST', headers: headers, body: JSON.stringify(newNode), credentials: 'include'
      });
      if (res.ok) { await loadCampusData(); alert('Node saved successfully to server data.json!'); return; }
    } catch (err) { console.warn('Server add node failed.'); }
  }
  campusData.locations.push(newNode);
  processDataset();
  renderAdminNodesList();
  alert('Node added to local session dataset!');
}

async function deleteAdminNode(id) {
  if (!confirm(`Are you sure you want to delete node '${id}'?`)) return;
  if (isServerOnline) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminSessionToken) headers['X-Session-Token'] = adminSessionToken;
      const res = await fetch(`${API_BASE_URL}/admin/node/delete`, {
        method: 'POST', headers: headers, body: JSON.stringify({ id }), credentials: 'include'
      });
      if (res.ok) { await loadCampusData(); return; }
    } catch (e) { console.warn('Server delete failed.'); }
  }
  campusData.locations = campusData.locations.filter(l => l.id !== id);
  campusData.routes = campusData.routes.filter(r => r.from !== id && r.to !== id);
  processDataset();
  renderAdminNodesList();
}

function renderAdminNodesList() {
  if (!elements.adminNodesList) return;
  elements.adminNodeCountBadge.textContent = `${campusData.locations.length} Nodes`;
  elements.adminNodesList.innerHTML = campusData.locations.map(loc => `
    <div class="admin-node-item card" style="display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:8px;">
      <div>
        <strong>${loc.icon} ${loc.name}</strong> (${loc.code})
        <br><small style="color:var(--text-muted);">X: ${loc.x}, Y: ${loc.y}</small>
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="deleteAdminNode('${loc.id}')">Delete</button>
    </div>
  `).join('');
}