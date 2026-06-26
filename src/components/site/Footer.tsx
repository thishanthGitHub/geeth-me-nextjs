import { EditableText } from "@/components/site/EditableText";

export function Footer() {
  return (
    <footer id="contact" className="px-6 md:px-12 py-20 grid md:grid-cols-4 gap-10 text-sm max-w-7xl mx-auto">
      <div className="md:col-span-1">
        <p className="font-display italic text-4xl text-accent">
          <EditableText contentKey="footer.brand">Geeth Me</EditableText>
        </p>
        <p className="text-xs tracking-[0.25em] text-muted-foreground mt-2 uppercase">
          <EditableText contentKey="footer.tagline">Sea Food Restaurant — Trincomalee</EditableText>
        </p>
        <p className="mt-6 text-muted-foreground text-xs leading-relaxed">
          <EditableText contentKey="footer.since">Serving the coast since 2004.</EditableText>
        </p>
      </div>
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
          <EditableText contentKey="footer.visit.label">Visit</EditableText>
        </p>
        <p><EditableText contentKey="footer.visit.line1">Trincomalee</EditableText></p>
        <p><EditableText contentKey="footer.visit.line2">Sri Lanka</EditableText></p>
        <a href="tel:+94771505771" className="block mt-2 hover:text-accent transition-colors">
          <EditableText contentKey="footer.phone">+94 77 150 57 71</EditableText>
        </a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Geeth+Me+Sea+Food+Restaurant+Trincomalee"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs tracking-[0.25em] uppercase text-accent hover:underline"
        >
          <EditableText contentKey="footer.maps">Google Maps →</EditableText>
        </a>
      </div>
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
          <EditableText contentKey="footer.explore.label">Explore</EditableText>
        </p>
        <div className="flex flex-col gap-1">
          <a href="#menu" className="hover:text-accent transition-colors"><EditableText contentKey="footer.explore.menu">Full menu</EditableText></a>
          <a href="#gallery" className="hover:text-accent transition-colors"><EditableText contentKey="footer.explore.gallery">Gallery</EditableText></a>
          <a href="#booking" className="hover:text-accent transition-colors"><EditableText contentKey="footer.explore.reserve">Reservations</EditableText></a>
          <a href="#contact" className="hover:text-accent transition-colors"><EditableText contentKey="footer.explore.contact">Contact & directions</EditableText></a>
        </div>
      </div>
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
          <EditableText contentKey="footer.follow.label">Follow</EditableText>
        </p>
        <div className="flex flex-col gap-1">
          <a href="#" className="hover:text-accent transition-colors"><EditableText contentKey="footer.follow.ig">Instagram</EditableText></a>
          <a href="#" className="hover:text-accent transition-colors"><EditableText contentKey="footer.follow.fb">Facebook</EditableText></a>
          <a href="#" className="hover:text-accent transition-colors"><EditableText contentKey="footer.follow.email">hello@geethme.lk</EditableText></a>
        </div>
      </div>
      <p className="md:col-span-4 text-xs text-muted-foreground border-t border-border pt-6 mt-6">
        © {new Date().getFullYear()} <EditableText contentKey="footer.copyright">Geeth Me Sea Food Restaurant, Trincomalee.</EditableText>
      </p>
      <p className="md:col-span-4 text-xs text-muted-foreground text-center">
        Developed by thishanth — <a href="tel:+94781635547" className="hover:text-accent transition-colors">078 163 5547</a>
      </p>
    </footer>
  );
}
