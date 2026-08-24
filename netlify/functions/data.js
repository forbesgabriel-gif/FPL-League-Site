import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const store = getStore("fpl-league");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(JSON.stringify({ error: "key is required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    const value = await store.get(key);
    if (value === null) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: CORS_HEADERS,
      });
    }
    return new Response(JSON.stringify({ key, value }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "invalid JSON body" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    if (!body.key) {
      return new Response(JSON.stringify({ error: "key is required" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    await store.set(body.key, body.value);
    return new Response(JSON.stringify({ ok: true, key: body.key }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  return new Response(JSON.stringify({ error: "method not allowed" }), {
    status: 405,
    headers: CORS_HEADERS,
  });
};

export const config = { path: "/.netlify/functions/data" };
