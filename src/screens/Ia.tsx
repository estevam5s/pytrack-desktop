import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, Input, Button } from "@/components/ui";

export function IaSettings() {
  const { session } = useAuth();
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!session?.user) return;
      const { data } = await supabase.from("user_ai_settings").select("provider, model").eq("user_id", session.user.id).maybeSingle();
      if (data) { setProvider((data.provider as string) ?? "openai"); setModel((data.model as string) ?? "gpt-4o-mini"); }
    })();
  }, [session]);

  async function save() {
    if (!session?.user) return;
    setSaving(true); setMsg(null);
    const payload: Record<string, unknown> = { user_id: session.user.id, provider, model };
    if (apiKey.trim()) payload.api_key = apiKey.trim();
    const { error } = await supabase.from("user_ai_settings").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    setMsg(error ? error.message : "Configurações salvas! Sua chave fica protegida por RLS.");
    setApiKey("");
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">IA com a sua chave (BYOK)</h1>
      <Card className="space-y-3">
        <p className="text-sm text-text-dim">Use a sua própria chave para correção de exercícios e consultor. Ela é guardada de forma segura (RLS).</p>
        <div><label className="text-xs text-text-dim">Provedor</label><Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="openai, openrouter, anthropic, nvidia" /></div>
        <div><label className="text-xs text-text-dim">Modelo</label><Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" /></div>
        <div><label className="text-xs text-text-dim">Sua chave de API</label><Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="(em branco mantém a atual)" /></div>
        {msg && <p className="text-xs text-green">{msg}</p>}
        <Button onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </Card>
    </div>
  );
}
