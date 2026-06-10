import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, Spinner } from "@/components/ui";

interface N { id: string; title: string; body: string | null; is_read: boolean; created_at: string; }

export function Notificacoes() {
  const { session, refresh } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["notifs"],
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("id, title, body, is_read, created_at").order("created_at", { ascending: false }).limit(100);
      return (data ?? []) as N[];
    },
  });
  useEffect(() => {
    (async () => {
      if (session?.user) {
        await supabase.from("notifications").update({ is_read: true }).eq("user_id", session.user.id).eq("is_read", false);
        refresh();
      }
    })();
  }, [session, refresh]);
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">Notificações</h1>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-2.5">
          {data?.map((n) => (
            <Card key={n.id}>
              <div className="flex gap-3">
                <Bell className="h-5 w-5 text-primary-light" />
                <div className="flex-1">
                  <p className="font-semibold text-white">{n.title}</p>
                  {n.body && <p className="text-sm text-text-dim">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-text-dim">{new Date(n.created_at).toLocaleString("pt-BR")}</p>
                </div>
                {!n.is_read && <div className="h-2.5 w-2.5 rounded-full bg-red-500" />}
              </div>
            </Card>
          ))}
          {data?.length === 0 && <p className="py-8 text-center text-text-dim">Sem notificações ainda.</p>}
        </div>
      )}
    </div>
  );
}
