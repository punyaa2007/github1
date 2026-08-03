# NovaNav 🧭 - Smart Campus Navigation System for Persons with Disabilities

NovaNav is an inclusive, high-performance web application and Java-powered backend designed for college campuses. It provides real-time voice-guided navigation, indoor positioning simulation with live user tracking, accessibility-friendly multi-mode route pathfinding (Wheelchair, Visually Impaired, Hearing Impaired, Shortest, Safest), interactive SVG campus mapping with accessibility overlays (Ramps, Elevators, Power Entrances, Restrooms, Exits), and a secure Administrator Portal.

---

## 📋 Key Features

### 🔊 1. Voice Navigation
- **Real-Time Spoken Turn-by-Turn Directions**: Powered by the browser Web Speech API (`SpeechSynthesisUtterance`).
- **Turn Spoken Triggers**: "Go straight along...", "Follow accessible ramp...", "Turn left...", "You have reached your destination."
- **Audio Deck Controls**:
  - ▶ **Start Voice Navigation**
  - ⏸ **Pause Navigation**
  - ▶ **Resume Navigation**
  - ⏹ **Stop Navigation**
  - 🔊 **Mute / Unmute Spoken Voice**

### 📡 2. Indoor Positioning System (IPS) & Live Tracking
- **Indoor Location Simulation**: Simulates user coordinates, current building, and floor level across campus.
- **Live User Avatar Pin**: Pulsing position marker on map canvas with directional heading cone.
- **Modular Hardware Adapter Hooks**: Pre-wired architecture for future Bluetooth Beacons (`connectBLEBeacon`), Wi-Fi triangulation (`scanWiFi`), and QR-code checkpoints (`processQRCodeCheckpoint`).

### ♿ 3. Accessibility-Friendly Multi-Mode Routing
- **Wheelchair Accessible Route**: Strictly avoids staircases, prioritizes ramps, elevators, and wide paved slopes.
- **Visually Impaired Route**: Prefers walkways equipped with tactile paving and provides high-detail turn-by-turn voice instructions.
- **Hearing Impaired Route**: High-contrast visual guidance, bold map markers, and step landmark indicators.
- **Shortest Route**: Direct distance pathfinder.
- **Safest Route**: Prefers well-lit main quads, monitored plaza corridors, and avoids secluded stairways.

### 🗺️ 4. Interactive Map Accessibility Overlays
- Dynamic map layers with toggles for:
  - ♿ **Ramps**
  - 🛗 **Elevators**
  - 🚪 **Automatic Power Entrances**
  - 🚻 **ADA Restrooms**
  - 🚨 **Emergency Exits**
- **Mode-Specific Path Colors**:
  - Wheelchair: Glowing Cyan (`#00f2fe`)
  - Visually Impaired: High-contrast Amber (`#ffb700`)
  - Hearing Impaired: Neon Purple (`#d946ef`)
  - Shortest: Emerald Green (`#10b981`)
  - Safest: Electric Teal (`#06b6d4`)

### 🔒 5. Secure Administrator Portal
- **PBKDF2 Hashed Password Authentication**: Passwords hashed securely with 65,536 iterations and unique 16-byte random salts.
- **Dynamic Node Management**: Add new campus buildings by clicking directly on the campus map canvas or delete obsolete location nodes.

---

## 📁 Updated & Created Project Files

### Modified Files:
1. `App.java` - Java HTTP server, PBKDF2 authentication, multi-mode Dijkstra pathfinding endpoint (`/api/navigate?mode=...`), and JSON data persistence.
2. `data.json` - Complete campus dataset containing building coordinates, floor counts, ramps, elevators, power entrances, restrooms, emergency exits, and route safety/tactile scores.
3. `index.html` - Single Page Application layout with Accessibility Mode selectors, Live Navigation Control Deck, IPS status widget, and SVG map layers.
4. `style.css` - Custom design system, mode glow tokens, dark/light theme definitions, pulsing user avatar marker, and control deck layouts.
5. `script.js` - `VoiceNavigator` browser speech engine, `IndoorPositioningEngine` simulator, client-side fallback pathfinder, SVG renderer, search controller, and admin session manager.
6. `README.md` - Complete project documentation and verification guide.

---

## ⚙️ Installation & Running Steps

### 1. Prerequisites
- **Java Development Kit (JDK 8 or higher, JDK 17+ recommended)**.
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### 2. Compile Java Backend
Open a terminal in the project directory (`C:\Users\punya\.gemini\antigravity\scratch\campus-navigation`) and execute:
```bash
javac App.java
```

### 3. Run Backend Server
```bash
java App
```
*The server starts on `http://localhost:8080`.*

### 4. Launch Application
Open `index.html` directly in your browser or run via a local web server (e.g. VS Code Live Server or `python -m http.server 3000`).

---

## 🧪 Exact Testing Walkthrough

1. **Test Multi-Mode Accessibility Routing**:
   - Open `index.html`.
   - Click the **Wheelchair** mode pill. Select **Central Dining Commons** as Start and **Athletics Arena** as Destination. Click **Find Best Route**. Notice the algorithm automatically routes via the Wheelchair Ramp (`r15`) and avoids the outdoor staircase shortcut (`r12`).
   - Switch to **Shortest** mode to compare path differences.

2. **Test Voice Navigation & Live Tracking**:
   - Click **▶ Start Voice Navigation** in the Control Deck.
   - Listen to turn-by-turn spoken audio directions through your speakers.
   - Observe the live pulsing user pin moving along the map path while updating current building and floor status.
   - Test **⏸ Pause**, **▶ Resume**, **⏹ Stop**, and **🔊 Mute/Unmute** controls.

3. **Test Accessibility Map Features**:
   - Click the **♿ Icons** button in the map top-right toolbar to toggle visual markers for Ramps (♿), Elevators (🛗), Power Doors (🚪), ADA Restrooms (🚻), and Exits (🚨).

4. **Test Admin Portal**:
   - Click the **Admin Portal** tab.
   - Sign in with default admin credentials:
     - **Email**: `admin@campus.edu`
     - **Password**: `AdminPassword123!`
   - Test picking map coordinates and adding a new building node.
