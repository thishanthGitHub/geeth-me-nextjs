"use client";

import { useQueryClient } from "@tanstack/react-query";

export type SiteContentMap = Record<string, string>;

/**
 * Stub — returns empty map until Supabase is connected.
 * Wire up to supabase `site_content` table when ready.
 */
export function useSiteContent() {
  return { data: {} as SiteContentMap, isLoading: false, error: null };
}

export function useInvalidateContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["site_content"] });
}
