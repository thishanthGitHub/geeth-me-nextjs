const words = ["Seafood", "Geeth Me", "Devilled", "Trincomalee", "Koththu", "Since 2004"];

export function Marquee() {
  const loop = [...words, ...words, ...words, ...words];
  return (
    <section className="border-y border-border py-8 md:py-12 overflow-hidden">
      <div className="marquee-track gap-16 md:gap-24">
        {loop.map((w, i) => (
          <span
            key={i}
            className={`font-display text-4xl md:text-7xl uppercase whitespace-nowrap ${
              i % 3 === 0 ? "text-foreground" : i % 3 === 1 ? "text-muted-foreground" : "text-accent italic"
            }`}
          >
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
