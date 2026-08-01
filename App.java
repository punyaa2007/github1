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
        String id, name, code, category, description, icon;
        int x, y, floors;
        boolean accessible;

        Location(String id, String name, String code, String category, int x, int y, int floors, boolean accessible, String description, String icon) {
            this.id = id; this.name = name; this.code = code; this.category = category;
            this.x = x; this.y = y; this.floors = floors; this.accessible = accessible;
            this.description = description; this.icon = icon;
        }
    }

    static class Route {
        String id, from, to, type;
        int distance, time;
        boolean accessible;

        Route(String id, String from, String to, int distance, int time, String type, boolean accessible) {
            this.id = id; this.from = from; this.to = to;
            this.distance = distance; this.time = time;
            this.type = type; this.accessible = accessible;
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
        server.createContext("/api/admin/login", new CorsHandler(new AdminLoginHandler()));
        server.createContext("/api/admin/logout", new CorsHandler(new AdminLogoutHandler()));
        server.createContext("/api/admin/session", new CorsHandler(new AdminSessionHandler()));
        server.createContext("/api/admin/node/add", new CorsHandler(new AddNodeHandler()));
        server.createContext("/api/admin/node/delete", new CorsHandler(new DeleteNodeHandler()));

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("=================================================");
        System.out.println("Campus Navigation Server running on port " + PORT);
        System.out.println("Admin Email: " + storedAdminEmail);
        System.out.println("=================================================");
    }

    // =========================================================================
    // Security & PBKDF2 Hashing
    // =========================================================================
    private static void initAdminSecurity() {
        try {
            if (Files.exists(Paths.get(CREDENTIALS_FILE))) {
                String content = new String(Files.readAllBytes(Paths.get(CREDENTIALS_FILE)), StandardCharsets.UTF_8);
                Map<String, String> creds = parseJsonBody(content);
                storedAdminEmail = creds.getOrDefault("email", "admin@campus.edu");
                storedPasswordHash = creds.getOrDefault("hash", "");
                storedSaltHex = creds.getOrDefault("salt", "");
                System.out.println("Loaded admin credentials from " + CREDENTIALS_FILE);
            } else {
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
        } catch (Exception e) {
            System.err.println("Failed to write credentials: " + e.getMessage());
        }
    }

    private static byte[] generateSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    private static String hashPassword(String password, byte[] salt) {
        try {
            KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 256);
            return bytesToHex(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded());
        } catch (Exception e) {
            throw new RuntimeException("PBKDF2 error: " + e.getMessage(), e);
        }
    }

    private static boolean verifyAdminPassword(String email, String rawPassword) {
        if (email == null || rawPassword == null) return false;
        if (!email.trim().equalsIgnoreCase(storedAdminEmail.trim())) return false;
        try {
            byte[] salt = hexToBytes(storedSaltHex);
            return hashPassword(rawPassword, salt).equalsIgnoreCase(storedPasswordHash);
        } catch (Exception e) {
            System.err.println("Password verify error: " + e.getMessage());
            return false;
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2)
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4) + Character.digit(hex.charAt(i + 1), 16));
        return data;
    }

    // =========================================================================
    // Session Helpers (Header + Cookie dual support)
    // =========================================================================
    private static AdminSession validateSession(HttpExchange exchange) {
        // Check X-Session-Token header first (reliable for local dev cross-origin)
        String sessionId = exchange.getRequestHeaders().getFirst("X-Session-Token");
        // Fallback to cookie
        if (sessionId == null || sessionId.isEmpty()) sessionId = getSessionIdFromCookie(exchange);
        if (sessionId == null || sessionId.isEmpty()) return null;

        AdminSession session = activeSessions.get(sessionId);
        if (session == null) return null;
        if (session.isExpired()) { activeSessions.remove(sessionId); return null; }
        return session;
    }

    private static String getSessionIdFromCookie(HttpExchange exchange) {
        List<String> cookieHeaders = exchange.getRequestHeaders().get("Cookie");
        if (cookieHeaders != null) {
            for (String header : cookieHeaders) {
                for (String cookie : header.split(";")) {
                    String[] pair = cookie.trim().split("=", 2);
                    if (pair.length == 2 && "session_id".equalsIgnoreCase(pair[0].trim()))
                        return pair[1].trim();
                }
            }
        }
        return null;
    }

    private static void setSessionCookie(HttpExchange exchange, String sessionId) {
        exchange.getResponseHeaders().add("Set-Cookie",
                String.format("session_id=%s; Path=/; HttpOnly; SameSite=Lax", sessionId));
    }

    private static void clearSessionCookie(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Set-Cookie",
                "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax");
    }

    // =========================================================================
    // Data Management
    // =========================================================================
    private static void loadData() {
        try {
            if (Files.exists(Paths.get("data.json"))) {
                rawJsonData = new String(Files.readAllBytes(Paths.get("data.json")), StandardCharsets.UTF_8);
            } else {
                rawJsonData = getFallbackJson();
            }
            parseJson(rawJsonData);
            System.out.println("Loaded " + locations.size() + " locations and " + routes.size() + " routes.");
        } catch (Exception e) {
            System.err.println("Error loading data: " + e.getMessage());
            rawJsonData = getFallbackJson();
            parseJson(rawJsonData);
        }
    }

    private static void parseJson(String json) {
        locations.clear(); routes.clear(); locationMap.clear();
        int locStart = json.indexOf("\"locations\":");
        int routesStart = json.indexOf("\"routes\":");
        if (locStart == -1 || routesStart == -1) return;

        Pattern locPattern = Pattern.compile("\\{\\s*\"id\":\\s*\"([^\"]+)\",\\s*\"name\":\\s*\"([^\"]+)\",\\s*\"code\":\\s*\"([^\"]+)\",\\s*\"category\":\\s*\"([^\"]+)\",\\s*\"x\":\\s*(\\d+),\\s*\"y\":\\s*(\\d+),\\s*\"floors\":\\s*(\\d+),\\s*\"accessible\":\\s*(true|false),\\s*\"description\":\\s*\"([^\"]+)\",\\s*\"icon\":\\s*\"([^\"]+)\"");
        Matcher m = locPattern.matcher(json.substring(locStart, routesStart));
        while (m.find()) {
            Location loc = new Location(m.group(1), m.group(2), m.group(3), m.group(4),
                    Integer.parseInt(m.group(5)), Integer.parseInt(m.group(6)),
                    Integer.parseInt(m.group(7)), Boolean.parseBoolean(m.group(8)), m.group(9), m.group(10));
            locations.add(loc); locationMap.put(loc.id, loc);
        }

        Pattern routePattern = Pattern.compile("\\{\\s*\"id\":\\s*\"([^\"]+)\",\\s*\"from\":\\s*\"([^\"]+)\",\\s*\"to\":\\s*\"([^\"]+)\",\\s*\"distance\":\\s*(\\d+),\\s*\"time\":\\s*(\\d+),\\s*\"type\":\\s*\"([^\"]+)\",\\s*\"accessible\":\\s*(true|false)");
        Matcher rm = routePattern.matcher(json.substring(routesStart));
        while (rm.find()) {
            routes.add(new Route(rm.group(1), rm.group(2), rm.group(3),
                    Integer.parseInt(rm.group(4)), Integer.parseInt(rm.group(5)), rm.group(6), Boolean.parseBoolean(rm.group(7))));
        }
    }

    private static synchronized void saveDataToDisk() {
        try {
            StringBuilder sb = new StringBuilder("{\n  \"campusInfo\": {\"name\": \"Nova Horizon University Campus\", \"mapDimensions\": {\"width\": 1000, \"height\": 800}},\n  \"locations\": [\n");
            for (int i = 0; i < locations.size(); i++) {
                Location l = locations.get(i);
                sb.append(String.format("    {\"id\":\"%s\",\"name\":\"%s\",\"code\":\"%s\",\"category\":\"%s\",\"x\":%d,\"y\":%d,\"floors\":%d,\"accessible\":%b,\"description\":\"%s\",\"icon\":\"%s\"}",
                        l.id, escapeJson(l.name), escapeJson(l.code), escapeJson(l.category), l.x, l.y, l.floors, l.accessible, escapeJson(l.description), l.icon));
                if (i < locations.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append("  ],\n  \"routes\": [\n");
            for (int i = 0; i < routes.size(); i++) {
                Route r = routes.get(i);
                sb.append(String.format("    {\"id\":\"%s\",\"from\":\"%s\",\"to\":\"%s\",\"distance\":%d,\"time\":%d,\"type\":\"%s\",\"accessible\":%b}",
                        r.id, r.from, r.to, r.distance, r.time, escapeJson(r.type), r.accessible));
                if (i < routes.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append("  ]\n}\n");
            rawJsonData = sb.toString();
            Files.write(Paths.get("data.json"), rawJsonData.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            System.err.println("Error saving data: " + e.getMessage());
        }
    }

    // =========================================================================
    // HTTP Handlers
    // =========================================================================
    static class CorsHandler implements HttpHandler {
        private final HttpHandler next;
        CorsHandler(HttpHandler next) { this.next = next; }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<String> origins = exchange.getRequestHeaders().get("Origin");
            String origin = (origins != null && !origins.isEmpty()) ? origins.get(0) : "*";
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin);
            exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, X-Session-Token");
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); return;
            }
            next.handle(exchange);
        }
    }

    static class DataHandler implements HttpHandler {
        @Override public void handle(HttpExchange e) throws IOException {
            byte[] r = rawJsonData.getBytes(StandardCharsets.UTF_8);
            e.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            e.sendResponseHeaders(200, r.length);
            try (OutputStream os = e.getResponseBody()) { os.write(r); }
        }
    }

    static class LocationsHandler implements HttpHandler {
        @Override public void handle(HttpExchange e) throws IOException {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < locations.size(); i++) {
                Location l = locations.get(i);
                sb.append(String.format("{\"id\":\"%s\",\"name\":\"%s\",\"code\":\"%s\",\"category\":\"%s\",\"x\":%d,\"y\":%d,\"floors\":%d,\"accessible\":%b,\"description\":\"%s\",\"icon\":\"%s\"}",
                        l.id, escapeJson(l.name), escapeJson(l.code), escapeJson(l.category), l.x, l.y, l.floors, l.accessible, escapeJson(l.description), l.icon));
                if (i < locations.size() - 1) sb.append(",");
            }
            sb.append("]");
            byte[] r = sb.toString().getBytes(StandardCharsets.UTF_8);
            e.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            e.sendResponseHeaders(200, r.length);
            try (OutputStream os = e.getResponseBody()) { os.write(r); }
        }
    }

    static class HealthHandler implements HttpHandler {
        @Override public void handle(HttpExchange e) throws IOException {
            byte[] r = "{\"status\":\"OK\",\"version\":\"2.0.0\"}".getBytes(StandardCharsets.UTF_8);
            e.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            e.sendResponseHeaders(200, r.length);
            try (OutputStream os = e.getResponseBody()) { os.write(r); }
        }
    }

    // =========================================================================
    // Admin Auth Handlers
    // =========================================================================
    static class AdminLoginHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}"); return;
            }
            Map<String, String> params = parseJsonBody(readStream(exchange.getRequestBody()));
            String email = params.get("email");
            String password = params.get("password");

            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Email and password are required.\"}"); return;
            }

            if (verifyAdminPassword(email, password)) {
                String sessionId = UUID.randomUUID().toString();
                activeSessions.put(sessionId, new AdminSession(sessionId, email.trim().toLowerCase(), 86400000L));
                setSessionCookie(exchange, sessionId);
                System.out.println("Admin login OK: " + email);
                // Return sessionToken in response body for JS header-based auth
                sendJsonResponse(exchange, 200, String.format("{\"success\":true,\"message\":\"Login successful\",\"email\":\"%s\",\"sessionToken\":\"%s\"}", escapeJson(email), sessionId));
            } else {
                System.err.println("Admin login FAILED: " + email);
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Invalid email or password.\"}");
            }
        }
    }

    static class AdminLogoutHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}"); return;
            }
            String sessionId = exchange.getRequestHeaders().getFirst("X-Session-Token");
            if (sessionId == null) sessionId = getSessionIdFromCookie(exchange);
            if (sessionId != null) activeSessions.remove(sessionId);
            clearSessionCookie(exchange);
            sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Logged out.\"}");
        }
    }

    static class AdminSessionHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}"); return;
            }
            AdminSession session = validateSession(exchange);
            if (session != null) {
                sendJsonResponse(exchange, 200, String.format("{\"authenticated\":true,\"email\":\"%s\",\"sessionToken\":\"%s\"}", escapeJson(session.email), session.sessionId));
            } else {
                sendJsonResponse(exchange, 401, "{\"authenticated\":false,\"error\":\"No active session\"}");
            }
        }
    }

    // =========================================================================
    // Protected Admin Node Handlers
    // =========================================================================
    static class AddNodeHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}"); return;
            }
            if (validateSession(exchange) == null) {
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Unauthorized.\"}"); return;
            }
            Map<String, String> p = parseJsonBody(readStream(exchange.getRequestBody()));
            String id = p.getOrDefault("id", "node_" + System.currentTimeMillis());
            Location loc = new Location(id, p.getOrDefault("name", "New Building"),
                    p.getOrDefault("code", "NEW"), p.getOrDefault("category", "Academic"),
                    Integer.parseInt(p.getOrDefault("x", "500")), Integer.parseInt(p.getOrDefault("y", "400")),
                    Integer.parseInt(p.getOrDefault("floors", "2")), Boolean.parseBoolean(p.getOrDefault("accessible", "true")),
                    p.getOrDefault("description", "New facility."), p.getOrDefault("icon", "🏢"));
            locations.add(loc); locationMap.put(id, loc);
            saveDataToDisk();
            sendJsonResponse(exchange, 200, String.format("{\"success\":true,\"nodeId\":\"%s\"}", id));
        }
    }

    static class DeleteNodeHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}"); return;
            }
            if (validateSession(exchange) == null) {
                sendJsonResponse(exchange, 401, "{\"success\":false,\"error\":\"Unauthorized.\"}"); return;
            }
            Map<String, String> p = parseJsonBody(readStream(exchange.getRequestBody()));
            String id = p.get("id");
            if (id == null || !locationMap.containsKey(id)) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Node not found.\"}"); return;
            }
            locations.removeIf(l -> l.id.equals(id));
            locationMap.remove(id);
            routes.removeIf(r -> r.from.equals(id) || r.to.equals(id));
            saveDataToDisk();
            sendJsonResponse(exchange, 200, String.format("{\"success\":true,\"message\":\"Deleted '%s'\"}", id));
        }
    }

    // =========================================================================
    // Dijkstra Route Navigation
    // =========================================================================
    static class NavigateHandler implements HttpHandler {
        @Override public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String from = params.get("from"), to = params.get("to");
            boolean accessibleOnly = Boolean.parseBoolean(params.getOrDefault("accessible", "false"));

            if (from == null || to == null || !locationMap.containsKey(from) || !locationMap.containsKey(to)) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Invalid from/to.\"}"); return;
            }

            Map<String, Integer> dist = new HashMap<>();
            Map<String, String> prevNode = new HashMap<>();
            Map<String, Route> prevEdge = new HashMap<>();
            for (Location l : locations) dist.put(l.id, Integer.MAX_VALUE);
            dist.put(from, 0);

            PriorityQueue<NodeDist> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.d));
            pq.add(new NodeDist(from, 0));

            while (!pq.isEmpty()) {
                NodeDist curr = pq.poll();
                if (curr.d > dist.get(curr.id)) continue;
                if (curr.id.equals(to)) break;
                for (Route r : routes) {
                    if (accessibleOnly && !r.accessible) continue;
                    String nb = r.from.equals(curr.id) ? r.to : r.to.equals(curr.id) ? r.from : null;
                    if (nb != null) {
                        int nd = curr.d + r.distance;
                        if (nd < dist.getOrDefault(nb, Integer.MAX_VALUE)) {
                            dist.put(nb, nd); prevNode.put(nb, curr.id); prevEdge.put(nb, r);
                            pq.add(new NodeDist(nb, nd));
                        }
                    }
                }
            }

            if (dist.get(to) == Integer.MAX_VALUE) {
                sendJsonResponse(exchange, 404, "{\"success\":false,\"error\":\"No path found.\"}"); return;
            }

            List<String> nodePath = new ArrayList<>();
            List<Route> edgePath = new ArrayList<>();
            String curr = to;
            while (curr != null) { nodePath.add(0, curr); Route e = prevEdge.get(curr); if (e != null) edgePath.add(0, e); curr = prevNode.get(curr); }

            int totalTime = 0;
            StringBuilder dirs = new StringBuilder("[");
            for (int i = 0; i < edgePath.size(); i++) {
                Route r = edgePath.get(i); totalTime += r.time;
                dirs.append(String.format("{\"step\":%d,\"from\":\"%s\",\"to\":\"%s\",\"distance\":%d,\"time\":%d,\"type\":\"%s\",\"accessible\":%b,\"instruction\":\"Walk along %s from %s towards %s\"}",
                        i+1, escapeJson(locationMap.get(nodePath.get(i)).name), escapeJson(locationMap.get(nodePath.get(i+1)).name),
                        r.distance, r.time, escapeJson(r.type), r.accessible, escapeJson(r.type),
                        escapeJson(locationMap.get(nodePath.get(i)).name), escapeJson(locationMap.get(nodePath.get(i+1)).name)));
                if (i < edgePath.size() - 1) dirs.append(",");
            }
            dirs.append("]");

            StringBuilder np = new StringBuilder("[");
            for (int i = 0; i < nodePath.size(); i++) { np.append("\"").append(nodePath.get(i)).append("\""); if (i < nodePath.size()-1) np.append(","); }
            np.append("]");

            sendJsonResponse(exchange, 200, String.format("{\"success\":true,\"from\":\"%s\",\"to\":\"%s\",\"accessibleOnly\":%b,\"totalDistance\":%d,\"totalTime\":%d,\"nodePath\":%s,\"directions\":%s}",
                    from, to, accessibleOnly, dist.get(to), totalTime, np, dirs));
        }
    }

    static class NodeDist { String id; int d; NodeDist(String id, int d) { this.id = id; this.d = d; } }

    // =========================================================================
    // Utilities
    // =========================================================================
    private static void sendJsonResponse(HttpExchange e, int code, String json) throws IOException {
        byte[] r = json.getBytes(StandardCharsets.UTF_8);
        e.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
        e.sendResponseHeaders(code, r.length);
        try (OutputStream os = e.getResponseBody()) { os.write(r); }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null) return result;
        for (String p : query.split("&")) { String[] kv = p.split("="); if (kv.length > 1) result.put(kv[0], kv[1]); else if (kv.length == 1) result.put(kv[0], ""); }
        return result;
    }

    private static Map<String, String> parseJsonBody(String body) {
        Map<String, String> result = new HashMap<>();
        if (body == null || body.trim().isEmpty()) return result;
        Matcher m = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(?:\"([^\"]*)\"|(true|false)|(\\d+))").matcher(body);
        while (m.find()) result.put(m.group(1), m.group(2) != null ? m.group(2) : m.group(3) != null ? m.group(3) : m.group(4));
        return result;
    }

    private static String readStream(InputStream is) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[1024]; int n;
        while ((n = is.read(buf)) != -1) out.write(buf, 0, n);
        return out.toString(StandardCharsets.UTF_8.name());
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String getFallbackJson() {
        return "{\"campusInfo\":{\"name\":\"Nova Horizon Campus\"},\"locations\":[],\"routes\":[]}";
    }
}