import { createClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://zohqgnhymtqppgzlammv.supabase.co";
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaHFnbmh5bXRxcHBnemxhbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDgxMzQsImV4cCI6MjA5NjE4NDEzNH0.OHmeGE1jsY0wNmjOeX4yQCONJ5_xaij7yQ_W5sUgito";

const URL = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_URL;
const ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_ANON;
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string) || "https://www.pytrack.com.br";

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

// abre URL externa no navegador padrão (via Tauri se disponível, senão window.open)
export async function openExternal(url: string) {
  try {
    const { open } = await import("@tauri-apps/plugin-shell");
    await open(url);
  } catch {
    window.open(url, "_blank");
  }
}
