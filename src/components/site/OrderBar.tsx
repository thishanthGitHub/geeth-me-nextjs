import { useState } from "react";
import { ShoppingBag, ChevronUp } from "lucide-react";
import { fmtLKR, useOrder } from "@/lib/order";
import { OrderSheet } from "./OrderSheet";

export function OrderBar() {
  const { count, total } = useOrder();
  const [open, setOpen] = useState(false);

  return (
    <>
      {count > 0 && !open && <div aria-hidden className="h-24" />}
      {count > 0 && !open && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 pointer-events-none bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="mx-auto max-w-md flex justify-center">
            <button
              onClick={() => setOpen(true)}
              aria-label={`Review order: ${count} items, total ${fmtLKR(total)}`}
              className="pointer-events-auto w-full inline-flex items-center justify-between gap-3 rounded-full bg-accent text-accent-foreground pl-3 pr-4 py-3 text-sm font-medium shadow-2xl hover:opacity-95 transition-all min-h-12"
            >
              <span className="flex items-center gap-3">
                <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-foreground/15">
                  <ShoppingBag size={16} className="icon-wiggle-hover" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-destructive text-[10px] font-bold inline-flex items-center justify-center text-destructive-foreground">
                    {count}
                  </span>
                </span>
                <span className="flex flex-col items-start leading-tight text-left">
                  <span>Review order</span>
                  <span className="text-[11px] font-normal opacity-80 tabular-nums">{fmtLKR(total)} · then show QR</span>
                </span>
              </span>
              <ChevronUp size={18} className="opacity-80" />
            </button>
          </div>
        </div>
      )}
      <OrderSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
