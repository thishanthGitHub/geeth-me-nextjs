"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu as MenuIcon, X, QrCode } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reserve", href: "/#booking" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-5 backdrop-blur-md bg-background/40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="font-display italic text-xl sm:text-2xl md:text-3xl text-accent tracking-tight whitespace-nowrap">
            Geeth Me
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1 whitespace-nowrap">
            Since 2004
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-8 mx-auto">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-display text-base text-accent hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent hover:after:w-full after:transition-all whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs tracking-[0.25em] uppercase hover:text-accent transition-colors"
          >
            <QrCode size={14} className="icon-pulse" /> Order
          </Link>
          <ThemeToggle />
          <button
            aria-label="Open navigation menu"
            onClick={() => setOpen((o) => !o)}
            className="xl:hidden relative h-9 w-9 inline-flex items-center justify-center rounded-full border border-border bg-card/60 text-accent hover:border-accent hover:bg-accent/10 active:scale-95 transition-all overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <X size={18} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="m"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <MenuIcon size={18} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-40"
            onClick={() => setOpen(false)}
          >
            <nav className="flex flex-col gap-8 text-center font-display text-4xl md:text-6xl">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
