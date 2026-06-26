import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 md:px-12 py-20 grid md:grid-cols-4 gap-10 text-sm max-w-7xl mx-auto border-t border-border mt-8">
      <div className="md:col-span-1">
        <p className="font-display italic text-4xl text-accent">Geeth Me</p>
        <p className="text-xs tracking-[0.25em] text-muted-foreground mt-2 uppercase">
          Sea Food Restaurant — Trincomalee
        </p>
        <p className="mt-6 text-muted-foreground text-xs leading-relaxed">
          Serving the coast since 2004.
        </p>
      </div>

      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Visit</p>
        <p>Trincomalee</p>
        <p>Sri Lanka</p>
        <a href="tel:+94771505771" className="block mt-2 hover:text-accent transition-colors">
          +94 77 150 57 71
        </a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Geeth+Me+Sea+Food+Restaurant+Trincomalee"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs tracking-[0.25em] uppercase text-accent hover:underline"
        >
          Google Maps →
        </a>
      </div>

      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Explore</p>
        <div className="flex flex-col gap-1">
          <Link href="/menu" className="hover:text-accent transition-colors">Full menu</Link>
          <a href="/#gallery" className="hover:text-accent transition-colors">Gallery</a>
          <a href="/#booking" className="hover:text-accent transition-colors">Reservations</a>
          <a href="/#contact" className="hover:text-accent transition-colors">Contact & directions</a>
        </div>
      </div>

      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Follow</p>
        <div className="flex flex-col gap-1">
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">Facebook</a>
          <a href="mailto:hello@geethme.lk" className="hover:text-accent transition-colors">
            hello@geethme.lk
          </a>
        </div>
      </div>

      <p className="md:col-span-4 text-xs text-muted-foreground border-t border-border pt-6 mt-6">
        © {new Date().getFullYear()} Geeth Me Sea Food Restaurant, Trincomalee.
      </p>
      <p className="md:col-span-4 text-xs text-muted-foreground text-center">
        Developed by thishanth —{" "}
        <a href="tel:+94781635547" className="hover:text-accent transition-colors">
          078 163 5547
        </a>
        {" · "}
        <a
          href="https://wa.me/94781635547"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          WhatsApp
        </a>
      </p>
    </footer>
  );
}
