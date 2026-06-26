import React, { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-menu";
import { useInvalidateContent, useSiteContent } from "@/hooks/use-site-content";
import { cn } from "@/lib/utils";

type Props = {
  /** Unique key, e.g. "hero.title". Used as DB primary key. */
  contentKey: string;
  /** Fallback content when no override exists in DB. */
  children: ReactNode;
  /** Render as which HTML element. Defaults to span. */
  as?: ElementType;
  className?: string;
  /** If true, allow multi-line editing (Enter inserts newline). */
  multiline?: boolean;
};

/**
 * Wix-style click-to-edit. Renders the override from `site_content` if present,
 * otherwise the default children. When an admin is signed in, hovering shows an
 * outline; clicking turns the node into a contentEditable field. Blur saves.
 */
export function EditableText({
  contentKey,
  children,
  as,
  className,
  multiline = false,
}: Props) {
  const Tag = (as ?? "span") as ElementType;
  const { data: isAdmin } = useIsAdmin();
  const { data: content } = useSiteContent();
  const invalidate = useInvalidateContent();
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const override = content?.[contentKey];
  const defaultText =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : "";

  // When not editing, render override (string) or original children (JSX/string).
  const display = override ?? children;

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // Place caret at end
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  const save = async () => {
    if (!ref.current) return;
    const newValue = (multiline ? ref.current.innerText : ref.current.textContent ?? "").trim();
    setEditing(false);
    const current = override ?? defaultText;
    if (newValue === current) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: contentKey, value: newValue }, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast.error(`Couldn't save: ${error.message}`);
      return;
    }
    toast.success("Saved");
    invalidate();
  };

  const reset = async () => {
    if (!confirm("Reset to original text?")) return;
    setSaving(true);
    const { error } = await supabase.from("site_content").delete().eq("key", contentKey);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Reset");
    invalidate();
  };

  if (!isAdmin) {
    return <Tag className={className}>{display}</Tag>;
  }

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "relative outline-none transition",
        !editing &&
          "cursor-text rounded-sm ring-1 ring-transparent hover:ring-accent/60 hover:bg-accent/5",
        editing && "ring-2 ring-accent bg-accent/10 rounded-sm",
        saving && "opacity-60",
        className,
      )}
      contentEditable={editing}
      suppressContentEditableWarning
      title={
        editing
          ? "Click outside to save · Esc to cancel"
          : `Click to edit · ${contentKey}${override ? " (overridden — Shift+Click to reset)" : ""}`
      }
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (!editing) {
          if (e.shiftKey && override) {
            e.preventDefault();
            reset();
            return;
          }
          e.preventDefault();
          setEditing(true);
        }
      }}
      onBlur={() => {
        if (editing) save();
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!editing) return;
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) ref.current.textContent = override ?? defaultText;
          setEditing(false);
        } else if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    >
      {display}
    </Tag>
  );
}
