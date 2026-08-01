# NovaNav 🧭 - Interactive Campus Navigation & Admin Management Portal

NovaNav is a modern, high-performance web application and Java-powered backend designed for university campuses. It provides real-time route pathfinding (including wheelchair-accessible paths using Dijkstra's algorithm), dynamic interactive vector campus mapping, building search, and a secure administrator portal for managing campus nodes and infrastructure.

---

## 📋 Features

### 🎓 Campus Navigation & Student Features
- **Interactive SVG Vector Map**: High-resolution interactive canvas with drag-to-pan, scroll-to-zoom, and path visualizer.
- **Shortest Path Calculation**: Instant pathfinding between campus buildings using Dijkstra's algorithm.
- **Wheelchair Accessibility Mode**: Filter routes to avoid stairs and prioritize elevators, ramps, and paved walkways.
- **Turn-by-Turn Directions**: Step-by-step navigation instructions detailing distance, estimated walking time, and walkway type.
- **Global Search & Directory**: Instant search across buildings, labs, dining facilities, and libraries with category filtering.
- **Location Detail Modals**: View floor counts, wheelchair accessibility details, and building amenities.
- **Light & Dark Themes**: Toggle between high-contrast dark mode and clean light mode.

### 🔒 Administrator Portal & Backend Security
- **Secure Email & Password Authentication**: Replaced legacy passcode authentication with robust email and password verification.
- **PBKDF2 Password Hashing**: Passwords stored using `PBKDF2WithHmacSHA256` key derivation with 65,536 iterations and unique 16-byte random salts.
- **HttpOnly Cookie Session Management**: Session tokens stored securely in `HttpOnly` and `SameSite=Lax` cookies, preventing XSS-based session hijacking.
- **Protected API Endpoints**: All admin mutation endpoints (`/api/admin/node/add`, `/api/admin/node/delete`) enforce session validation and reject unauthorized requests with HTTP `401 Unauthorized`.
- **Dynamic Node Management**: Add new location nodes directly by clicking on the campus map canvas or delete obsolete nodes.
- **Automatic Graph Interconnection**: Newly added buildings automatically calculate distance and connect to the nearest existing campus pathway node.

---

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5 & Semantic Web Structure
  - Vanilla CSS3 (Custom Design System with CSS variables, Glassmorphism, and responsive layouts)
  - JavaScript (ES6+ standard fetch API with `credentials: 'include'` support)
  - SVG Canvas for dynamic map rendering

- **Backend**:
  - Java 17+ / Java 8+ (`com.sun.net.httpserver.HttpServer` lightweight HTTP server)
  - PBKDF2 Password Security (`javax.crypto.SecretKeyFactory`)
  - JSON Data Persistence (`data.json` and `admin_credentials.json`)

---

## 📂 Project Structure