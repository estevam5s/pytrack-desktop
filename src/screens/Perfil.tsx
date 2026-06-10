import { useAuth } from "@/hooks/useAuth";
import { Card, Badge } from "@/components/ui";
import { TIER_LABEL } from "@/lib/billing";

export function Perfil() {
  const { profile, tier, session } = useAuth();
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">Perfil</h1>
      <Card>
        <div className="flex items-center gap-4">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} className="h-16 w-16 rounded-full" />
            : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">{(profile?.name ?? "P")[0].toUpperCase()}</div>}
          <div>
            <p className="text-xl font-bold text-white">{profile?.name ?? "Estudante"}</p>
            <p className="text-xs text-text-dim">{session?.user.email}</p>
            {profile?.headline && <p className="text-xs text-text-dim">{profile.headline}</p>}
            <div className="mt-1"><Badge color="#9956F6">Plano {TIER_LABEL[tier]}</Badge></div>
          </div>
        </div>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card><p className="text-2xl font-bold text-primary-light">{profile?.xp ?? 0}</p><p className="text-xs text-text-dim">XP</p></Card>
        <Card><p className="text-2xl font-bold text-green">{profile?.current_level ?? "básico"}</p><p className="text-xs text-text-dim">Nível</p></Card>
      </div>
    </div>
  );
}
