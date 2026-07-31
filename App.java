import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class App {
    private static final int PORT = 8080;
    private static String rawJsonData = "";
    private static List<Location> locations = new ArrayList<>();
    private static List<Route> routes = new ArrayList<>();
    private static Map<String, Location> locationMap = new HashMap<>();

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

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/data", new CorsHandler(new DataHandler()));
        server.createContext("/api/locations", new CorsHandler(new LocationsHandler()));
        server.createContext("/api/navigate", new CorsHandler(new NavigateHandler()));
        server.createContext("/api/health", new CorsHandler(new HealthHandler()));
        server.createContext("/api/admin/node/add", new CorsHandler(new AddNodeHandler()));
        server.createContext("/api/admin/node/delete", new CorsHandler(new DeleteNodeHandler()));

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("=================================================");
        System.out.println("Campus Navigation Server running on port " + PORT);
        System.out.println("API Data: http://localhost:" + PORT + "/api/data");
        System.out.println("API Route: http://localhost:" + PORT + "/api/navigate?from=eng_building&to=sports_arena");
        System.out.println("=================================================");
    }

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

    static class CorsHandler implements HttpHandler {
        private final HttpHandler next;

        CorsHandler(HttpHandler next) {
            this.next = next;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
            String json = "{\"status\":\"OK\",\"server\":\"Campus Navigation App.java\",\"version\":\"1.1.0 (Admin Enabled)\"}";
            byte[] response = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    static class AddNodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(450, -1);
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
            byte[] response = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    static class DeleteNodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(450, -1);
                return;
            }

            String body = readStream(exchange.getRequestBody());
            Map<String, String> params = parseJsonBody(body);
            String id = params.get("id");

            if (id == null || !locationMap.containsKey(id)) {
                String errJson = "{\"success\":false,\"error\":\"Node ID not found.\"}";
                byte[] response = errJson.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(400, response.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response);
                }
                return;
            }

            // Remove location
            locations.removeIf(l -> l.id.equals(id));
            locationMap.remove(id);

            // Remove connected routes
            routes.removeIf(r -> r.from.equals(id) || r.to.equals(id));

            saveDataToDisk();

            String jsonResponse = String.format("{\"success\":true,\"message\":\"Node '%s' and connected routes deleted successfully\"}", id);
            byte[] response = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
        }
    }

    static class NavigateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String from = params.get("from");
            String to = params.get("to");
            boolean accessibleOnly = Boolean.parseBoolean(params.getOrDefault("accessible", "false"));

            if (from == null || to == null || !locationMap.containsKey(from) || !locationMap.containsKey(to)) {
                String errorJson = "{\"success\":false,\"error\":\"Invalid 'from' or 'to' parameters. Locations must exist.\"}";
                byte[] response = errorJson.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(400, response.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response);
                }
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
                String errorJson = "{\"success\":false,\"error\":\"No path found matching criteria.\"}";
                byte[] response = errorJson.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(404, response.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response);
                }
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

            byte[] response = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }
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
