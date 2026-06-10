import { useParams, useNavigate } from "react-router-dom";
import { TRILHAS } from "@/lib/trilhas";
import { useAuth } from "@/hooks/useAuth";
import { tierAtLeast, TIER_LABEL } from "@/lib/billing";
import { Card, Badge, Button } from "@/components/ui";

export function TrilhaDetalhe() {
  const { id } = useParams();
  const { tier } = useAuth();
  const nav = useNavigate();
  const t = TRILHAS.find((x) => x.id === id);
  if (!t) return <div className="p-8 text-text-dim">Trilha não encontrada.</div>;
  const locked = !tierAtLeast(tier, t.tier);
  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="h-1.5 rounded" style={{ background: t.accent }} />
      <h1 className="mt-4 text-2xl font-bold text-white">{t.title}</h1>
      <p className="text-text-dim">{t.subtitle}</p>
      <div className="mt-2 flex gap-2">
        <Badge color={t.accent}>{t.level}</Badge>
        <Badge color="#a1a1aa">{t.tier === "free" ? "Grátis" : TIER_LABEL[t.tier]}</Badge>
        <Badge color="#5F75F2">{t.topicsCount} tópicos</Badge>
      </div>
      <Card className="mt-5">
        {locked ? (
          <>
            <p className="font-bold text-white">🔒 Exclusivo do plano {TIER_LABEL[t.tier]}</p>
            <p className="mb-3 text-sm text-text-dim">Faça upgrade para acessar.</p>
            <Button onClick={() => nav("/plano")}>Fazer upgrade</Button>
          </>
        ) : (
          <>
            <p className="mb-3 font-bold text-white">Pronto para começar?</p>
            <Button onClick={() => nav("/conteudos")}>Começar / Continuar</Button>
          </>
        )}
      </Card>
    </div>
  );
}
