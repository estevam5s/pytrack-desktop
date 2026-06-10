import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase, openExternal, SITE_URL } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { tierAtLeast } from "@/lib/billing";
import { Card, Badge, Button, Spinner } from "@/components/ui";

interface Post { id: string; content: string; category: string | null; likes_count: number; comments_count: number; }

export function Comunidade() {
  const { tier } = useAuth();
  const allowed = tierAtLeast(tier, "completo");
  const { data, isLoading } = useQuery({
    queryKey: ["feed"], enabled: allowed,
    queryFn: async () => {
      const { data } = await supabase.from("community_posts").select("id, content, category, likes_count, comments_count").order("created_at", { ascending: false }).limit(40);
      return (data ?? []) as Post[];
    },
  });
  if (!allowed) return (
    <div className="mx-auto max-w-md p-8 text-center">
      <Lock className="mx-auto h-8 w-8 text-primary-light" />
      <p className="mt-3 text-lg font-bold text-white">Comunidade é do plano Completo+</p>
      <p className="mb-4 text-sm text-text-dim">Conecte-se com outros devs Python.</p>
      <Button onClick={() => openExternal(`${SITE_URL}/assinar`)}>Fazer upgrade</Button>
    </div>
  );
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">Comunidade</h1>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-3">
          {data?.map((p) => (
            <Card key={p.id}>
              {p.category === "vaga" && <div className="mb-2"><Badge color="#29E0A9">💼 Vaga</Badge></div>}
              <div className="chat-md text-sm text-zinc-200"><ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown></div>
              <div className="mt-3 flex gap-4 text-xs text-text-dim">
                <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {p.likes_count}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {p.comments_count}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
