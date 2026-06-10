// Lógica de plano espelhando o site (lib/billing-access.ts).
export type Tier = "free" | "essencial" | "completo" | "suprema" | "vitalicio";

export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  essencial: 1,
  completo: 2,
  suprema: 3,
  vitalicio: 4,
};

export const TIER_LABEL: Record<Tier, string> = {
  free: "Gratuito",
  essencial: "Essencial",
  completo: "Completo",
  suprema: "Suprema",
  vitalicio: "Vitalício",
};

export function tierAtLeast(tier: Tier, min: Tier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[min];
}

// preços (mês) p/ exibição
export const PLANS: { tier: Tier; name: string; price: string; highlights: string[] }[] = [
  { tier: "essencial", name: "Essencial", price: "R$10/mês", highlights: ["5 trilhas Essencial", "Exercícios com IA", "IDE no navegador"] },
  { tier: "completo", name: "Completo", price: "R$19/mês", highlights: ["Comunidade + Carreira", "9 trilhas Completo", "Gerador de currículo"] },
  { tier: "suprema", name: "Suprema", price: "R$46/mês", highlights: ["Extensão VS Code", "Entrevista com IA + API", "Trilha Python Mastery"] },
  { tier: "vitalicio", name: "Vitalício", price: "R$697 único", highlights: ["Tudo do Suprema", "Pagamento único", "Acesso para sempre"] },
];

export interface Subscription {
  status: string;
  current_period_end: string | null;
  stripe_price_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

// price IDs conhecidos → tier (espelha o site)
const PRICE_TIER: Record<string, Tier> = {};

export function tierFromSubscription(sub: Subscription | null, isAdmin = false): Tier {
  if (isAdmin) return "vitalicio";
  if (!sub) return "free";
  const active = ["active", "trialing", "past_due"].includes(sub.status);
  if (!active) return "free";
  const meta = (sub.metadata?.tier as Tier) || undefined;
  if (meta && meta in TIER_RANK) return meta;
  if (sub.stripe_price_id && PRICE_TIER[sub.stripe_price_id]) return PRICE_TIER[sub.stripe_price_id];
  return "essencial";
}

export const ADMIN_EMAILS = ["contato@estevamsouza.com.br", "estevamsouzalaureth@gmail.com"];
export const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
