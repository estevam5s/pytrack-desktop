import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { supabase, openExternal, SITE_URL } from "@/lib/supabase";
import { Card, Spinner } from "@/components/ui";

interface C { slug: string; title: string; description: string; area: string; lessons_count: number; }

export function Conteudos() {
  const { data, isLoading } = useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const { data } = await supabase.from("contents").select("slug, title, description, area, lessons_count").order("order_index").limit(100);
      return (data ?? []) as C[];
    },
  });
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold text-white">Conteúdos</h1>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-2.5">
          {data?.map((c) => (
            <Card key={c.slug} onClick={() => openExternal(`${SITE_URL}/conteudos/${c.slug}`)}>
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-primary-light" />
                <div>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-text-dim line-clamp-2">{c.description}</p>
                  <p className="mt-1 text-[11px] text-text-dim">{c.area} · {c.lessons_count} lições</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
