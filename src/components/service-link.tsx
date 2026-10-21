import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";
import type { Service } from "@/lib/site-data";

export const ServiceLink = forwardRef<HTMLAnchorElement,
  Omit<ComponentPropsWithoutRef<"a">, "href"> & { service: Service }
>(function ServiceLink({ service, target = "_self", ...props }, ref) {
  return service.externalUrl ? (
    <a ref={ref} href={service.externalUrl} target={target} {...props} />
  ) : (
    <Link ref={ref} to="/services/$slug" params={{ slug: service.slug }} target={target} {...props} />
  );
});
