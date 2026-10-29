import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const corsHeaders = {
  "Access-Control-Allow-Headers": "apikey, authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Vary": "Origin",
};

const countKeys = ["youtube", "instagram", "facebook", "tiktok"] as const;
const maxCount = Number.MAX_SAFE_INTEGER;

function jsonResponse(body: unknown, status: number, origin: string | null) {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function validVideo(video: unknown): video is Record<string, unknown> {
  if (!video || typeof video !== "object" || Array.isArray(video)) return false;
  const item = video as Record<string, unknown>;
  const allowed = new Set([
    "id", "youtubeId", "titleAr", "titleFr", "url", "embedUrl", "thumbnail",
    "fallbackThumbnail", "tagAr", "tagFr", "author", "duration",
  ]);
  if (Object.keys(item).some((key) => !allowed.has(key))) return false;
  return typeof item.id === "string" && item.id.length > 0 && item.id.length <= 100 &&
    typeof item.youtubeId === "string" && /^[A-Za-z0-9_-]{11}$/.test(item.youtubeId) &&
    typeof item.titleAr === "string" && item.titleAr.trim().length > 0 &&
    ["titleAr", "titleFr", "tagAr", "tagFr", "author"].every((key) =>
      typeof item[key] === "string" && (item[key] as string).length <= 500
    ) &&
    (item.duration === undefined || (typeof item.duration === "string" && item.duration.length <= 30));
}

function validateWrite(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const body = input as Record<string, unknown>;
  if (!Object.keys(body).length || Object.keys(body).some((key) =>
    !["socialCounts", "videos", "gemsCount"].includes(key)
  )) return null;

  const patch: Record<string, unknown> = {};
  if ("socialCounts" in body) {
    const counts = body.socialCounts;
    if (!counts || typeof counts !== "object" || Array.isArray(counts)) return null;
    const entries = Object.entries(counts as Record<string, unknown>);
    if (!entries.length || entries.some(([key, value]) =>
      !countKeys.includes(key as typeof countKeys[number]) ||
      !Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > maxCount
    )) return null;
    patch.social_counts = Object.fromEntries(entries);
  }
  if ("videos" in body) {
    if (!Array.isArray(body.videos) || body.videos.length > 100 ||
      !body.videos.every(validVideo) ||
      new Set(body.videos.map((video) => (video as Record<string, unknown>).id)).size !== body.videos.length
    ) return null;
    patch.videos = body.videos.map((video) => {
      const item = video as Record<string, unknown>;
      const id = item.youtubeId as string;
      return {
        ...item,
        url: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        fallbackThumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      };
    });
  }
  if ("gemsCount" in body) {
    if (!Number.isSafeInteger(body.gemsCount) || (body.gemsCount as number) < 0) return null;
    patch.gems_count = body.gemsCount;
  }
  return patch;
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  try {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (origin && !allowedOrigins.includes(origin)) {
    return jsonResponse({ error: "Origin is not allowed." }, 403, null);
  }
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      },
    });
  }
  if (request.method !== "GET" && request.method !== "POST" && request.method !== "PUT") {
    return jsonResponse({ error: "Method not allowed." }, 405, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Required server-side Supabase secrets are not configured.");
    return jsonResponse({ error: "Shared content service is not configured." }, 500, origin);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (request.method === "POST") {
    const { data, error } = await supabase.rpc("record_public_support");
    if (error) {
      console.error("Unable to record public support:", error.message);
      return jsonResponse({ error: "Unable to record your support right now." }, 500, origin);
    }
    const result = Array.isArray(data) ? data[0] : data;
    if (!result || typeof result.gems_count !== "number") {
      console.error("Public support counter returned an invalid result.");
      return jsonResponse({ error: "The support counter returned an invalid response." }, 500, origin);
    }
    return jsonResponse({ gemsCount: Number(result.gems_count) }, 200, origin);
  }

  if (request.method === "GET") {
    const { data, error } = await supabase
      .from("site_content")
      .select("social_counts, videos, gems_count, updated_at")
      .eq("id", 1)
      .single();
    if (error) {
      console.error("Unable to read shared content:", error.message);
      return jsonResponse({ error: "Unable to load shared site data." }, 500, origin);
    }
    return jsonResponse({
      socialCounts: data.social_counts,
      videos: data.videos,
      gemsCount: Number(data.gems_count),
      updatedAt: data.updated_at,
    }, 200, origin);
  }

  const authorization = request.headers.get("Authorization");
  const tokenMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return jsonResponse({ error: "Authentication is required." }, 401, origin);

  const { data: authData, error: authError } = await supabase.auth.getUser(tokenMatch[1]);
  if (authError || !authData.user) {
    return jsonResponse({ error: "The session is invalid or expired." }, 401, origin);
  }
  const adminIds = (Deno.env.get("ADMIN_USER_IDS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!adminIds.includes(authData.user.id)) {
    return jsonResponse({ error: "This account is not authorized to edit site data." }, 403, origin);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400, origin);
  }
  const patch = validateWrite(input);
  if (!patch) return jsonResponse({ error: "Request data failed validation." }, 400, origin);

  const { data, error } = await supabase
    .from("site_content")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("social_counts, videos, gems_count, updated_at")
    .single();
  if (error) {
    console.error("Unable to persist shared content:", error.message);
    return jsonResponse({ error: "Unable to save shared site data." }, 500, origin);
  }

  return jsonResponse({
    socialCounts: data.social_counts,
    videos: data.videos,
    gemsCount: Number(data.gems_count),
    updatedAt: data.updated_at,
  }, 200, origin);
  } catch (error) {
    console.error("Unhandled shared content request error:", error);
    return jsonResponse({ error: "Shared content service request failed." }, 500, origin);
  }
});
