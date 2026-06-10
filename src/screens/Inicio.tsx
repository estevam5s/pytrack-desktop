import { useNavigate } from "react-router-dom";
import { Crown, FileText, Puzzle, MessagesSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, Badge, Button } from "@/components/ui";
import { TIER_LABEL, tierAtLeast, type Tier } from "@/lib/billing";

export function Inicio() {
  const { profile, tier } = useAuth();
  const nav = useNavigate();

  const shortcuts: { label: string; icon: typeof FileText; to: string; min: Tier }[] = [
    { label: "Currículo", icon: FileText, to: "/curriculo", min: "completo" },
    { label: "Entrevista IA", icon: MessagesSquare, to: "/entrevista-ia", min: "suprema" },
    { label: "Extensão VS Code", icon: Puzzle, to: "/extensao", min: "suprema" },
    { label: "IA (sua chave)", icon: Sparkles, to: "/ia", min: "free" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-dim">Olá,</p>
          <h1 className="text-3xl font-bold text-white">{profile?.name ?? "Estudante"} 🐍</h1>
        </div>
        <Badge color={tier === "suprema" || tier === "vitalicio" ? "#E254FF" : "#8234E9"}>Plano {TIER_LABEL[tier]}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card><p className="text-3xl font-bold text-primary-light">{profile?.xp ?? 0}</p><p className="text-xs text-text-dim">XP</p></Card>
        <Card><p className="text-3xl font-bold text-green">{profile?.current_level ?? "básico"}</p><p className="text-xs text-text-dim">Nível</p></Card>
        <Card><p className="text-3xl font-bold text-white">17</p><p className="text-xs text-text-dim">Trilhas</p></Card>
      </div>

      {tier === "free" && (
        <Card onClick={() => nav("/plano")} className="mt-4 border-primary/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Você está no plano grátis</p>
              <p className="text-sm text-text-dim">Desbloqueie todas as trilhas, comunidade e carreira. 7 dias grátis.</p>
            </div>
            <Crown className="h-6 w-6 text-primary-light" />
          </div>
        </Card>
      )}

      <h2 className="mt-8 mb-3 text-lg font-bold text-white">Atalhos</h2>
      <div className="grid grid-cols-4 gap-4">
        {shortcuts.map((s) => {
          const locked = !tierAtLeast(tier, s.min);
          return (
            <Card key={s.label} onClick={() => nav(s.to)}>
              <s.icon className={`h-6 w-6 ${locked ? "text-text-dim" : "text-primary-light"}`} />
              <p className="mt-3 font-semibold text-white">{s.label}</p>
              <p className="text-xs text-text-dim">{locked ? `🔒 ${TIER_LABEL[s.min]}` : "Disponível"}</p>
            </Card>
          );
        })}
      </div>

      <Card onClick={() => nav("/trilhas")} className="mt-6">
        <p className="font-bold text-white">Continuar estudando →</p>
        <p className="text-sm text-text-dim">17 trilhas cobrindo todo o ecossistema Python.</p>
      </Card>
    </div>
  );
}
