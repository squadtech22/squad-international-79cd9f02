import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type Client = {
  src: string;
  alt: string;
  /** Full company name, shown as the card heading. Falls back to `alt`. */
  name?: string;
  /** What the dedicated team does for this client. */
  engagement?: { label: string; services: string[] };
  url?: string;
  /** The logo is light (e.g. white text), so it sits on a dark background. */
  lightLogo?: boolean;
  /** Height classes for the row logo, for files that read too big or too small at the default. */
  logoSize?: string;
};

const RCM_SERVICES = [
  "Credentialing",
  "Claim Submission",
  "AR Follow Up",
  "Appeals & Denial Handling",
];

const clients: Client[] = [
  {
    src: "/clients/aaa-dme.png",
    alt: "AAA DME",
    name: "AAA DME INC",
    engagement: {
      label: "Dedicated team for a Durable Medical Equipment company",
      services: RCM_SERVICES,
    },
    url: "https://aaadmeinc.com",
  },
  { src: "/clients/atlantic-medical.png", alt: "Atlantic Medical Supply" },
  { src: "/clients/b8-equipment.png", alt: "B8 Equipment" },
  { src: "/clients/baybridge.png", alt: "Baybridge Health Care" },
  {
    src: "/clients/dexsora.png",
    alt: "Dexsora",
    url: "https://dexsora.com",
    logoSize: "max-h-7 md:max-h-9",
  },
  { src: "/clients/Gw.png", alt: "GW" },
  { src: "/clients/MM.png", alt: "Market Magnet" },
  {
    src: "/clients/MissionPrimaryCare.png",
    alt: "Mission Primary Care",
    engagement: { label: "Dedicated team for a healthcare clinic", services: RCM_SERVICES },
    url: "https://m-primarycare.com",
    // The file has wide empty margins around the mark.
    logoSize: "max-h-20 md:max-h-28",
  },
  { src: "/clients/Nexcare.png", alt: "Nexcare" },
  { src: "/clients/Premiere.png", alt: "Premier DME Solutions" },
  {
    src: "/clients/Reshape.png",
    alt: "Reshape Equipment",
    url: "https://reshapeequipments.com",
  },
  {
    src: "/clients/S8.png",
    alt: "S8 Medical Equipment",
    engagement: {
      label: "Dedicated team for a Durable Medical Equipment company",
      services: RCM_SERVICES,
    },
    url: "https://www.s8medicalequipmentllc.com",
  },
  {
    src: "/clients/Shinkyowa.png",
    alt: "Shinkyowa",
    name: "Shin Kyowa International",
    engagement: {
      label: "Dedicated sales and customer team",
      services: ["Sales", "Customer Orders", "Customer Service", "Customer Retention"],
    },
    url: "https://www.shinkyowa.com",
  },
  {
    src: "/clients/Smartbilling.png",
    alt: "Smart Billing",
    url: "https://smartbillinginc.com",
  },
  {
    src: "/clients/Squad International.png",
    alt: "Squad International",
    engagement: {
      label: "Dedicated Teams & Virtual Assistance",
      services: ["Data Entry & Admin Support", "Research", "CRM & Order Processing"],
    },
    url: "https://squadtechsol.com",
    logoSize: "max-h-9 md:max-h-12",
  },
  {
    src: "/clients/Squad Medical.png",
    alt: "Squad Medical Supplies",
    url: "https://squadmedicalsupplies.com",
  },
  { src: "/clients/ZNB.png", alt: "ZNB Solutions" },
];

/**
 * Website screenshot: a PNG in `/clients/previews/` with the logo's file name.
 * If it is missing the card shows the logo instead.
 */
function previewFor(client: Client) {
  return client.src.replace(/^\/clients\//, "/clients/previews/").replace(/\.\w+$/, ".png");
}

function ClientCard({ client }: { client: Client }) {
  const { engagement, url } = client;
  const [previewFailed, setPreviewFailed] = useState(false);

  return (
    <>
      {!previewFailed ? (
        <img
          src={previewFor(client)}
          alt={`${client.alt} website`}
          className="aspect-[16/10] w-full border-b border-border object-cover object-top"
          loading="lazy"
          onError={() => setPreviewFailed(true)}
        />
      ) : (
        <div
          className={`flex aspect-[16/10] w-full items-center justify-center border-b border-border p-8 ${
            client.lightLogo ? "bg-slate-900" : "bg-muted/50"
          }`}
        >
          <img src={client.src} alt="" className="max-h-24 w-3/4 object-contain" />
        </div>
      )}

      <div className="p-4">
        <p className="text-base font-semibold text-foreground">{client.name ?? client.alt}</p>

        {engagement ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground">{engagement.label}</p>
            <ul className="mt-3 space-y-1.5">
              {engagement.services.map((service) => (
                <li key={service} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                  {service}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {url
              ? "A valued client. One-time projects, completed and delivered."
              : "One of the clients we're proud to work with."}
          </p>
        )}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {url.replace(/^https?:\/\/(www\.)?/, "")}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
    </>
  );
}

export function ClientLogos() {
  // Key of the open card. The row keeps scrolling otherwise, which would carry
  // the logo away from its card while the pointer is on the card.
  const [openKey, setOpenKey] = useState<number | null>(null);

  return (
    <section className="border-b border-border bg-background py-10 md:py-16 overflow-hidden">
      <div className="container-page">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by 67+ companies worldwide
        </p>
      </div>

      <div className="review-row mt-10 w-full">
        <div
          className="review-track flex items-center gap-x-12 md:gap-x-16"
          style={openKey !== null ? { animationPlayState: "paused" } : undefined}
        >
          {[...clients, ...clients].map((client, index) => {
            const isDuplicate = index >= clients.length;
            const open = openKey === index;

            return (
              <HoverCard
                key={index}
                open={open}
                onOpenChange={(next) => setOpenKey(next ? index : null)}
                openDelay={150}
                closeDelay={150}
              >
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    aria-label={`About ${client.name ?? client.alt}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : undefined}
                    // Touch screens have no hover, so a tap opens the card too.
                    onClick={() => setOpenKey(open ? null : index)}
                    className={`flex shrink-0 cursor-pointer items-center justify-center transition-all duration-300 ${
                      open
                        ? "opacity-100 grayscale-0"
                        : "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                    }`}
                  >
                    <img
                      src={client.src}
                      alt={client.alt}
                      className={`w-auto object-contain ${
                        client.logoSize ?? "max-h-12 md:max-h-16"
                      } ${
                        client.lightLogo ? "rounded-md bg-slate-900 px-3 py-2" : ""
                      }`}
                      loading="lazy"
                    />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  sideOffset={12}
                  className="w-80 overflow-hidden p-0"
                >
                  <ClientCard client={client} />
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
