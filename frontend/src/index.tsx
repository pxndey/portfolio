import { serve } from "bun";
import index from "./index.html";

const isProd = process.env.NODE_ENV === "production";
const backendUrl = isProd
    ? (process.env.BACKEND_URL || process.env.PROD_ENV || "http://backend:8080")
    : (process.env.DEV_ENV || "http://localhost:8080");

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

        "/api/audio": async (req) => {
            return fetch(`${backendUrl}/audio`, req);
        },

        "/api/music": async (req) => {
            return fetch(`${backendUrl}/music`, req);
        },

        "/api/audio/file": async (req) => {
            const url = new URL(req.url);
            const upstream = await fetch(`${backendUrl}/audio/file${url.search}`);
            return new Response(upstream.body, {
                status: upstream.status,
                headers: {
                    "Content-Type": "audio/mpeg",
                },
            });
        },
    },

    development: !isProd,
});

console.log(`🚀 Server running at ${server.url} → backend ${backendUrl}`);
