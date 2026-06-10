import { ExternalLink, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { openExternal, SITE_URL } from "@/lib/supabase";
import { tierAtLeast, TIER_LABEL, type Tier } from "@/lib/billing";
import { Card, Button } from "@/components/ui";

export function Placeholder({ title, web, min }: { title: string; web: string; min: Tier }) {
  const { tier } = useAuth();
  const locked = !tierAtLeast(tier, min);
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <Card className="mt-5">
        {locked ? (
          <>
            <Lock className="h-7 w-7 text-primary-light" />
            <p className="mt-3 font-bold text-white">Recurso do plano {TIER_LABEL[min]}</p>
            <p className="mb-3 text-sm text-text-dim">Faça upgrade para acessar {title.toLowerCase()}.</p>
            <Button onClick={() => openExternal(`${SITE_URL}/assinar`)}>Fazer upgrade</Button>
          </>
        ) : (
          <>
            <p className="font-bold text-white">{title}</p>
            <p className="mb-3 text-sm text-text-dim">Abra esta seção na plataforma web para a experiência completa.</p>
            <Button onClick={() => openExternal(`${SITE_URL}${web}`)}>Abrir na web <ExternalLink className="h-4 w-4" /></Button>
          </>
        )}
      </Card>
    </div>
  );
}
