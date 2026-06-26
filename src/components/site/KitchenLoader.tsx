import { motion } from "framer-motion";
import { Flame } from "lucide-react";

type Props = {
  label?: string;
  fullscreen?: boolean;
  size?: "sm" | "md" | "lg";
};

/**
 * Branded loader — three dancing flames + optional pulsing label.
 * Use in place of spinners for any in-app loading state.
 */
export function KitchenLoader({ label = "Lighting the stove…", fullscreen = false, size = "md" }: Props) {
  const dot = size === "lg" ? "w-3 h-3" : size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  const iconSize = size === "lg" ? 28 : size === "sm" ? 14 : 20;

  const inner = (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative flex items-end gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`${dot} rounded-full bg-accent`}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
          />
        ))}
        <motion.span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-accent"
          animate={{ rotate: [-6, 6, -6], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame size={iconSize} strokeWidth={1.6} />
        </motion.span>
      </div>
      {label && (
        <motion.p
          className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background">
        {inner}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-16">{inner}</div>;
}
