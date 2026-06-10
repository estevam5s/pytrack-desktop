import { useNavigate } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";
import { TRILHAS } from "@/lib/trilhas";
import { useAuth } from "@/hooks/useAuth";
import { tierAtLeast, TIER_LABEL } from "@/lib/billing";
import { Card, Badge } from "@/components/ui";

export function Trilhas() {
  const { tier } = useAuth();
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold text-white">Trilhas</h1>
      <p className="mb-5 text-sm text-text-dim">17 trilhas por nível e plano.</p>
      <div className="grid grid-cols-2 gap-3">
        {TRILHAS.map((t) => {
          const locked = !tierAtLeast(tier, t.tier);
          return (
            <Card key={t.id} onClick={() => nav(`/trilhas/${t.id}`)}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-2 rounded" style={{ background: t.accent }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{t.title}</p>
                    {locked && <Lock className="h-3.5 w-3.5 text-text-dim" />}
                  </div>
                  <p className="text-xs text-text-dim">{t.subtitle}</p>
                  <div className="mt-2 flex gap-1.5">
                    <Badge color={t.accent}>{t.level}</Badge>
                    <Badge color="#a1a1aa">{t.tier === "free" ? "Grátis" : TIER_LABEL[t.tier]}</Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-text-dim" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
