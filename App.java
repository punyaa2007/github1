import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class App {
    private static final int PORT = 8080;
    private static String rawJsonData = "";
    private static final List<Location> locations = Collections.synchronizedList(new ArrayList<>());
    private static final List<Route> routes = Collections.synchronizedList(new ArrayList<>());
    private static final Map<String, Location> locationMap = new ConcurrentHashMap<>();

    // Admin Security & Session Store
    private static final String CREDENTIALS_FILE = "admin_credentials.json";
    private static final Map<String, AdminSession> activeSessions = new ConcurrentHashMap<>();
    private static String storedAdminEmail = "admin@campus.edu";
    private static String storedPasswordHash = "";
    private static String storedSaltHex = "";

    static class AdminSession {
        final String sessionId;
        final String email;
        final long expiryTimestamp;

        AdminSession(String sessionId, String email, long durationMillis) {
            this.sessionId = sessionId;
            this.email = email;
            this.expiryTimestamp = System.currentTimeMillis() + durationMillis;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiryTimestamp;
        }
    }

    static class Location {
        String id;
        String name;
        String code;
        String category;
        int x;
        int y;
        int floors;
        boolean accessible;
        String description;
        String icon;

        Location(String id, String name, String code, String category, int x, int y, int floors, boolean accessible, String description, String icon) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.category = category;
            this.x = x;
            this.y = y;
            this.floors = floors;
            this.accessible = accessible;
            this.description = description;
            this.icon = icon;
        }
    }

    static class Route {
        String id;
        String from;
        String to;
        int distance;
        int time;
        String type;
        boolean accessible;

        Route(String id, String from, String to, int distance, int time, String type, boolean accessible) {
            this.id = id;
            this.from = from;
            this.to = to;
            this.distance = distance;
            this.time = time;
            this.type = type;
            this.accessible = accessible;
        }
    }

    public static void main(String[] args) throws IOException {
        loadData();
        initAdminSecurity();

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/data", new CorsHandler(new DataHandler()));
        server.createContext("/api/locations", new CorsHandler(new LocationsHandler()));
        server.createContext("/api/navigate", new CorsHandler(new NavigateHandler()));
        server.createContext("/api/health", new CorsHandler(new HealthHandler()));
        
        // Admin Auth & Protected Endpoints
        server.createContext("/api/admin/login", new CorsHandler(new AdminLoginHandler()));
        server.createContext("/api/admin/logout", new CorsHandler(new AdminLogoutHandler()));
        server.createContext("/api/admin/session", new CorsHandler(new AdminSessionHandler()));
        server.createContext("/api/admin/node/add", new CorsHandler(new AddNodeHandler()));
        server.createContext("/api/admin/node/delete", new CorsHandler(new DeleteNodeHandler()));

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("=================================================");
        System.out.println("Campus Navigation Server running on port " + PORT);
        System.out.println("API Data: http://localhost:" + PORT + "/api/data");
        System.out.println("Admin Account Email: " + storedAdminEmail);
        System.out.println("=================================================");
    }

    // =========================================================================
    // Security & Password Hashing Methods (PBKDF2)
    // =========================================================================
    private static void initAdminSecurity() {
        try {
            if (Files.exists(Paths.get(CREDENTIALS_FILE))) {
                String content = new String(Files.readAllBytes(Paths.get(CREDENTIALS_FILE)), StandardCharsets.UTF_8);
                Map<String, String> creds = parseJsonBody(content);
                storedAdminEmail = creds.getOrDefault("email", "admin@campus.edu");
                storedPasswordHash = creds.getOrDefault("hash", "");
                storedSaltHex = creds.getOrDefault("salt", "");
                System.out.println("Loaded secure admin credentials from " + CREDENTIALS_FILE);
            } else {
                System.out.println("Initializing default admin credentials (admin@campus.edu)...");
                byte[] salt = generateSalt();
                storedAdminEmail = "admin@campus.edu";
                storedSaltHex = bytesToHex(salt);
                storedPasswordHash = hashPassword("AdminPassword123!", salt);
                saveAdminCredentialsToDisk();
            }
        } catch (Exception e) {
            System.err.println("Error initializing admin security: " + e.getMessage());
        }
    }

    private static void saveAdminCredentialsToDisk() {
        try {
            String json = String.format("{\n  \"email\": \"%s\",\n  \"hash\": \"%s\",\n  \"salt\": \"%s\"\n}\n",
                    escapeJson(storedAdminEmail), storedPasswordHash, storedSaltHex);
            Files.write(Paths.get(CREDENTIALS_FILE), json.getBytes(StandardCharsets.UTF_8));
            System.out.println("Saved admin credentials to " + CREDENTIALS_FILE);
        } catch (Exception e) {
            System.err.println("Failed to write credentials file: " + e.getMessage());
        }
    }

    private static byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    private static String hashPassword(String password, byte[] salt) {
        try {
            KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 256);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password with PBKDF2: " + e.getMessage(), e);
        }
    }

    private static boolean verifyAdminPassword(String email, String rawPassword) {
        if (email == null || rawPassword == null) return false;
        if (!email.trim().equalsIgnoreCase(storedAdminEmail.trim())) return false;
        try {
            byte[] salt = hexToBytes(storedSaltHex);
            String computedHash = hashPassword(rawPassword, salt);
            return computedHash.equalsIgnoreCase(storedPasswordHash);
        } catch (Exception e) {
            System.err.println("Verify password error: " + e.getMessage());
            return false;
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }

    // =========================================================================
    // Session & Cookie Helper Methods
    // =========================================================================
    private static AdminSession validateSession(HttpExchange exchange) {
        String sessionId = getSessionIdFromCookie(exchange);
        if (sessionId == null || sessionId.isEmpty()) return null;

        AdminSession session = activeSessions.get(sessionId);
        if (session == null) return null;
        if (session.isExpired()) {
            activeSessions.remove(sessionId);
            return null;
        }
        return session;
    }

    private static String getSessionIdFromCookie(HttpExchange exchange) {
        List<String> cookieHeaders = exchange.getRequestHeaders().get("Cookie");
        if (cookieHeaders != null) {
            for (String header : cookieHeaders) {
                String[] cookies = header.split(";");
                for (String cookie : cookies) {
                    String[] pair = cookie.trim().split("=", 2);
                    if (pair.length == 2 && "session_id".equalsIgnoreCase(pair[0].trim())) {
                        return pair[1].trim();
                    }
                }
            }
        }
        return null;
    }

    private static void setSessionCookie(HttpExchange exchange, String sessionId) {
        String cookieValue = String.format("session_id=%s; Path=/; HttpOnly; SameSite=Lax", sessionId);
        exchange.getResponseHeaders().add("Set-Cookie", cookieValue);
    }

    private static void clearSessionCookie(HttpExchange exchange) {
        String cookieValue = "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax";
        exchange.getResponseHeaders().add("Set-Cookie", cookieValue);
    }

    // =========================================================================
    // Data Management
    // =========================================================================
    private static void loadData() {
        String dataPath = "data.json";
        try {
            if (Files.exists(Paths.get(dataPath))) {
                byte[] bytes = Files.readAllBytes(Paths.get(dataPath));
                rawJsonData = new String(bytes, StandardCharsets.UTF_8);
            } else {
                System.err.println("Warning: data.json not found in current directory. Using embedded fallback.");
                rawJsonData = getFallbackJson();
            }
            parseJson(rawJsonData);
            System.out.println("Loaded " + locations.size() + " campus locations and " + routes.size() + " route segments.");
        } catch (Exception e) {
            System.err.println("Error loading data.json: " + e.getMessage());
            rawJsonData = getFallbackJson();
            parseJson(rawJsonData);
        }
    }

    private static void parseJson(String json) {
        locations.clear();
        routes.clear();
        locationMap.clear();

        int locStart = json.indexOf("\"locations\":");
        int routesStart = json.indexOf("\"routes\":");

        if (locStart != -1 && routesStart != -1) {
            String locSub = json.substring(locStart, routesStart);
            Pattern locPattern = Pattern.compile("\\{\\s*\"id\":\\s*\"([^\"]+)\",\\s*\"name\":\\s*\"([^\"]+)\",\\s*\"code\":\\s*\"([^\"]+)\",\\s*\"category\":\\s*\"([^\"]+)\",\\s*\"x\":\\s*(\\d+),\\s*\"y\":\\s*(\\d+),\\s*\"floors\":\\s*(\\d+),\\s*\"accessible\":\\s*(true|false),\\s*\"description\":\\s*\"([^\"]+)\",\\s*\"icon\":\\s*\"([^\"]+)\"");
            Matcher m = locPattern.matcher(locSub);
            while (m.find()) {
                Location loc = new Location(
                        m.group(1), m.group(2), m.group(3), m.group(4),
                        Integer.parseInt(m.group(5)), Integer.parseInt(m.group(6)),
                        Integer.parseInt(m.group(7)), Boolean.parseBoolean(m.group(8)),
                        m.group(9), m.group(10)
                );
                locations.add(loc);
                locationMap.put(loc.id, loc);
            }

            String routeSub = json.substring(routesStart);
            Pattern routePattern = Pattern.compile("\\{\\s*\"id\":\\s*\"([^\"]+)\",\\s*\"from\":\\s*\"([^\"]+)\",\\s*\"to\":\\s*\"([^\"]+)\",\\s*\"distance\":\\s*(\\d+),\\s*\"time\":\\s*(\\d+),\\s*\"type\":\\s*\"([^\"]+)\",\\s*\"accessible\":\\s*(true|false)");
            Matcher rm = routePattern.matcher(routeSub);
            while (rm.find()) {
                Route r = new Route(
                        rm.group(1), rm.group(2), rm.group(3),
                        Integer.parseInt(rm.group(4)), Integer.parseInt(rm.group(5)),
                        rm.group(6), Boolean.parseBoolean(rm.group(7))
                );
                routes.add(r);
            }
        }
    }

    private static synchronized void saveDataToDisk() {
        try {
            StringBuilder sb = new StringBuilder("{\n  \"campusInfo\": {\n    \"name\": \"Nova Horizon University Campus\",\n    \"mapDimensions\": {\"width\": 1000, \"height\": 800}\n  },\n  \"locations\": [\n");
            for (int i = 0; i < locations.size(); i++) {
                Location loc = locations.get(i);
                sb.append(String.format("    {\n      \"id\": \"%s\",\n      \"name\": \"%s\",\n      \"code\": \"%s\",\n      \"category\": \"%s\",\n      \"x\": %d,\n      \"y\": %d,\n      \"floors\": %d,\n      \"accessible\": %b,\n      \"description\": \"%s\",\n      \"icon\": \"%s\"\n    }",
                        loc.id, escapeJson(loc.name), escapeJson(loc.code), escapeJson(loc.category), loc.x, loc.y, loc.floors, loc.accessible, escapeJson(loc.description), loc.icon));
                if (i < locations.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append("  ],\n  \"routes\": [\n");
            for (int i = 0; i < routes.size(); i++) {
                Route r = routes.get(i);
                sb.append(String.format("    {\n      \"id\": \"%s\",\n      \"from\": \"%s\",\n      \"to\": \"%s\",\n      \"distance\": %d,\n      \"time\": %d,\n      \"type\": \"%s\",\n      \"accessible\": %b\n    }",
                        r.id, r.from, r.to, r.distance, r.time, escapeJson(r.type), r.accessible));
                if (i < routes.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append("  ]\n}\n");

            rawJsonData = sb.toString();
            Files.write(Paths.get("data.json"), rawJsonData.getBytes(StandardCharsets.UTF_8));
            System.out.println("Saved updated data.json to disk.");
        } catch (Exception e) {
            System.err.println("Error saving data.json: " + e.getMessage());
        }
    }

    // =========================================================================
    // HTTP Handlers & Middlewares
    // =========================================================================
    static class CorsHandler implements HttpHandler {
        private final HttpHandler next;

        CorsHandler(HttpHandler next) {
            this.next = next;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<String> origins = exchange.getRequestHeaders().get("Origin");
            String origin = (origins != null && !origins.isEmpty()) ? origins.get(0) : "*";

            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin);
            exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            next.handle(exchange);
        }
    }

    static class DataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            byte[] response = rawJsonData.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    static class LocationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < locations.size(); i++) {
                Location loc = locations.get(i);
                sb.append(String.format("{\"id\":\"%s\",\"name\":\"%s\",\"code\":\"%s\",\"category\":\"%s\",\"x\":%d,\"y\":%d,\"floors\":%d,\"accessible\":%b,\"description\":\"%s\",\"icon\":\"%s\"}",
                        loc.id, escapeJson(loc.name), escapeJson(loc.code), escapeJson(loc.category), loc.x, loc.y, loc.floors, loc.accessible, escapeJson(loc.description), loc.icon));
                if (i < locations.size() - 1) sb.append(",");
            }
            sb.append("]");
            byte[] response = sb.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = "{\"status\":\"OK\",\"server\":\"Campus Navigation App.java\",\"version\":\"2.0.0 (Secure PBKDF2 Auth Enabled)\"}";
            byte[] response = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    // =========================================================================
    // Admin Auth Handlers
    // =========================================================================
    static class AdminLoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            String body = readStream(exchange.getRequestBody());
            Map<String, String> params = parseJsonBody(body);
            String email = params.get("email");
            String password = params.get("password");

            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Email and password are required.\"}");
                return;
            }

            if (verifyAdminPassword(email, password)) {
                String sessionId = UUID.randomUUID().toString();
                // 24 hours session duration
                AdminSession session = new AdminSession(sessionId, email.trim().toLowerCase(), 86400000L);
                activeSessions.put(sessionId, session);

                setSessionCookie(exchange, sessionId);
                System.out.println("Admin login successful for: " + email);
                sendJsonResponse(exchange, 200, String.format("{\"success\":true,\"message\":\"Login successful\",\"email\":\"%s\"}", escapeJson(email)));
            } else {
                System.err.println("Admin login failed for email: " + email);
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Invalid email or password.\"}");
            }
        }
    }

    static class AdminLogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            String sessionId = getSessionIdFromCookie(exchange);
            if (sessionId != null) {
                activeSessions.remove(sessionId);
            }
            clearSessionCookie(exchange);
            sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Logged out successfully.\"}");
        }
    }

    static class AdminSessionHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            AdminSession session = validateSession(exchange);
            if (session != null) {
                sendJsonResponse(exchange, 200, String.format("{\"authenticated\":true,\"email\":\"%s\"}", escapeJson(session.email)));
            } else {
                sendJsonResponse(exchange, 401, "{\"authenticated\":false,\"error\":\"No active admin session\"}");
            }
        }
    }

    // =========================================================================
    // Admin Protected Endpoints
    // =========================================================================
    static class AddNodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            // Require Session Verification
            AdminSession session = validateSession(exchange);
            if (session == null) {
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Unauthorized. Active admin session required.\"}");
                return;
            }

            String body = readStream(exchange.getRequestBody());
            Map<String, String> params = parseJsonBody(body);

            String id = params.getOrDefault("id", "node_" + System.currentTimeMillis());
            String name = params.getOrDefault("name", "New Building");
            String code = params.getOrDefault("code", "NEW");
            String category = params.getOrDefault("category", "Academic");
            int x = Integer.parseInt(params.getOrDefault("x", "500"));
            int y = Integer.parseInt(params.getOrDefault("y", "400"));
            int floors = Integer.parseInt(params.getOrDefault("floors", "2"));
            boolean accessible = Boolean.parseBoolean(params.getOrDefault("accessible", "true"));
            String description = params.getOrDefault("description", "Newly added campus facility.");
            String icon = params.getOrDefault("icon", "🏢");

            Location newLoc = new Location(id, name, code, category, x, y, floors, accessible, description, icon);
            locations.add(newLoc);
            locationMap.put(id, newLoc);

            saveDataToDisk();

            String jsonResponse = String.format("{\"success\":true,\"message\":\"Node added successfully\",\"nodeId\":\"%s\"}", id);
            sendJsonResponse(exchange, 200, jsonResponse);
        }
    }

    static class DeleteNodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            // Require Session Verification
            AdminSession session = validateSession(exchange);
            if (session == null) {
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Unauthorized. Active admin session required.\"}");
                return;
            }

            String body = readStream(exchange.getRequestBody());
            Map<String, String> params = parseJsonBody(body);
            String id = params.get("id");

            if (id == null || !locationMap.containsKey(id)) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Node ID not found.\"}");
                return;
            }

            // Remove location
            locations.removeIf(l -> l.id.equals(id));
            locationMap.remove(id);

            // Remove connected routes
            routes.removeIf(r -> r.from.equals(id) || r.to.equals(id));

            saveDataToDisk();

            String jsonResponse = String.format("{\"success\":true,\"message\":\"Node '%s' and connected routes deleted successfully\"}", id);
            sendJsonResponse(exchange, 200, jsonResponse);
        }
    }

    // =========================================================================
    // Route Calculation (Dijkstra)
    // =========================================================================
    static class NavigateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String from = params.get("from");
            String to = params.get("to");
            boolean accessibleOnly = Boolean.parseBoolean(params.getOrDefault("accessible", "false"));

            if (from == null || to == null || !locationMap.containsKey(from) || !locationMap.containsKey(to)) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Invalid 'from' or 'to' parameters. Locations must exist.\"}");
                return;
            }

            Map<String, Integer> dist = new HashMap<>();
            Map<String, String> prevNode = new HashMap<>();
            Map<String, Route> prevEdge = new HashMap<>();

            for (Location loc : locations) {
                dist.put(loc.id, Integer.MAX_VALUE);
            }
            dist.put(from, 0);

            PriorityQueue<NodeDistance> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.distance));
            pq.add(new NodeDistance(from, 0));

            while (!pq.isEmpty()) {
                NodeDistance curr = pq.poll();
                if (curr.distance > dist.get(curr.nodeId)) continue;
                if (curr.nodeId.equals(to)) break;

                for (Route r : routes) {
                    if (accessibleOnly && !r.accessible) continue;

                    String neighbor = null;
                    if (r.from.equals(curr.nodeId)) neighbor = r.to;
                    else if (r.to.equals(curr.nodeId)) neighbor = r.from;

                    if (neighbor != null) {
                        int newDist = curr.distance + r.distance;
                        if (newDist < dist.getOrDefault(neighbor, Integer.MAX_VALUE)) {
                            dist.put(neighbor, newDist);
                            prevNode.put(neighbor, curr.nodeId);
                            prevEdge.put(neighbor, r);
                            pq.add(new NodeDistance(neighbor, newDist));
                        }
                    }
                }
            }

            if (dist.get(to) == Integer.MAX_VALUE) {
                sendJsonResponse(exchange, 404, "{\"success\":false,\"error\":\"No path found matching criteria.\"}");
                return;
            }

            List<String> nodePath = new ArrayList<>();
            List<Route> edgePath = new ArrayList<>();
            String curr = to;
            while (curr != null) {
                nodePath.add(0, curr);
                Route edge = prevEdge.get(curr);
                if (edge != null) {
                    edgePath.add(0, edge);
                }
                curr = prevNode.get(curr);
            }

            int totalDist = dist.get(to);
            int totalTime = 0;
            StringBuilder directionsJson = new StringBuilder("[");

            for (int i = 0; i < edgePath.size(); i++) {
                Route r = edgePath.get(i);
                totalTime += r.time;
                String stepFrom = locationMap.get(nodePath.get(i)).name;
                String stepTo = locationMap.get(nodePath.get(i + 1)).name;

                String instruction = String.format("Walk along %s from %s towards %s", r.type, stepFrom, stepTo);
                directionsJson.append(String.format(
                        "{\"step\":%d,\"from\":\"%s\",\"to\":\"%s\",\"distance\":%d,\"time\":%d,\"type\":\"%s\",\"accessible\":%b,\"instruction\":\"%s\"}",
                        i + 1, escapeJson(stepFrom), escapeJson(stepTo), r.distance, r.time, escapeJson(r.type), r.accessible, escapeJson(instruction)
                ));
                if (i < edgePath.size() - 1) directionsJson.append(",");
            }
            directionsJson.append("]");

            StringBuilder nodePathJson = new StringBuilder("[");
            for (int i = 0; i < nodePath.size(); i++) {
                nodePathJson.append("\"").append(nodePath.get(i)).append("\"");
                if (i < nodePath.size() - 1) nodePathJson.append(",");
            }
            nodePathJson.append("]");

            String jsonResponse = String.format(
                    "{\"success\":true,\"from\":\"%s\",\"to\":\"%s\",\"accessibleOnly\":%b,\"totalDistance\":%d,\"totalTime\":%d,\"nodePath\":%s,\"directions\":%s}",
                    from, to, accessibleOnly, totalDist, totalTime, nodePathJson.toString(), directionsJson.toString()
            );

            sendJsonResponse(exchange, 200, jsonResponse);
        }
    }

    static class NodeDistance {
        String nodeId;
        int distance;

        NodeDistance(String nodeId, int distance) {
            this.nodeId = nodeId;
            this.distance = distance;
        }
    }

    // =========================================================================
    // Utilities
    // =========================================================================
    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        byte[] response = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, response.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response);
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null || query.isEmpty()) return result;
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            } else if (pair.length == 1) {
                result.put(pair[0], "");
            }
        }
        return result;
    }

    private static Map<String, String> parseJsonBody(String body) {
        Map<String, String> result = new HashMap<>();
        if (body == null || body.trim().isEmpty()) return result;

        Pattern p = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(?:\"([^\"]*)\"|(true|false)|(\\d+))");
        Matcher m = p.matcher(body);
        while (m.find()) {
            String key = m.group(1);
            String val = m.group(2) != null ? m.group(2) : (m.group(3) != null ? m.group(3) : m.group(4));
            result.put(key, val);
        }
        return result;
    }

    private static String readStream(InputStream is) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        return result.toString(StandardCharsets.UTF_8.name());
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String getFallbackJson() {
        return "{\"campusInfo\":{\"name\":\"Nova Horizon Campus\"},\"locations\":[],\"routes\":[]}";
    }
}