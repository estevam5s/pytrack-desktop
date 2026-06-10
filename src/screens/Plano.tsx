import { openExternal, SITE_URL } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PLANS, TIER_LABEL } from "@/lib/billing";
import { Card, Badge, Button } from "@/components/ui";

export function Plano() {
  const { tier } = useAuth();
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">Meu plano</h1>
      <Card>
        <p className="text-xs text-text-dim">Plano atual</p>
        <p className="text-2xl font-bold text-white">{TIER_LABEL[tier]}</p>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => openExternal(`${SITE_URL}/assinar`)}>Assinar / upgrade</Button>
          <Button variant="outline" onClick={() => openExternal(`${SITE_URL}/configuracoes/plano`)}>Gerenciar / cancelar</Button>
        </div>
      </Card>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {PLANS.map((p) => (
          <Card key={p.tier} className={tier === p.tier ? "border-primary/50" : ""}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">{p.name}</p>
              <Badge color={p.tier === "suprema" ? "#E254FF" : "#8234E9"}>{p.price}</Badge>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-text-dim">{p.highlights.map((h) => <li key={h}>• {h}</li>)}</ul>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-text-dim">Novos planos têm 7 dias grátis — você só é cobrado ao fim do período.</p>
    </div>
  );
}
