import { serve } from "bun";
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

        "/api/log": async (req) => {
            return fetch(`${process.env.BACKEND_URL}/log`, req);
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
