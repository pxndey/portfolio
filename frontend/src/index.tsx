import { serve } from "bun";
import { appendFileSync, mkdirSync } from "fs";
import index from "./index.html";

const server = serve({
    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,

        "/api/hello": {
            async GET(req) {
                return Response.json({
                    message: "Hello, world!",
                    method: "GET",
                });
            },
            async PUT(req) {
                return Response.json({
                    message: "Hello, world!",
                    method: "PUT",
                });
            },
        },

        "/api/hello/:name": async (req) => {
            const name = req.params.name;
            return Response.json({
                message: `Hello, ${name}!`,
            });
        },

        "/.well-known/matrix/server": async (req) => {
            return Response.json({ "m.server": "matrix.pxndey.com:443" });
        },

        "/.well-known/matrix/client": async (req) => {
            return Response.json({ "m.homeserver": { "base_url": "https://matrix.pxndey.com" } });
        },

        "/.well-known/*": async (req) => {
            const url = new URL(req.url);
            const upstream = await fetch(`https://social.pxndey.com${url.pathname}${url.search}`);
            return new Response(upstream.body, {
                status: upstream.status,
                headers: upstream.headers,
            });
        },

        "/api/log": {
            async POST(req) {
                const body = await req.json();

                const ip =
                    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                    req.headers.get("x-real-ip") ||
                    "unknown";
                const acceptedEncoding = req.headers.get("accept-encoding") || "";

                let geo: Record<string, string> = {};
                try {
                    const geoRes = await fetch(
                        `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,zip,lat,lon,isp,org,as`
                    );
                    geo = await geoRes.json();
                } catch {}

                const timestamp = new Date().toISOString();
                const location = [geo.city, geo.regionName, geo.country].filter(Boolean).join(", ");
                const coordinates = geo.lat && geo.lon ? `${geo.lat},${geo.lon}` : "";

                const fields = [
                    timestamp,
                    ip,
                    location,
                    coordinates,
                    geo.zip || "",
                    geo.countryCode || "",
                    geo.isp || "",
                    geo.org || "",
                    geo.as || "",
                    body.platform || "",
                    body.screenSize || "",
                    body.viewportSize || "",
                    body.colorDepth || "",
                    body.browser || "",
                    body.userAgent || "",
                    body.language || "",
                    acceptedEncoding,
                    body.timezone || "",
                    body.deviceMemory || "",
                    body.connectionType || "",
                    body.doNotTrack || "",
                    String(body.cookiesEnabled ?? ""),
                    String(body.localStorage ?? ""),
                    body.route || "",
                ];

                try {
                    mkdirSync("logs", { recursive: true });
                    appendFileSync("logs/visitors.log", fields.join("\t") + "\n");
                } catch (e) {
                    console.error("Failed to write visitor log:", e);
                }

                return Response.json({ ok: true });
            },
        },

        "/api/audio": async (req) => {
            return fetch(`${process.env.BACKEND_URL}/audio`, req);
        },

        "/api/music": async (req) => {
            return fetch(`${process.env.BACKEND_URL}/music`, req);
        },

        "/api/audio/file": async (req) => {
            const url = new URL(req.url);
            const upstream = await fetch(`${process.env.BACKEND_URL}/audio/file${url.search}`);
            return new Response(upstream.body, {
                status: upstream.status,
                headers: {
                    "Content-Type": "audio/mpeg",
                },
            });
        },
    },

    development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
