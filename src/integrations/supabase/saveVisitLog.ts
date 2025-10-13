import { supabase } from "./client";
// Als je codegen gebruikt, kun je dit typen als: import type { TablesInsert } from "./types";

async function getPublicIp(): Promise<string | null> {
  const candidates = [
    "https://api.ipify.org?format=json",
    "https://api64.ipify.org?format=json",
    "https://ifconfig.co/json",
  ];
  for (const url of candidates) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        cache: "no-store",
        mode: "cors",
        keepalive: true,
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      if (json?.ip) return String(json.ip);
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function saveVisitLog() {
  try {
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    const uid = url.searchParams.get("t"); // jouw UID
    const path = window.location.pathname + window.location.search;

    // voorkom dubbele inserts in één sessie
    const dedupeKey = `visit-log:${path}:${ref ?? ""}:${uid ?? ""}`;
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");

    const ip = await getPublicIp(); // kan null zijn bij strikte netwerken
    const user_agent = navigator.userAgent;

    // Type: gebruik je codegen, dan: TablesInsert<"visit_logs">
    const payload = {
      ip,
      ref: ref ?? null,
      uid: uid ?? null,
      user_agent,
      path,
    };

    const { error } = await supabase.from("visit_logs").insert(payload);
    if (error) {
      // optioneel: sessionStorage cleanup zodat we nog eens kunnen proberen
      sessionStorage.removeItem(dedupeKey);
      console.error("Visit log insert failed", error);
    }
  } catch (e) {
    console.error("saveVisitLog error", e);
  }
}
