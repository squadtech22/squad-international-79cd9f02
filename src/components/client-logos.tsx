export function ClientLogos() {
  const logos = [
    { src: "/clients/aaa-dme.png", alt: "AAA DME" },
    { src: "/clients/atlantic-medical.png", alt: "Atlantic Medical" },
    { src: "/clients/b8-equipment.png", alt: "B8 Equipment" },
    { src: "/clients/baybridge.png", alt: "Baybridge" },
    // { src: "/clients/dexsora.png", alt: "Dexsora" },
    { src: "/clients/Gw.png", alt: "GW" },
    { src: "/clients/MM.png", alt: "MM" },
    { src: "/clients/Nexcare.png", alt: "Nexcare" },
    { src: "/clients/Premiere.png", alt: "Premiere" },
    { src: "/clients/Reshape.png", alt: "Reshape" },
    { src: "/clients/S8.png", alt: "S8" },
    { src: "/clients/Shinkyowa.png", alt: "Shinkyowa" },
    { src: "/clients/Smartbilling.png", alt: "Smartbilling" },
    { src: "/clients/Squad International.png", alt: "Squad International" },
    { src: "/clients/Squad Medical.png", alt: "Squad Medical" },
    { src: "/clients/ZNB.png", alt: "ZNB" },
  ];

  return (
    <section className="border-b border-border bg-background py-10 md:py-16 overflow-hidden">
      <div className="container-page">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by 67+ companies worldwide
        </p>
      </div>

      <div className="review-row mt-10 w-full">
        <div className="review-track flex items-center gap-x-12 md:gap-x-16">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex shrink-0 items-center justify-center opacity-70 transition-all duration-300 hover:opacity-100 grayscale hover:grayscale-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-12 w-auto object-contain md:max-h-16"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
