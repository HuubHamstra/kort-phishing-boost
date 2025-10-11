// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: log-visit
// Captures client IP from headers and optional metadata from request body,
// then inserts a record into the visitor_logs table.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client with the service role key to bypass RLS for inserts
// Note: SUPABASE_URL may be injected by the platform. If not, you can set PROJECT_URL
// or set PROJECT_REF and we'll derive the URL.
const projectRef =
  Deno.env.get("PROJECT_REF") ??
  Deno.env.get("SUPABASE_PROJECT_ID") ??
  Deno.env.get("PROJECT_ID");
const supabaseUrl =
  Deno.env.get("SUPABASE_URL") ??
  Deno.env.get("PROJECT_URL") ??
  (projectRef ? `https://${projectRef}.supabase.co` : undefined);
// Avoid reserved prefix for custom secrets; prefer SERVICE_ROLE_KEY.
const serviceRoleKey =
  Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const allowedOriginsEnv = Deno.env.get("ALLOWED_ORIGINS") || ""; // CSV
const allowedOrigins = new Set(
  allowedOriginsEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

if (!supabaseUrl) {
  console.error(
    "Miss`ing Supabase URL. Provide SUPABASE_URL (if available), or set PROJECT_URL, or set PROJECT_REF to derive https://<ref>.supabase.co."
  );
}
if (!serviceRoleKey) {
  console.error(
    "Missing SERVICE_ROLE_KEY env. Set a secret named SERVICE_ROLE_KEY (not starting with SUPABASE_)."
  );
}

const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!, {
  auth: { persistSession: false },
});

function parseClientIp(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    // take first IP if multiple are present
    return xff.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  return null;
}

function safeString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  try {
    const s = String(value);
    return s.length > 2000 ? s.slice(0, 2000) : s;
  } catch {
    return null;
  }
}

export default async function handler(req: Request): Promise<Response> {
  // Basic CORS support
  const origin = req.headers.get("origin") || "*";
  const corsOrigin =
    allowedOrigins.size === 0 || allowedOrigins.has(origin) ? origin : "";
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": corsOrigin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
        "access-control-max-age": "86400",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { "access-control-allow-origin": corsOrigin },
    });
  }

  const ip = parseClientIp(req.headers);
  const userAgent = req.headers.get("user-agent");
  const referer = req.headers.get("referer") || req.headers.get("referrer");

  let payload: any = {};
  try {
    if (req.headers.get("content-type")?.includes("application/json")) {
      payload = await req.json();
    }
  } catch (_) {
    // ignore invalid JSON
  }

  const { path, session_id, language, screen_width, screen_height } =
    payload || {};

  const insertPayload = {
    ip: safeString(ip),
    user_agent: safeString(userAgent),
    referrer: safeString(referer),
    path: safeString(path),
    session_id: safeString(session_id),
    language: safeString(language),
    screen_width: typeof screen_width === "number" ? screen_width : null,
    screen_height: typeof screen_height === "number" ? screen_height : null,
  };

  const { error } = await supabaseAdmin
    .from("visitor_logs")
    .insert(insertPayload as any);

  if (error) {
    console.error("Failed to insert visitor log", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": corsOrigin,
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": corsOrigin,
    },
  });
}

// Deno Deploy entrypoint
serve(handler);
