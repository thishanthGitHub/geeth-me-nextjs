import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MENU as STATIC_MENU, type MenuSection } from "@/data/menu";
import { useAuth } from "@/lib/auth";

export type DbSection = {
  id: string;
  title: string;
  note: string | null;
  image_key: string | null;
  sort_order: number;
};

export type DbItem = {
  id: string;
  section_id: string;
  n: number;
  name: string;
  price: number | null;
  price_s: number | null;
  price_r: number | null;
  sort_order: number;
};

export function dbToMenu(sections: DbSection[], items: DbItem[]): MenuSection[] {
  return sections
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      id: s.id,
      title: s.title,
      note: s.note ?? undefined,
      items: items
        .filter((i) => i.section_id === s.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({
          n: i.n,
          name: i.name,
          price:
            i.price != null
              ? Number(i.price)
              : { s: Number(i.price_s ?? 0), r: Number(i.price_r ?? 0) },
        })),
    }));
}

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async (): Promise<MenuSection[]> => {
      const [sectionsRes, itemsRes] = await Promise.all([
        supabase.from("menu_sections").select("*"),
        supabase.from("menu_items").select("*"),
      ]);
      if (sectionsRes.error || itemsRes.error) {
        // Fallback to static seed on error so the site never blanks out
        return STATIC_MENU;
      }
      const sections = (sectionsRes.data ?? []) as DbSection[];
      const items = (itemsRes.data ?? []) as DbItem[];
      if (sections.length === 0) return STATIC_MENU;
      return dbToMenu(sections, items);
    },
    staleTime: 60_000,
    placeholderData: STATIC_MENU,
  });
}

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id ?? null],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });
}
