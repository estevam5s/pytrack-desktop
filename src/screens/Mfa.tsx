import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";

export function Mfa() {
  const { refresh, signOut } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if (!totp) throw new Error("Nenhum fator TOTP encontrado.");
      const { data: ch } = await supabase.auth.mfa.challenge({ factorId: totp.id });
      if (!ch) throw new Error("Falha no desafio.");
      const { error } = await supabase.auth.mfa.verify({ factorId: totp.id, challengeId: ch.id, code });
      if (error) throw error;
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <form onSubmit={verify} className="w-full max-w-sm space-y-3 rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-xl font-bold text-white">Verificação em 2 etapas</h1>
        <p className="text-sm text-text-dim">Digite o código do seu app autenticador.</p>
        <Input inputMode="numeric" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">Verificar</Button>
        <Button variant="outline" onClick={signOut} className="w-full">Sair</Button>
      </form>
    </div>
  );
}
