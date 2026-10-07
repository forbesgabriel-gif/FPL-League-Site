const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const reqUrl = new URL(req.url);
  const target = reqUrl.searchParams.get("url");

  if (!target || !target.startsWith("https://fantasy.premierleague.com/api/")) {
    return new Response(JSON.stringify({ error: "invalid or missing url" }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  try {
    const res = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const body = await res.text();
    return new Response(body, { status: res.status, headers: CORS_HEADERS });
  } catch (err) {
    return new Response(JSON.stringify({ error: "fetch failed" }), {
      status: 502,
      headers: CORS_HEADERS,
    });
  }
};

export const config = { path: "/.netlify/functions/fpl-proxy" };
