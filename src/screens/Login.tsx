import { useState } from "react";
import { supabase, openExternal, SITE_URL } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";

export function Login() {
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    await refresh();
  }

  async function github() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${SITE_URL}/auth/callback`, skipBrowserRedirect: true },
    });
    if (error) { setError(error.message); return; }
    if (data?.url) openExternal(data.url);
  }

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <div className="mb-6 flex flex-col items-center">
          <img src="/logo.png" alt="PyTrack" className="h-16 w-16 rounded-2xl" />
          <h1 className="mt-3 text-2xl font-bold text-white">PyTrack</h1>
          <p className="text-sm text-text-dim">Domine todo o ecossistema Python 🐍</p>
        </div>
        <form onSubmit={signIn} className="space-y-3">
          <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Entrando..." : "Entrar"}</Button>
          <Button variant="outline" onClick={github} className="w-full">Entrar com GitHub</Button>
        </form>
        <div className="mt-5 text-center text-sm text-text-dim">
          <button onClick={() => openExternal(`${SITE_URL}/auth/register`)} className="hover:text-primary-light">
            Ainda não tem conta? <span className="font-semibold text-primary-light">Criar no site</span>
          </button>
        </div>
        <div className="mt-2 text-center">
          <button onClick={() => openExternal(SITE_URL)} className="text-xs text-text-dim hover:text-white">Conheça a PyTrack →</button>
        </div>
      </div>
    </div>
  );
}
