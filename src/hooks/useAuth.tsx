import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { tierFromSubscription, isAdminEmail, type Tier, type Subscription } from "@/lib/billing";

interface Profile {
  name: string | null;
  avatar_url: string | null;
  headline: string | null;
  xp: number;
  current_level: string | null;
  tutorial_done: boolean;
}

interface AuthState {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  tier: Tier;
  isAdmin: boolean;
  needsMfa: boolean;
  unreadCount: number;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tier, setTier] = useState<Tier>("free");
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadAll = useCallback(async (s: Session | null) => {
    if (!s?.user) {
      setProfile(null); setTier("free"); setIsAdmin(false); setUnreadCount(0);
      return;
    }
    const admin = isAdminEmail(s.user.email);
    setIsAdmin(admin);
    try {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setNeedsMfa(aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2");
    } catch { setNeedsMfa(false); }

    const [{ data: prof }, { data: sub }, { count }] = await Promise.all([
      supabase.from("users_profile").select("name, avatar_url, headline, xp, current_level, tutorial_done").eq("user_id", s.user.id).maybeSingle(),
      supabase.from("subscriptions").select("status, current_period_end, stripe_price_id, metadata").eq("user_id", s.user.id).maybeSingle(),
      supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", s.user.id).eq("is_read", false),
    ]);
    setProfile((prof as Profile) ?? null);
    setTier(tierFromSubscription((sub as Subscription) ?? null, admin));
    setUnreadCount(count ?? 0);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    await loadAll(data.session);
  }, [loadAll]);

  useEffect(() => {
    (async () => { await refresh(); setLoading(false); })();
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); loadAll(s); });
    return () => l.subscription.unsubscribe();
  }, [refresh, loadAll]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null); setProfile(null); setTier("free");
  }, []);

  return (
    <Ctx.Provider value={{ loading, session, profile, tier, isAdmin, needsMfa, unreadCount, refresh, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}
