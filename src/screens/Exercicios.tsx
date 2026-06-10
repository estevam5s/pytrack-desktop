import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, Input, Badge, Spinner } from "@/components/ui";

interface Ex { ex_id: string; title: string; category: string; level: string; objective: string; }

export function Exercicios() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["exercises", q],
    queryFn: async () => {
      let query = supabase.from("practice_exercises").select("ex_id, title, category, level, objective").order("order_index").limit(80);
      if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
      const { data } = await query;
      return (data ?? []) as Ex[];
    },
  });
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold text-white">Exercícios</h1>
      <p className="mb-4 text-sm text-text-dim">+5.000 exercícios cobrindo todo o ecossistema Python.</p>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-dim" />
        <Input placeholder="Buscar exercícios..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-2.5">
          {data?.map((e) => (
            <Card key={e.ex_id}>
              <p className="font-semibold text-white">{e.title}</p>
              <p className="text-xs text-text-dim line-clamp-2">{e.objective}</p>
              <div className="mt-2 flex gap-1.5">
                <Badge color="#29E0A9">{e.level}</Badge>
                <Badge color="#5F75F2">{e.category}</Badge>
              </div>
            </Card>
          ))}
          {data?.length === 0 && <p className="py-8 text-center text-text-dim">Nenhum exercício encontrado.</p>}
        </div>
      )}
    </div>
  );
}
