"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  contentKey: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
};

/**
 * Lightweight read-only version — just renders children.
 * When Supabase admin is wired up later, swap this for the full implementation.
 */
export function EditableText({ children, as, className }: Props) {
  const Tag = (as ?? "span") as ElementType;
  return <Tag className={cn(className)}>{children}</Tag>;
}
