"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import type { MenuSection } from "@/lib/menu-types";

/**
 * Client hook — fetches menu from /api/menu (reads menu.txt on the server).
 * Pass initialData from a Server Component for zero-loading-state on first render.
 */
export function useMenu(initialData?: MenuSection[]) {
  return useQuery<MenuSection[]>({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load menu");
      return res.json();
    },
    staleTime: 60_000,
    placeholderData: initialData,
    initialData,
  });
}

/**
 * Returns true if the currently signed-in user has the admin role in Supabase.
 * Returns false when Supabase is not configured or user is not signed in.
 */
export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id ?? null],
    queryFn: async () => {
      if (!user) return false;
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (error) return false;
        return !!data;
      } catch {
        return false;
      }
    },
    enabled: !!user,
    initialData: false,
  });
}
