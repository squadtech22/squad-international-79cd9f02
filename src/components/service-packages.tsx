import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/site-data";

export function ServicePackages({ service }: { service: Service }) {
  const packages = service.packages;
  if (!packages) return null;

  return (
    <section className="container-page py-16 md:py-20" aria-labelledby="packages-heading">
      <h2 id="packages-heading" className="text-3xl text-charcoal">Packages</h2>
      <p className="mt-4 text-muted-foreground">
        Compare Small, Medium and Large packages for {service.title.toLowerCase()}.
        Prices are total project fees.
      </p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[660px] border-collapse text-left text-sm">
          <caption className="sr-only">{service.title} package comparison</caption>
          <thead className="bg-charcoal text-offwhite">
            <tr>
              <th scope="col" className="p-5 font-medium">Features</th>
              {packages.tiers.map((tier) => (
                <th key={tier.name} scope="col" className="p-5 text-center">
                  <span className="text-marigold">{tier.name}</span>
                  <span className="mt-2 block text-2xl">{tier.price}</span>
                  <span className="text-xs font-normal text-offwhite/70">total</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packages.features.map((feature) => (
              <tr key={feature.label} className="border-t border-border odd:bg-muted/50">
                <th scope="row" className="px-5 py-4 font-medium text-charcoal">{feature.label}</th>
                {feature.values.map((value, index) => (
                  <td key={index} className="px-5 py-4 text-center text-muted-foreground">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-card">
              <th scope="row" className="p-5"><span className="sr-only">Request a quote</span></th>
              {packages.tiers.map((tier) => (
                <td key={tier.name} className="p-5 text-center">
                  <BookingDialog
                    initialService={service.title}
                    initialNotes={`Request a quote: ${tier.name} package for ${service.title} (${tier.price} total).`}
                  >
                    <Button variant="outlineDark" aria-label={`Request a quote for the ${tier.name} ${service.title} package`}>
                      Request a Quote
                    </Button>
                  </BookingDialog>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
