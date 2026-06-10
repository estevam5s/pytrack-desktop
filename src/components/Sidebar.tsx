import { NavLink } from "react-router-dom";
import {
  Home, Route, Code2, Users, BarChart3, Layers, Bell, User, Settings, CreditCard,
  Sparkles, FileText, Puzzle, MessagesSquare, Briefcase, ShieldCheck, LogOut, BookOpen, Terminal,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { openExternal, SITE_URL } from "@/lib/supabase";

const GROUPS: { title: string; items: { to: string; label: string; icon: typeof Home; adminOnly?: boolean }[] }[] = [
  {
    title: "Estudar",
    items: [
      { to: "/inicio", label: "Início", icon: Home },
      { to: "/trilhas", label: "Trilhas", icon: Route },
      { to: "/exercicios", label: "Exercícios", icon: Code2 },
      { to: "/ide", label: "IDE Python", icon: Terminal },
      { to: "/conteudos", label: "Conteúdos", icon: BookOpen },
      { to: "/comunidade", label: "Comunidade", icon: Users },
      { to: "/evolucao", label: "Evolução", icon: BarChart3 },
      { to: "/stack", label: "Stack", icon: Layers },
    ],
  },
  {
    title: "Carreira",
    items: [
      { to: "/curriculo", label: "Currículo", icon: FileText },
      { to: "/extensao", label: "Extensão VS Code", icon: Puzzle },
      { to: "/entrevista-ia", label: "Entrevista IA", icon: MessagesSquare },
      { to: "/vagas", label: "Vagas", icon: Briefcase },
    ],
  },
  {
    title: "Conta",
    items: [
      { to: "/notificacoes", label: "Notificações", icon: Bell },
      { to: "/perfil", label: "Perfil", icon: User },
      { to: "/plano", label: "Meu plano", icon: CreditCard },
      { to: "/ia", label: "IA (sua chave)", icon: Sparkles },
      { to: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { profile, isAdmin, unreadCount, signOut } = useAuth();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 py-4">
        <img src="/logo.png" alt="PyTrack" className="h-8 w-8 rounded-lg" />
        <span className="text-lg font-bold text-white">PyTrack</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {GROUPS.map((g) => (
          <div key={g.title} className="mb-3">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-dim">{g.title}</p>
            {g.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary/15 text-primary-light" : "text-zinc-300 hover:bg-surface-2"
                  }`
                }
              >
                <it.icon className="h-4 w-4" />
                <span className="flex-1">{it.label}</span>
                {it.to === "/notificacoes" && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {isAdmin && (
          <div className="mb-3">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-dim">Admin</p>
            {[
              { path: "/admin/clientes", label: "Clientes & receita" },
              { path: "/admin/moderacao", label: "Moderação" },
              { path: "/admin/mensagens", label: "Mensagens" },
              { path: "/admin/extensao", label: "Extensão VS Code" },
            ].map((a) => (
              <button key={a.path} onClick={() => openExternal(`${SITE_URL}${a.path}`)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-surface-2">
                <ShieldCheck className="h-4 w-4" /> {a.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {(profile?.name ?? "P")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{profile?.name ?? "Estudante"}</p>
            <p className="truncate text-[10px] text-text-dim">{profile?.xp ?? 0} XP</p>
          </div>
        </div>
        <button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-surface-2">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </aside>
  );
}
