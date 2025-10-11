import { supabase } from "./client";

function getSessionId(): string {
  const key = "visitor_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function logVisit(pathname: string) {
  try {
    // Only run in production to avoid noise in dev
    if (import.meta.env.DEV) return;
    const session_id = getSessionId();
    const language = navigator.language;
    const screen_width = window.screen?.width ?? null;
    const screen_height = window.screen?.height ?? null;

    const fullPath = `${pathname}${window.location.search ?? ""}`;
    const { data, error } = await supabase.functions.invoke("log-visit", {
      body: {
        path: fullPath,
        session_id,
        language,
        screen_width,
        screen_height,
      },
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.warn("logVisit error", error);
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("logVisit failed", e);
  }
}
