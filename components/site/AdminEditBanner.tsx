"use client";

import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-menu";

export function AdminEditBanner() {
  const { data: isAdmin } = useIsAdmin();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("admin-edit-banner-dismissed") === "1");
  }, []);

  if (!isAdmin || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[92vw]">
      <div className="flex items-center gap-3 rounded-full bg-accent text-accent-foreground px-4 py-2 shadow-lg shadow-accent/30 text-xs">
        <Pencil size={14} />
        <span className="font-medium">Edit mode:</span>
        <span className="opacity-90">click any text to edit · Shift+Click to reset</span>
        <button
          onClick={() => {
            sessionStorage.setItem("admin-edit-banner-dismissed", "1");
            setDismissed(true);
          }}
          className="ml-1 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
