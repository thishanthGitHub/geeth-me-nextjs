import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContentMap = Record<string, string>;

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async (): Promise<SiteContentMap> => {
      const { data, error } = await supabase.from("site_content").select("key,value");
      if (error || !data) return {};
      const map: SiteContentMap = {};
      for (const row of data) map[row.key] = row.value;
      return map;
    },
    staleTime: 30_000,
  });
}

export function useInvalidateContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["site_content"] });
}
