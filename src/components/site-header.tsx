import { ServiceLink } from "@/components/service-link";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Menu,
  X,
  CalendarDays,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  ToggleRight,
  Star,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import { site, services, industries } from "@/lib/site-data";
import { serviceIcon } from "@/lib/service-icons";
import { industryIcon } from "@/lib/industry-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/squad-logo.png";

/**
 * Careers, FAQs and Blog are reachable from the footer rather than here, so the
 * primary nav stays short. Services and Industries are both dropdowns.
 */
const nav = [
  { to: "/case-studies", label: "Case Studies" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const triggerClass =
  "group flex items-center gap-1 text-sm font-medium text-offwhite/70 transition-colors hover:text-offwhite data-[state=open]:text-offwhite";
const chevronClass = "size-4 transition-transform group-data-[state=open]:rotate-180";
// Width is passed per dropdown rather than shared: Services carries an intro
// column and capability chips under each summary and wants the extra room, while
// Industries is still just a title over a one-line tagline.
const menuClass = "rounded-xl border-border bg-background p-3 shadow-lg";
const SERVICES_MENU_WIDTH = "w-[min(56rem,calc(100vw-3rem))]";
const INDUSTRIES_MENU_WIDTH = "w-[min(44rem,calc(100vw-3rem))]";
// flex-col/items-start override the primitive's single-line centring so the
// description can sit under the title.
const menuItemClass =
  "cursor-pointer flex-col items-start gap-0 whitespace-normal rounded-lg px-3 py-2.5 hover:bg-muted focus:bg-muted";
// Services carry the intro column's fill so the menu reads as a row of blocks
// rather than text floating on the panel. Hover still registers, taking the same
// colour to full strength.
// group so the arrow beside the chips can pick up the item's hover.
const serviceItemClass = `${menuItemClass} group bg-muted/60`;

/**
 * The width below which a trigger-anchored panel stops being comfortable, which
 * is both of them: sharing the figure keeps the two the same width, so they do
 * not jump when the pointer moves between the triggers. Measured on
 * the four current services: at 940 the chips take three rows and the longest
 * title two lines, at 980 the chips fall to two rows, and at 1030 every title
 * fits one line and the cards drop from 235px tall to 168px. Past that it gains
 * nothing until 1180, so this is where the width stops paying for itself.
 *
 * 1040 rather than 1030 for the same reason the intro column is 20rem: the
 * threshold is a text measurement and wants slack for the webfont to differ.
 * It moved from 1020 when the icons went to 20px, so it tracks them.
 *
 * A trigger-anchored panel grows leftward to reach this, and is still capped by
 * the header bar, so on a narrow window it simply spans the bar as before.
 */
const MIN_TRIGGER_PANEL = 1040;

/** Title over description, matching the two-line treatment used on the page cards. */
function MenuItemText({
  title,
  description,
  highlights,
  icon: Icon,
}: {
  title: string;
  description: string;
  /** Only the services pass one; the industries have no icon of their own. */
  icon?: LucideIcon;
  /**
   * Capability chips, carrying the service cards' treatment into the menu. Only
   * the services have them; industries have no equivalent field.
   */
  highlights?: string[];
}) {
  const hasChips = Boolean(highlights && highlights.length > 0);
  return (
    <>
      <span className="flex items-start gap-2">
        {Icon && <Icon className="size-5 shrink-0 text-marigold" />}
        <span className="text-sm font-semibold text-charcoal">{title}</span>
      </span>
      <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</span>
      {hasChips && highlights && (
        /*
         * mt-auto sinks the chips and the affordance to the foot of the item. The
         * grid gives every row the same height, so the slack from a shorter
         * summary or a one-line title collects above the chips rather than as a
         * gap under the title, which is what reserving two title lines used to
         * do. It also lines the chips up across a row.
         */
        <span className="mt-auto flex w-full items-center gap-3 pt-4">
          {/*
            bg-card rather than the cards' bg-background: the panel is already
            bg-background, so that would leave the chips with no fill against it.
            card is lighter than both the panel and the item's muted hover, so the
            chips hold their edge in either state.
          */}
          <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-medium text-charcoal"
              >
                {h}
              </span>
            ))}
          </span>
          {/*
            The arrow alone, in its own column beside the chips, in place of the
            "View service" line. Still aria-hidden: the item is the link, so the
            affordance is for the eye only.
          */}
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-charcoal transition-colors group-hover:text-marigold"
          />
        </span>
      )}
    </>
  );
}
const mobileLinkClass =
  "rounded-full px-4 py-2.5 text-sm font-medium text-offwhite/70 hover:bg-offwhite/10 hover:text-offwhite";
const mobileSubLinkClass =
  "rounded-full px-4 py-2 text-sm text-offwhite/60 hover:bg-offwhite/10 hover:text-offwhite";

/** Only one nav dropdown is open at a time, so the header tracks which. */
type NavMenu = "services" | "industries";

/** A measured box a panel can be sized and aligned to. */
type PanelBox = { width: number; left: number };

/**
 * Hover only where there is a real pointer. Touch keeps tap-to-open, and small
 * screens use the separate accordion menu anyway.
 */
const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Nav dropdown, opening on either hover or click.
 *
 * Radix's DropdownMenu is click-driven by design, so openOn="click" is the
 * primitive as shipped, and openOn="hover" layers pointer handling over it. Two
 * details matter for the hover variant:
 *   - modal={false}: a modal menu locks page scroll, which is wrong for something
 *     that opens just by passing the cursor over it.
 *   - a short close delay, so crossing the gap between trigger and menu does not
 *     dismiss it.
 *
 * Which menu is open lives in the header rather than in each dropdown. Radix
 * dismisses a menu on outside *pointerdown*, which a hover never produces, so
 * without a single owner, hovering Services while Industries was clicked open
 * would leave both panels on screen at once.
 *
 * Radix focuses the menu on open and there is no public prop to skip that, so a
 * hover also moves focus into the menu. It is returned to the trigger on close.
 */
function NavDropdown({
  id,
  label,
  openOn,
  openMenu,
  onOpenChange,
  menuWidth,
  matchBox,
  anchor = "bar",
  children,
}: {
  id: NavMenu;
  label: string;
  openOn: "hover" | "click";
  openMenu: NavMenu | null;
  onOpenChange: (id: NavMenu, open: boolean) => void;
  /** Tailwind width class for the panel; the two menus hold different content. */
  menuWidth: string;
  /**
   * The box the panel is sized against, which is the header bar. Null until
   * measured, so the class width above is the fallback and what the server
   * renders. `anchor` decides which of its edges the panel hangs from.
   */
  matchBox?: PanelBox | null;
  /**
   * Which edge of matchBox the panel starts from. "bar" spans the whole box;
   * "trigger" starts under the trigger and runs to the box's right edge.
   */
  anchor?: "bar" | "trigger";
  children: ReactNode;
}) {
  const open = openMenu === id;
  const hover = openOn === "hover";
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleEnter = () => {
    if (!hover || !canHover()) return;
    clearTimer();
    onOpenChange(id, true);
  };

  /**
   * Closing is driven by the pointer's position rather than a mouseleave handler.
   * The menu is portaled to the body and sits a few pixels below the trigger, so
   * leave events fire while the cursor is still travelling between the two; testing
   * whether the pointer is inside either box is unambiguous and covers the gap.
   */
  useEffect(() => {
    if (!open || !hover || !canHover()) return;

    const onMove = (e: PointerEvent) => {
      const boxes = [triggerRef.current, contentRef.current]
        .filter((el) => el !== null)
        .map((el) => el.getBoundingClientRect());
      // Pad so the gap between trigger and menu still counts as "inside".
      const pad = 16;
      const inside = boxes.some(
        (b) =>
          e.clientX >= b.left - pad &&
          e.clientX <= b.right + pad &&
          e.clientY >= b.top - pad &&
          e.clientY <= b.bottom + pad,
      );
      if (inside) {
        clearTimer();
      } else if (!closeTimer.current) {
        closeTimer.current = setTimeout(() => {
          closeTimer.current = null;
          onOpenChange(id, false);
        }, 120);
      }
    };

    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("pointermove", onMove);
      clearTimer();
    };
  }, [open, hover, id, onOpenChange]);

  useEffect(() => clearTimer, []);

  /**
   * Radix aligns the panel to the trigger, so both numbers are measured from
   * there. A bar-anchored panel offsets back to the box's left edge and takes
   * its full width; a trigger-anchored one needs no offset and instead stops at
   * the box's right edge, so its width falls out of where the trigger sits.
   *
   * Recomputed whenever the menu opens as well as when the box changes, since
   * the trigger moves with the layout while these are only read at open time.
   */
  const [panelBox, setPanelBox] = useState<{ alignOffset: number; width: number } | null>(null);
  useEffect(() => {
    const el = triggerRef.current;
    if (!matchBox || !el) {
      setPanelBox(null);
      return;
    }
    const triggerLeft = el.getBoundingClientRect().left;
    if (anchor !== "trigger") {
      setPanelBox({ alignOffset: Math.round(matchBox.left - triggerLeft), width: matchBox.width });
      return;
    }
    const barRight = matchBox.left + matchBox.width;
    const width = Math.min(matchBox.width, Math.max(barRight - triggerLeft, MIN_TRIGGER_PANEL));
    // Right edge stays on the bar, so any extra width is taken off the left.
    const left = Math.max(matchBox.left, barRight - width);
    setPanelBox({ alignOffset: Math.round(left - triggerLeft), width: Math.round(width) });
  }, [matchBox, open, anchor]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        clearTimer();
        onOpenChange(id, next);
      }}
      modal={false}
    >
      <DropdownMenuTrigger asChild onPointerEnter={handleEnter}>
        <button ref={triggerRef} type="button" className={triggerClass}>
          {label}
          <ChevronDown className={chevronClass} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={contentRef}
        align="start"
        alignOffset={panelBox ? panelBox.alignOffset : 0}
        sideOffset={10}
        // The panel is wide enough that a start-aligned menu on the right-hand
        // triggers runs past the viewport at 1024px; this lets Radix shift it back.
        // A matched panel already sits inside the header's own 24px inset, so this
        // never fires for it.
        collisionPadding={16}
        className={panelBox ? menuClass : `${menuWidth} ${menuClass}`}
        style={panelBox ? { width: panelBox.width } : undefined}
        onPointerEnter={handleEnter}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavMenu | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<PanelBox | null>(null);

  /**
   * The services panel is sized and placed to the header bar, so it has to be
   * measured. CSS cannot express that box: it is max-w-[84rem] inside the
   * header's own 24px padding, and calc(100vw - 3rem) would be wrong by the width
   * of the scrollbar, since 100vw counts it and the bar does not. That error is
   * platform-dependent, which is worse than being merely approximate.
   */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBar({ width: Math.round(r.width), left: Math.round(r.left) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Stable, so the hover dropdown can list it as an effect dependency without
  // rebinding its pointermove listener on every render.
  const handleMenuChange = useCallback((id: NavMenu, next: boolean) => {
    setOpenMenu((current) => (next ? id : current === id ? null : current));
  }, []);

  // Fixed rather than sticky so the translucent bar sits over the hero instead
  // of pushing it down, then goes solid once the page scrolls under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 md:px-6">
      <div
        ref={barRef}
        className={`mx-auto flex w-full max-w-[84rem] items-center justify-between gap-6 rounded-full border px-5 py-2.5 transition-colors duration-300 md:px-7 ${
          scrolled
            ? "liquid-glass-strong border-offwhite/10"
            : "liquid-glass border-offwhite/15"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt={`${site.name} logo`}
            className="h-8 w-auto brightness-0 invert transition duration-300"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <NavDropdown
            id="services"
            label="Services"
            anchor="trigger"
            openOn="hover"
            openMenu={openMenu}
            onOpenChange={handleMenuChange}
            menuWidth={SERVICES_MENU_WIDTH}
            matchBox={bar}
          >
            {/*
              A narrow intro column beside the services themselves. The lead row
              that used to sit across the top is gone; its link is the button at
              the foot of this column instead.
            */}
            {/* 20rem, not 17: the heading needs 252px of text and the column adds
                40px of padding, so 272px wrapped it onto two lines. 320px clears
                that with room for the webfont to differ, and costs the services
                nothing measurable: their chips wrap to two rows either way. */}
            <div className="grid grid-cols-[20rem_1fr] gap-5">
              <div className="flex flex-col justify-between rounded-lg bg-muted/60 p-5">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-marigold">
                    What we do
                  </span>
                  <ToggleRight className="mt-3 block size-6 text-marigold" />
                  <p className="mt-3 font-display text-xl uppercase leading-tight text-charcoal">
                    Capabilities you can switch on
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Four service lines built around the way your business works, from medical
                    billing to the back office.
                  </p>
                </div>

                {/*
                  The column is justify-between over three children now, so this
                  sits in the space the two-child version left empty between the
                  copy and the button.

                  The rating and the count are the live listing's, the same pair
                  the reviews section and the landing page show. The homepage stat
                  band is deliberately not reused here: those figures are
                  placeholders, and this is a nav panel on every page.
                */}
                <div>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3.5 fill-marigold text-marigold" />
                    ))}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Rated {site.googleRating} out of 5 from {site.googleReviewCount} reviews on
                    Google
                  </p>
                </div>

                {/*
                  A menu item rather than a Button, so it stays in Radix's keyboard
                  order with the services; buttonVariants only lends it the look.
                */}
                <DropdownMenuItem
                  asChild
                  className={`${buttonVariants({ variant: "outlineDark", size: "sm" })} mt-5 w-full cursor-pointer justify-center`}
                >
                  <Link to="/services">
                    All services <ArrowRight />
                  </Link>
                </DropdownMenuItem>
              </div>

              {/*
                Two columns, which divides the four services evenly; a third would
                strand one service on a row of its own. The panel starts at the
                trigger but never narrower than MIN_TRIGGER_PANEL, so the cards
                hold at 333px wherever the bar allows that width and fall to about
                295px at 1024, where the bar itself is the limit. Chips stay on two
                rows throughout.
              */}
              <div className="grid auto-rows-fr grid-cols-2 gap-2">
                {services.map((s) => (
                  <DropdownMenuItem key={s.slug} asChild className={serviceItemClass}>
                    <ServiceLink service={s}>
                      <MenuItemText
                        title={s.title}
                        description={s.short}
                        highlights={s.highlights}
                        icon={serviceIcon(s.slug)}
                      />
                    </ServiceLink>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </NavDropdown>

          <NavDropdown
            id="industries"
            label="Industries"
            anchor="trigger"
            openOn="click"
            openMenu={openMenu}
            onOpenChange={handleMenuChange}
            menuWidth={INDUSTRIES_MENU_WIDTH}
            matchBox={bar}
          >
            <div className="grid grid-cols-[20rem_1fr] gap-5">
              <div className="flex flex-col justify-between rounded-lg bg-muted/60 p-5">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-marigold">
                    Who we serve
                  </span>
                  <Globe className="mt-3 block size-6 text-marigold" />
                  <p className="mt-3 font-display text-xl uppercase leading-tight text-charcoal">
                    Sectors we know already
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Every industry has its own workflows and expectations, so the team is built
                    around yours rather than a script.
                  </p>
                </div>

                <DropdownMenuItem
                  asChild
                  className={`${buttonVariants({ variant: "outlineDark", size: "sm" })} mt-5 w-full cursor-pointer justify-center`}
                >
                  <Link to="/industries">
                    All industries <ArrowRight />
                  </Link>
                </DropdownMenuItem>
              </div>

              {/*
                Three columns rather than the services' two: there are seven of
                these against four services, and the cards carry a name and a line each
                where a service card also carries chips. Two columns would run to
                four rows and make the panel far taller than the services one.
              */}
              <div className="grid auto-rows-fr grid-cols-3 gap-2">
                {industries.map((i) => (
                  <DropdownMenuItem key={i.slug} asChild className={serviceItemClass}>
                    <Link to="/industries/$slug" params={{ slug: i.slug }}>
                      <MenuItemText
                        title={i.name}
                        description={i.tagline}
                        icon={industryIcon(i.slug)}
                      />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </NavDropdown>

          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-offwhite/70 transition-colors hover:text-offwhite [&.active]:text-offwhite"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full bg-offwhite/10 text-offwhite hover:bg-offwhite/20 hover:text-offwhite"
            asChild
          >
            <a href={site.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <BookingDialog>
            <Button variant="marigold" size="sm" className="rounded-full">
              <CalendarDays /> Book a Meeting
            </Button>
          </BookingDialog>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-full border border-offwhite/25 text-offwhite lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 w-full max-w-[84rem] rounded-3xl border border-offwhite/10 bg-charcoal p-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium text-offwhite/70 hover:bg-offwhite/10 hover:text-offwhite"
            >
              Services
              <ChevronDown
                className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="ml-4 flex flex-col gap-1 border-l border-offwhite/15 pl-2">
                <Link to="/services" onClick={() => setOpen(false)} className={mobileLinkClass}>
                  All Services
                </Link>
                {services.map((s) => (
                  <ServiceLink
                    key={s.slug}
                    service={s}
                    onClick={() => setOpen(false)}
                    className={mobileSubLinkClass}
                  >
                    {s.title}
                  </ServiceLink>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIndustriesOpen((v) => !v)}
              className="flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium text-offwhite/70 hover:bg-offwhite/10 hover:text-offwhite"
            >
              Industries
              <ChevronDown
                className={`size-4 transition-transform ${industriesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {industriesOpen && (
              <div className="ml-4 flex flex-col gap-1 border-l border-offwhite/15 pl-2">
                <Link to="/industries" onClick={() => setOpen(false)} className={mobileLinkClass}>
                  All Industries
                </Link>
                {industries.map((i) => (
                  <Link
                    key={i.slug}
                    to="/industries/$slug"
                    params={{ slug: i.slug }}
                    onClick={() => setOpen(false)}
                    className={mobileSubLinkClass}
                  >
                    {i.name}
                  </Link>
                ))}
              </div>
            )}

            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <BookingDialog>
                <Button variant="marigold" className="rounded-full">
                  <CalendarDays /> Book a Meeting
                </Button>
              </BookingDialog>
              <Button variant="outlineLight" className="rounded-full" asChild>
                <a href={site.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
