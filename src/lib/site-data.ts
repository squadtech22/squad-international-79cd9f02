/**
 * An office. mapUrl is optional: only the offices with a Maps listing carry
 * one, and the footer shows the address itself for any that does not.
 */
export type SiteLocation = {
  city: string;
  country: string;
  lines: string[];
  mapUrl?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
};

export const site = {
  name: "Squad International",
  /**
   * Canonical origin, no trailing slash. Needed wherever a URL has to be
   * absolute rather than routed, which today is the Organization schema. The
   * sitemap generator defaults to the same string via SITE_URL.
   */
  url: "https://squadinternational.net",
  tagline: "Your Business Companion",
  calendly: "https://calendly.com/squadinternational/30min",
  // wa.me needs the country code with no "+" and no leading zero: +92 313 297 2974.
  whatsapp: "https://wa.me/923132972974",
  email: "Hr@squadinternational.net",
  phone: "+92 313 297 2974",
  phoneHref: "tel:+923132972974",
  // Google Business Profile: "Squad International", BPO company, PECHS Karachi.
  // cid form is stable and needs no API key.
  googleReviewsUrl: "https://www.google.com/maps?cid=18065864380427141787",
  googleRating: 4.9,
  googleReviewCount: 33,
  // Kept as explicit lines so the footer renders exactly two rather than wrapping
  // to three in a narrow column. The contact page joins them.
  /**
   * The offices, New York first. Each line keeps its trailing comma so the parts
   * do not run together when they are joined back into one string, and so the
   * join needs only a space.
   */
  locations: [
    {
      city: "Karachi, Sindh",
      country: "Pakistan",
      lines: ["75 Hamid Hussain Farooqi Rd,", "Block 2 PECHS, Karachi, 75100, Sindh"],
      mapUrl: "https://maps.app.goo.gl/tLVYhKqKK2J9CGiG8",
      address: {
        streetAddress: "75 Hamid Hussain Farooqi Rd, Block 2 PECHS",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        postalCode: "75100",
        addressCountry: "PK",
      },
    },
    {
      city: "Wah Cantonment, Punjab",
      country: "Pakistan",
      lines: ["Prestige Plaza, 1st Floor,", "Kohistan Enclave, Wah Cantt, Punjab, Pakistan"],
      mapUrl: "https://maps.app.goo.gl/83LVaZetYLCj2ca96",
      address: {
        streetAddress: "Prestige Plaza, 1st Floor, Kohistan Enclave",
        addressLocality: "Wah Cantonment",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
    },
    {
      city: "New York",
      country: "United States",
      lines: ["276 Holten Ave,", "Staten Island, NY 10309-4028, US"],
      address: {
        streetAddress: "276 Holten Ave",
        addressLocality: "Staten Island",
        addressRegion: "NY",
        postalCode: "10309-4028",
        addressCountry: "US",
      },
    },
  ] as SiteLocation[],
  boilerplate: "High-performing offshore teams and managed business support built to scale.",
  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/squadinternational" },
    { name: "Instagram", url: "https://www.instagram.com/thesquadinternational" },
    { name: "Facebook", url: "https://www.facebook.com/Squadinternational.net" },
    { name: "YouTube", url: "https://www.youtube.com/@thesquadinternational" },
    { name: "TikTok", url: "https://www.tiktok.com/@squadiansinternational" },
  ],
  /**
   * The link hub, kept apart from both lists. It is not a listing anyone vets a
   * supplier on, so it does not belong beside Clutch and Trustpilot everywhere;
   * the contact page adds it, since that is where someone wants every way to
   * reach us in one place.
   */
  linkHub: { name: "Linktree", url: "https://linktr.ee/squadinternational" },
  /** Shown on the about page and named in the Organization schema. */
  founder: {
    name: "Haider Ali",
    role: "Founder & CEO",
    /** One line, for the card on the about page. */
    summary:
      "Founded Squad International in 2019, to give growing businesses capacity without making them build every function in-house.",
    /**
     * His own account of why the company exists, put into the third person. No
     * claim here is ours to make on his behalf, so nothing is added to it.
     */
    bio: [
      "Haider Ali founded Squad International in 2019, out of a pattern he kept running into: growing businesses reach a point where the people running the company are also running every process inside it.",
      "Customer conversations, follow-ups, admin, lead generation and operational work start competing with the work that actually moves the business forward.",
      "His case for outsourcing is not that labour costs less. It is that the right team gives a business capacity without forcing it to build every function internally.",
      "That is what Squad International has been built around since: dedicated teams across customer support, sales support and business operations, for companies scaling into international markets without adding unnecessary complexity.",
    ],
    profiles: [
      { name: "LinkedIn", url: "https://www.linkedin.com/in/haideralisquad" },
      { name: "Upwork", url: "https://www.upwork.com/freelancers/haideralisquad" },
    ],
  },
  /**
   * Where the business is listed and reviewed, as against socials, where it
   * posts. Shown as a section on the about and contact pages rather than in the
   * footer: someone checking a supplier's listings is on those pages already.
   */
  profiles: [
    { name: "Trustpilot", url: "https://www.trustpilot.com/review/squadinternational.net" },
    { name: "Clutch", url: "https://clutch.co/profile/squad-international", short: "Cl" },
    { name: "Upwork", url: "https://www.upwork.com/agencies/2096008037645452073" },
    { name: "GoodFirms", url: "https://www.goodfirms.co/company/squad-international", short: "GF" },
    { name: "G2", url: "https://www.g2.com/products/squad-international" },
  ],
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  outcomes: string[];
  capabilities: string[];
  process: { step: string; detail: string }[];
  idealFor: string[];
  tools: string[];
  /** Longer positioning line used on the services page card. */
  pitch: string;
  /** Three short capability chips, shown in the header menu. */
  highlights: string[];
  /**
   * The homepage card's pills, in the order they are shown. Not derived from
   * highlights: the running order is chosen per card and interleaves the two, so
   * concatenating them cannot produce it. The repeated entries are deliberate.
   *
   * The menu keeps highlights instead, since these run far longer and its cards
   * are a third of the width with a panel height to hold.
   */
  offerings: string[];
  /**
   * The two facts shown under the service cards and in the engagement panel.
   * Each line labels its own, since what matters about a billing engagement is
   * not what matters about an outbound one. Two entries: both surfaces lay them
   * out as a pair.
   */
  facts: { label: string; value: string }[];
  /**
   * How the line is priced. Optional because most engagements are scoped and
   * quoted rather than listed, so the sidebar hides this when absent. More than
   * one entry makes the page offer a toggle, since the same work can be bought
   * on different bases.
   */
  pricing?: {
    /** The toggle's label for this model. Short: two sit side by side. */
    label: string;
    /** The headline figure, or the basis where there is no single number. */
    amount: string;
    /** Follows the figure, e.g. "per month". Omitted where it reads alone. */
    unit?: string;
    note: string;
  }[];
};

export const services: Service[] = [
  {
    slug: "medical-billing-healthcare",
    title: "Medical Billing & RCM",
    short:
      "End-to-end revenue cycle support for US healthcare providers, from eligibility checks through denials and AR follow-up.",
    summary:
      "Billing and administrative support for practices and healthcare services — eligibility checks, charge entry, claim submission, denial handling and accounts-receivable follow-up, run to documented process with audit sampling.",
    outcomes: [
      "Clean-claim rates tracked and reported weekly",
      "Shorter AR cycles through structured follow-up",
      "Clinical staff returned to clinical work",
    ],
    capabilities: [
      "Insurance eligibility and benefits verification",
      "Charge entry and claim preparation",
      "Claim submission and clearinghouse handling",
      "Denial management and appeals",
      "Accounts-receivable follow-up and reporting",
      "Patient billing enquiries",
    ],
    process: [
      { step: "Scope & controls", detail: "Payer mix, volumes and the access controls and agreements needed before go-live." },
      { step: "Train & certify", detail: "Billers are trained on your specialty, payers and practice management system." },
      { step: "Pilot with audit", detail: "A supervised ramp with claim-level review before full volume." },
      { step: "Steady state", detail: "Weekly AR and denial reporting with monthly performance review." },
    ],
    idealFor: ["Medical practices and clinics", "Billing companies", "Allied health and diagnostics"],
    tools: [
      "Athenahealth, DrChrono and Kareo",
      "AdvancedMD and eClinicalWorks",
      "Epic and Cerner portals",
      "Availity and payer portals",
      "Clearinghouses such as Office Ally",
      "Your practice management system",
    ],
    pitch:
      "Support routine healthcare billing and administrative processes with dedicated outsourced resources — adding back-office capacity without having to build every function internally.",
    highlights: ["Eligibility Checks", "Billing & Claims", "AR Follow-Up"],
    offerings: [
      "Eligibility Checks",
      "Billing & Claims",
      "Dedicated RCM Team",
      "Full-Service Percentage-Based RCM",
      "AR Follow-Up",
    ],
    facts: [
      { label: "Engagement model", value: "Percentage-Based RCM" },
      { label: "Team model", value: "Dedicated RCM Team" },
    ],
    pricing: [
      {
        label: "Dedicated team",
        amount: "$1,500",
        unit: "per month",
        note: "A dedicated biller working your claims at a fixed monthly cost, whatever they collect. Suits steady, predictable volume.",
      },
      {
        /*
         * No rate here on purpose: one has not been set. The amount reads as the
         * basis rather than a figure, and the page sizes it accordingly.
         */
        label: "Percentage of collections",
        amount: "% of collections",
        note: "Billed as a share of what is actually recovered, so the cost tracks the revenue rather than the headcount. Suits higher or seasonal claim volume. The rate is quoted against your specialty and volume.",
      },
    ],
  },
  {
    slug: "lead-generation",
    title: "Outbound Sales Support",
    short:
      "Dedicated prospecting support that keeps your sales pipeline active and your internal team focused on qualified leads.",
    summary:
      "Research, list building, multichannel outreach and appointment setting run by SDR pods that report on pipeline, not activity vanity metrics.",
    outcomes: [
      "Predictable monthly qualified meeting volume",
      "Clean, enriched prospect data in your CRM",
      "Lower cost per booked meeting than local SDR hiring",
    ],
    capabilities: [
      "ICP definition and list building",
      "Data enrichment and verification",
      "Cold email and LinkedIn sequencing",
      "Outbound calling and appointment setting",
      "Inbound lead qualification and routing",
      "Pipeline reporting and attribution",
    ],
    process: [
      { step: "ICP & offer workshop", detail: "We align on segments, messaging angles and qualification criteria." },
      { step: "Data & infrastructure", detail: "Lists, domains, sequencing tools and CRM routing are set up." },
      { step: "Launch & iterate", detail: "Weekly message testing against reply and meeting-rate targets." },
      { step: "Scale", detail: "Add channels or seats once cost per meeting is proven." },
    ],
    idealFor: ["B2B services", "Software and technology", "Logistics and manufacturing"],
    tools: [
      "Apollo, ZoomInfo and Cognism",
      "Instantly, Smartlead and Lemlist",
      "LinkedIn Sales Navigator",
      "HubSpot, Salesforce and Close",
      "Clay and Dropcontact enrichment",
      "Aircall and power dialers",
    ],
    pitch:
      "Keep your sales pipeline moving with dedicated prospecting support — without increasing the internal overhead required to manage every stage of outreach and qualification.",
    highlights: ["Cold Calling", "Lead Qualification", "Appointment Setting"],
    offerings: [
      "Cold Calling",
      "Lead Qualification",
      "Appointment Setting",
      "SDR Support",
      "Sales Follow-Up",
    ],
    facts: [
      { label: "Campaign model", value: "Client-Provided Leads/Data" },
      { label: "Team setup", value: "Dedicated Callers / SDRs" },
    ],
  },
  {
    slug: "customer-support",
    title: "Customer Support Outsourcing",
    short:
      "Reliable customer support that helps you increase service capacity without continuously expanding your internal team.",
    summary:
      "Trained support agents handling voice, email, chat and ticketing on your brand and your tooling — with the QA, coverage planning and escalation paths of an in-house function.",
    outcomes: [
      "First response times under 15 minutes on live channels",
      "CSAT held above 90% through structured QA",
      "24/7 or follow-the-sun coverage without hiring locally",
    ],
    capabilities: [
      "Inbound voice and callback handling",
      "Email, chat and social response",
      "Ticket triage and escalation management",
      "Order, billing and account support",
      "Technical tier-1 support",
      "Knowledge base and macro development",
    ],
    process: [
      { step: "Coverage modelling", detail: "Volumes, peak hours and channels define headcount and shifts." },
      { step: "Product training", detail: "Agents complete structured product and tone-of-voice training." },
      { step: "Pilot with QA", detail: "A supervised ramp period with daily scorecards and calibration." },
      { step: "Steady state", detail: "SLA reporting, QA sampling and continuous coaching." },
    ],
    idealFor: ["E-commerce and D2C", "SaaS platforms", "Healthcare and insurance services"],
    tools: [
      "Zendesk, Freshdesk and Intercom",
      "Gorgias and Shopify",
      "Salesforce Service Cloud",
      "Talkdesk, Aircall and RingCentral",
      "Front and Help Scout",
      "Your knowledge base and macro library",
    ],
    pitch:
      "Expand your customer support capacity with dedicated resources that work around your processes — helping you serve customers consistently without carrying the cost of building every support role internally.",
    highlights: ["Inbound Calls", "Live Chat + Email", "Ticket Management"],
    offerings: [
      "Inbound Calls",
      "Live Chat + Email",
      "Ticket Management",
      "Voice",
      "Booking / Reservations / Customer Care",
      "Tickets / Helpdesk",
      "Email",
      "Live Chat",
    ],
    facts: [
      { label: "Support model", value: "Dedicated Support Team" },
      { label: "Channel coverage", value: "Voice, Chat, Email & Tickets" },
    ],
  },
  {
    slug: "virtual-business-assistance",
    title: "Dedicated Teams & Virtual Assistance",
    short:
      "Move recurring administrative and desk work to dedicated resources built around your existing tools and workflow.",
    summary:
      "Dedicated assistants who absorb the administrative load slowing your business down — calendar and inbox management, CRM hygiene, reporting, research, documentation and day-to-day coordination.",
    outcomes: [
      "Reclaim 15-25 hours per week for senior staff",
      "Lower cost per administrative hour by up to 60%",
      "Consistent documentation and CRM data quality",
    ],
    capabilities: [
      "Executive and calendar management",
      "Inbox triage and response handling",
      "CRM and pipeline data maintenance",
      "Invoicing, reconciliation and order admin",
      "Research, reporting and presentation prep",
      "Vendor and supplier coordination",
    ],
    process: [
      { step: "Scope & role design", detail: "We map the tasks, tools and volumes before proposing a team shape." },
      { step: "Recruit & vet", detail: "Shortlisted candidates are screened for domain, language and tooling fit." },
      { step: "Onboard & document", detail: "Your workflows are turned into SOPs owned by our team lead." },
      { step: "Run & improve", detail: "Weekly reporting, QA sampling and quarterly scope reviews." },
    ],
    idealFor: ["Founder-led businesses", "Professional services firms", "Agencies and consultancies"],
    tools: [
      "Google Workspace and Microsoft 365",
      "HubSpot, Salesforce and Pipedrive",
      "Slack, Teams and Notion",
      "Xero, QuickBooks and Bill.com",
      "Asana, ClickUp and Monday.com",
      "DocuSign and PandaDoc",
    ],
    pitch:
      "Move recurring administrative and desk work to dedicated support so your internal team can spend more time on the work that drives the business forward.",
    highlights: ["Data Entry & Admin Support", "Research", "CRM & Order Processing"],
    offerings: [
      "Data Entry & Admin Support",
      "Research",
      "CRM & Order Processing",
      "Virtual Assistants",
      "CRM / Data / Order Processing",
      "Back Office",
      "Administrative Support",
      "Custom Dedicated Teams",
    ],
    facts: [
      { label: "Resource model", value: "Dedicated Talent" },
      { label: "Engagement type", value: "VA, Specialist or Full Team" },
    ],
  },
];

export type Industry = {
  slug: string;
  name: string;
  short: string;
  /** Deck's per-industry headline, shown above the body copy. */
  headline: string;
  /** One-liner for the homepage industry cards, where `short` is too long. */
  tagline: string;
  /** The deck's "Key Focus" triple. */
  keyFocus: string[];
  challenges: string[];
  solutions: string[];
  metrics: { label: string; value: string }[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Wellness",
    short:
      "Billing, claims and administrative workloads can consume valuable internal time. We help healthcare and wellness businesses add dependable back-office capacity while maintaining consistent processes and accountability.",
    headline: "Reliable Support for Process-Driven Healthcare Operations",
    tagline: "Reliable support for process-driven healthcare and admin operations.",
    keyFocus: ["Billing Support", "Administrative Workflows", "Consistent Execution"],
    challenges: [
      "Administrative burden on clinical staff",
      "Appointment no-shows and scheduling churn",
      "Documentation and claims backlogs",
    ],
    solutions: [
      "Patient scheduling, reminders and follow-up",
      "Records, intake and documentation support",
      "Claims and billing operations with audit sampling",
    ],
    metrics: [
      { label: "Admin hours returned", value: "22/wk" },
      { label: "No-show rate", value: "-31%" },
      { label: "Claims accuracy", value: "99.2%" },
    ],
  },
  {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    short:
      "Customer expectations stay high whether you're handling everyday orders or seasonal peaks. We help e-commerce and retail businesses manage recurring customer and operational workloads without continuously expanding internal headcount.",
    headline: "Support That Scales With Customer Demand",
    tagline: "Support that scales with customer demand through every peak season.",
    keyFocus: ["Customer Experience", "Order Workflows", "Flexible Capacity"],
    challenges: [
      "Volume spikes around promotions and holidays",
      "Order, refund and WISMO enquiries dominating support",
      "Listings and catalogue work falling behind",
    ],
    solutions: [
      "Flexible seasonal support pods that scale up and down",
      "Order, returns and dispute handling on your helpdesk",
      "Catalogue, listing and marketplace operations",
    ],
    metrics: [
      { label: "Peak capacity added", value: "3x" },
      { label: "Avg. first response", value: "< 12 min" },
      { label: "Cost per contact", value: "-45%" },
    ],
  },
  {
    slug: "saas-technology",
    name: "SaaS & Technology",
    short:
      "As technology businesses grow, so do customer conversations, administrative workloads and sales activity. Dedicated outsourced support gives your internal team more capacity to focus on product, customers and growth.",
    headline: "Support Your Growth Without Adding Unnecessary Overhead",
    tagline: "More capacity for growing customer, sales and administrative workloads.",
    keyFocus: ["Customer Experience", "Pipeline Support", "Scalable Capacity"],
    challenges: [
      "Engineers pulled into tier-1 support tickets",
      "Onboarding backlog slowing time-to-value",
      "Inconsistent outbound pipeline coverage",
    ],
    solutions: [
      "Trained tier-1 support with clear escalation paths",
      "Customer onboarding and implementation support",
      "SDR pods for outbound and inbound qualification",
    ],
    metrics: [
      { label: "Tickets deflected from eng.", value: "78%" },
      { label: "Onboarding time", value: "-40%" },
      { label: "Meetings / month", value: "35+" },
    ],
  },
  {
    slug: "logistics",
    name: "Logistics & Supply Chain",
    short:
      "Logistics businesses depend on consistent communication, accurate processing and reliable day-to-day support. We help manage recurring operational and administrative workloads so internal teams can stay focused on moving the business forward.",
    headline: "Keep Everyday Operations Moving",
    tagline: "Keep recurring customer, administrative and operational work moving.",
    keyFocus: ["Customer Communication", "Order Processing", "Back-Office Support"],
    challenges: [
      "24/7 shipment exception handling",
      "Manual carrier and vendor coordination",
      "High-volume documentation processing",
    ],
    solutions: [
      "Follow-the-sun track-and-trace desks",
      "Carrier, driver and vendor coordination",
      "Documentation, POD and invoice processing",
    ],
    metrics: [
      { label: "Coverage", value: "24/7" },
      { label: "Exception resolution", value: "-38% time" },
      { label: "Docs processed / day", value: "1,400" },
    ],
  },
  {
    slug: "financial-services",
    name: "Professional & Business Services",
    short:
      "Professional and business service firms depend on accurate, consistent client and administrative processes. Dedicated outsourced support helps keep recurring work moving without requiring every function to be built internally.",
    headline: "More Back-Office Capacity. Less Internal Overhead.",
    tagline: "Add dependable back-office capacity without added internal overhead.",
    keyFocus: ["Client Administration", "Client Support", "Operational Efficiency"],
    challenges: [
      "Documented processes requiring consistent execution",
      "Client servicing volumes outpacing headcount",
      "Costly local hiring for repeatable work",
    ],
    solutions: [
      "Client onboarding and documentation support",
      "Client servicing and enquiry management",
      "Scheduling, reporting and billing operations",
    ],
    metrics: [
      { label: "Process accuracy", value: "99.5%" },
      { label: "Turnaround", value: "-52%" },
      { label: "Operating cost", value: "-55%" },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate & Property",
    short:
      "Lead follow-ups, appointments, CRM updates and administrative work can quickly take time away from clients and deals. We help real estate and property businesses manage recurring support work with dedicated resources built around their workflow.",
    headline: "Keep Opportunities Moving While Your Team Stays Focused",
    tagline: "Keep lead follow-ups, appointments and routine administration moving.",
    keyFocus: ["Lead Follow-Up", "Appointment Support", "CRM & Administration"],
    challenges: [
      "Inbound leads going cold outside office hours",
      "Listing and CRM data drifting out of date",
      "Tenant and maintenance requests unmanaged",
    ],
    solutions: [
      "Speed-to-lead qualification and appointment setting",
      "Listing, portal and CRM management",
      "Tenant support and maintenance coordination",
    ],
    metrics: [
      { label: "Speed to lead", value: "< 5 min" },
      { label: "Appointments / month", value: "60+" },
      { label: "Listing accuracy", value: "100%" },
    ],
  },
  {
    slug: "restaurants-hospitality",
    name: "Restaurants & Hospitality",
    short:
      "Restaurants, hotels and hospitality groups handle constant booking, ordering and guest enquiry volume across long service hours. Dedicated outsourced support covers those channels without expanding front-of-house headcount.",
    headline: "Cover Every Booking And Enquiry Across Service Hours",
    tagline: "Cover bookings, orders and guest enquiries across every service hour.",
    keyFocus: ["Reservations", "Order Support", "Guest Communication"],
    challenges: [
      "Enquiry peaks landing in the middle of service",
      "Long opening hours to cover across sites",
      "High turnover in front-of-house roles",
    ],
    solutions: [
      "Reservation, booking and amendment handling",
      "Phone and online order support",
      "Review responses and guest follow-up",
    ],
    metrics: [
      { label: "Calls answered", value: "98%" },
      { label: "Response time", value: "-60%" },
      { label: "Operating cost", value: "-50%" },
    ],
  },
  {
    slug: "auto-trading",
    name: "Auto Trading & Dealerships",
    short:
      "Dealerships and vehicle traders live on response speed, because an enquiry left waiting is a sale made from the next listing. Dedicated support keeps enquiries answered, appointments booked and the paperwork behind them moving.",
    headline: "Answer Every Enquiry Before The Next Listing Does",
    tagline: "Keep every enquiry answered and every vehicle appointment in the diary.",
    keyFocus: ["Sales Enquiries", "Booking & Scheduling", "Documentation"],
    challenges: [
      "Enquiries arriving after hours and at weekends",
      "Volume spiking whenever new stock lands",
      "Paperwork holding up handover and delivery",
    ],
    solutions: [
      "Enquiry response and lead qualification",
      "Test drive and service appointment booking",
      "Finance and registration document chasing",
    ],
    metrics: [
      { label: "Enquiry response", value: "< 10 min" },
      { label: "Appointments booked", value: "+38%" },
      { label: "Admin cost", value: "-50%" },
    ],
  },
];

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  service: string;
  challenge: string;
  approach: string[];
  results: { label: string; value: string }[];
  quote: { text: string; author: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "d2c-peak-season-support",
    client: "D2C home goods brand",
    industry: "E-commerce & Retail",
    service: "Customer Support Outsourcing",
    challenge:
      "Holiday volumes tripled and a three-person in-house team was answering tickets 40 hours late, dragging CSAT to 71%.",
    approach: [
      "Modelled peak volumes and staffed a 12-agent seasonal pod",
      "Rebuilt macros and the help centre to deflect WISMO contacts",
      "Introduced daily QA scorecards and a weekly calibration call",
    ],
    results: [
      { label: "First response", value: "11 min" },
      { label: "CSAT", value: "93%" },
      { label: "Cost per contact", value: "-45%" },
    ],
    quote: {
      text: "They absorbed our worst quarter without us hiring a single person locally.",
      author: "Head of Customer Experience",
    },
  },
  {
    slug: "saas-outbound-pipeline",
    client: "B2B workflow software company",
    industry: "SaaS & Technology",
    service: "Outbound Sales Support",
    challenge:
      "Two local SDRs cost more than the pipeline they produced, and outreach stalled whenever one of them left.",
    approach: [
      "Rebuilt the ICP and rewrote sequences around three pain-led angles",
      "Stood up a four-person SDR pod with a dedicated researcher",
      "Weekly message testing tied to reply and meeting-rate targets",
    ],
    results: [
      { label: "Meetings / month", value: "38" },
      { label: "Cost per meeting", value: "-61%" },
      { label: "Pipeline in 6 months", value: "$2.4M" },
    ],
    quote: {
      text: "The pod produces more qualified meetings than our previous in-house team at a third of the cost.",
      author: "VP Revenue",
    },
  },
  {
    slug: "logistics-24-7-desk",
    client: "Freight forwarding group",
    industry: "Logistics & Supply Chain",
    service: "Customer Support Outsourcing",
    challenge:
      "Shipment exceptions raised overnight sat untouched until morning, creating detention charges and customer churn.",
    approach: [
      "Deployed a follow-the-sun track-and-trace desk across three shifts",
      "Documented exception playbooks with escalation thresholds",
      "Built a daily exception dashboard for operations leadership",
    ],
    results: [
      { label: "Coverage", value: "24/7" },
      { label: "Resolution time", value: "-38%" },
      { label: "Detention charges", value: "-$180k/yr" },
    ],
    quote: {
      text: "Nothing waits for morning anymore. That single change paid for the whole engagement.",
      author: "Director of Operations",
    },
  },
];

/**
 * Answers are paragraph arrays: the site copy deck writes several of these as two
 * or three short paragraphs, and joining them into one block loses the breaks.
 */
export const faqs: { q: string; a: string[] }[] = [
  {
    q: "How quickly can a team be up and running?",
    a: [
      "The timeline depends on the service, team size, training requirements and complexity of your workflow.",
      "We start by understanding your requirements, designing the right support structure and preparing the team around your processes and tools. A clear onboarding timeline is agreed before deployment begins.",
    ],
  },
  {
    q: "How is pricing structured?",
    a: [
      "Most pricing is built around your specific requirements rather than a fixed package or per-seat rate, though some service lines publish a starting price.",
      "Factors such as the type of work, number of resources, responsibilities, working hours and overall scope can affect pricing.",
      "For pricing, book a free consultation or WhatsApp us to discuss your requirements.",
    ],
  },
  {
    q: "Who manages the team day to day?",
    a: [
      "Squad International works as an extension of your business rather than a separate outsourced supplier.",
      "We structure dedicated resources around agreed responsibilities and workflows, while maintaining communication, consistency and accountability throughout the engagement.",
      "Your priorities and standards remain clear; we help keep the day-to-day work moving.",
    ],
  },
  {
    q: "How do you protect our data?",
    a: [
      "Data access and security are agreed during setup, based on the systems, tools and type of work involved.",
      "We work with clients to understand their access requirements and establish an appropriate working structure before delivery begins.",
    ],
  },
  {
    q: "What happens if a team member is not performing as expected?",
    a: [
      "Reliable delivery and accountability are important parts of how we work.",
      "If there is a performance or resource issue, our team works with you to address it and make the necessary adjustments so the agreed responsibilities continue to be handled effectively.",
    ],
  },
  {
    q: "Can you work with our existing tools and working hours?",
    a: [
      "Our support is designed around the way your business already works.",
      "During the discovery and design stages, we review your workflows, systems, responsibilities and required working hours so the team can be structured around your operational needs.",
    ],
  },
  {
    q: "How do we know whether outsourcing is working?",
    a: [
      "Before delivery begins, we make sure responsibilities, expectations and business priorities are clearly understood.",
      "Performance can then be reviewed against the outcomes that matter to your business — whether that means customer support quality, completed work, response times, appointments, operational capacity or another agreed priority.",
    ],
  },
  {
    q: "Is there a minimum commitment?",
    a: [
      "Engagement requirements can vary depending on the service, team structure and scope of work.",
      "Any commitment, commercial terms and engagement requirements are discussed clearly before you begin. Contact us to discuss the right setup for your business.",
    ],
  },
  {
    q: "Where are your teams based, and what hours can they cover?",
    a: [
      "Squad International supports businesses across different markets and works with clients based on their operational requirements.",
      "Working hours and coverage are determined during the setup process based on your customers, workload and the type of support required.",
    ],
  },
  {
    q: "What languages do your teams support?",
    a: [
      "Language requirements depend on the service, role and team being built.",
      "If your business requires support in a specific language, let us know during the discovery call so we can assess the requirement as part of your proposed solution.",
    ],
  },
  {
    q: "Can the team be built around our specific requirements?",
    a: [
      "Yes. That is a core part of our approach.",
      "We tailor teams, workflows and responsibilities around your business rather than forcing you into a fixed outsourcing model. The goal is to give you the support you actually need.",
    ],
  },
  {
    q: "Do teams work from an office or remotely?",
    a: [
      "The delivery setup can depend on the role, workflow and requirements of the engagement.",
      "We discuss the appropriate working model during the discovery and design process so the structure fits the work being handled.",
    ],
  },
  {
    q: "What does onboarding require from our team?",
    a: [
      "We need enough information to understand how the work should be done.",
      "That typically means helping us understand your existing workflow, responsibilities, tools, standards and expectations during the discovery and setup stages.",
      "From there, we structure the solution and prepare the team around your requirements.",
    ],
  },
  {
    q: "What if our support requirements change later?",
    a: [
      "Your outsourcing setup should be able to change with your business.",
      "You can start with the support you need today and adjust your team as your workload, customer base and business requirements evolve.",
      "Specific commercial or contractual changes are agreed according to the engagement.",
    ],
  },
  {
    q: "When is outsourcing not the right solution?",
    a: [
      "Outsourcing works best when there is a clear business function, responsibility or process that can be handed over effectively.",
      "If a process is constantly changing, cannot yet be clearly defined or depends heavily on information that cannot be transferred to another team, it may be better to structure the process first.",
      "Our goal is to build support that works — not simply add resources where they will not create value.",
    ],
  },
];

export const posts = [
  {
    slug: "smart-scaling-strategic-business-process-outsourcing",
    title: "Smart scaling: the power of strategic business process outsourcing",
    excerpt:
      "Outsourcing judged by the capacity it returns to a business, not by the invoice — the four service areas, the compliance standards, and the verification signals that actually make it work.",
    date: "2026-09-28",
    readingTime: "5 min read",
    category: "Growth",
    body: [
      "Ask founders of a scaling business where growth actually stalls, and the honest answer rarely points at product or market. More often it is leadership capacity: the people who should be setting direction are instead buried in the administrative and operational work that keeps the business running day to day.",
      "That is the case for treating outsourcing as something other than a line-item cost reduction. The more useful way to think about it is as a tool for reclaiming organisational capacity. As a business grows, the volume of customer conversations, administrative work and outbound activity grows with it, and that volume competes directly with the work that actually moves the company forward. Handing repeatable processes to a dedicated external team does not just cut a cost line, it frees internal capacity for the decisions only the business itself can make.",
      "In practice, that capacity gets reclaimed across four areas we see repeatedly. Medical billing and revenue cycle management absorbs the claims processing, eligibility checks and AR follow-up that otherwise pulls clinical and admin staff away from patients. Outbound sales support puts dedicated SDRs on prospecting and appointment setting so an internal sales team can spend its time closing rather than sourcing. Customer support outsourcing covers voice, chat, email and ticketing as one consistent channel rather than several disconnected ones. And dedicated teams and virtual assistance pick up the recurring back-office load — data entry, CRM hygiene, order processing — that otherwise sits on whoever has the least time to do it.",
      "None of that works without trust, and trust in an international outsourcing partner is built on specifics rather than claims. A hybrid onshore-offshore model that can genuinely deliver round-the-clock coverage. Active HIPAA and HITECH compliance where healthcare data is involved, not a one-time certificate. And independent verification — platforms like Clutch and Trustpilot exist precisely because a vendor's own website is not where a buyer should be forming their final opinion.",
      "The takeaway is simple to state and harder to execute: outsourcing done well is judged on the capacity it returns to the business, not on the invoice. Workflows built around how a specific industry actually operates, compliance that is demonstrated rather than asserted, and integration that lets a team scale its execution without scaling its headcount — that is what turns an outsourcing relationship into a growth lever rather than a cost centre.",
    ],
  },
  {
    slug: "independent-reviews-and-outsourcing-transparency",
    title: "Independent reviews, greater transparency, trusted outsourcing support",
    excerpt:
      "Squad International is now listed on GoodFirms. Why independent, verified reviews matter when you are choosing a partner.",
    date: "2026-09-18",
    readingTime: "4 min read",
    category: "Company",
    body: [
      "Choosing an outsourcing partner is a major business decision. A company can look strong on its own website, but B2B buyers increasingly want something more before starting a conversation: independent information, real client feedback, and a clearer picture of who they would be working with.",
      "That is why we are pleased to say Squad International is now listed on GoodFirms, a B2B research, ratings and review platform built to help businesses discover and evaluate service providers. Rather than relying on what a company says about itself, it combines company information, client reviews, market presence and service expertise so buyers can compare providers.",
      "Outsourcing means trusting an external team with important parts of your business: customer conversations, lead generation, administrative workflows, sales support, healthcare billing. Businesses naturally want confidence before making that decision, and independent platforms add a layer of transparency a website cannot.",
      "Verified reviews help answer the questions that actually decide an engagement. How responsive is the team? How well do they follow process? Do they communicate consistently, and adapt as requirements change? Can they become a dependable extension of the business rather than another thing to manage?",
      "GoodFirms puts weight on authenticity: submitted reviews go through identity verification and content examination, and reviewer information is checked before anything is published. For a business comparing providers, that makes it a more useful source than testimonials chosen by the provider.",
      "Our approach has not changed since 2019. Understand the business first, then build the support around it, rather than forcing a company into a predefined model. Outsourcing should give you more capacity, not another operational problem.",
      "Our GoodFirms profile is live now. If you have worked with our team, we would value your feedback: visit the profile and choose Write a Review. Independent feedback helps prospective clients decide, and it tells us where to improve.",
    ],
  },
  {
    slug: "when-to-outsource-customer-support",
    title: "When outsourcing customer support actually makes sense",
    excerpt:
      "Volume, coverage gaps and cost per contact are the three signals worth acting on — and the ones that mean you should wait.",
    date: "2026-07-28",
    readingTime: "6 min read",
    category: "Customer Support",
    body: [
      "Most teams consider outsourcing at the wrong moment: either far too early, when the process is still changing weekly, or far too late, when service has already degraded and churn is visible in the numbers.",
      "The healthiest trigger is repeatability. If the same twenty contact reasons account for most of your volume, and each has a defensible answer, the work is documentable — and documentable work is delegable work.",
      "The second trigger is coverage. A local team cannot economically cover nights and weekends at low volumes. An offshore pod can, and the cost of leaving overnight contacts unanswered is usually larger than the cost of covering them.",
      "The third is cost per contact. Once you can measure it, you can compare it. If your fully loaded cost per contact is climbing while quality is flat, capacity is the constraint, not effort.",
      "Wait if your product is changing weekly, if nobody internally owns quality, or if you cannot name the metrics you want moved. Outsourcing amplifies whatever process you hand over — including a bad one.",
    ],
  },
  {
    slug: "building-sops-that-survive-turnover",
    title: "Building SOPs that survive turnover",
    excerpt:
      "Process documentation fails when it is written once and never owned. Here is the structure we use on every engagement.",
    date: "2026-07-10",
    readingTime: "5 min read",
    category: "Operations",
    body: [
      "An SOP is not a document, it is a maintained asset. The difference shows up six months later, when the person who wrote it has moved on and nobody has touched it since.",
      "Every procedure we write has four fixed sections: trigger, steps, exceptions and escalation. The exceptions section is where most documentation fails — it is the part that turns a checklist into judgement your team can apply.",
      "Ownership matters more than format. Each SOP names a single owner and a review date. Anything past its review date shows up on the team lead's dashboard until it is either updated or retired.",
      "Finally, tie SOPs to QA. If the quality scorecard scores behaviour that the SOP does not describe, one of the two is wrong. Keeping them in sync is what makes quality coaching feel fair instead of arbitrary.",
    ],
  },
  {
    slug: "cost-of-a-slow-first-response",
    title: "The real cost of a slow first response",
    excerpt:
      "Response time is the single support metric most closely tied to revenue. The maths is less forgiving than most teams expect.",
    date: "2026-06-22",
    readingTime: "4 min read",
    category: "Growth",
    body: [
      "Speed-to-lead studies consistently show a steep decay curve: contact a prospect within five minutes and the conversation is dramatically more likely to happen than at thirty.",
      "The same shape applies to support. A customer waiting on a refund question is deciding whether to buy again, and that decision hardens well before your reply arrives.",
      "The practical fix is rarely working faster. It is coverage — making sure someone is actually available during the hours enquiries arrive — and triage, so simple questions never queue behind complex ones.",
      "Measure the median, not the average, and segment by channel. Averages hide the overnight gap that is doing most of the damage.",
    ],
  },
  {
    slug: "offshore-team-quality-control",
    title: "How to run quality control on an offshore team",
    excerpt: "Sampling, calibration and coaching cadence — the three mechanics that keep quality from drifting.",
    date: "2026-06-04",
    readingTime: "7 min read",
    category: "Operations",
    body: [
      "Quality does not degrade suddenly; it drifts. Without sampling, drift is invisible until a customer escalates.",
      "Sample deliberately: a fixed number of interactions per agent per week, scored against a rubric that reflects the SOP. Random sampling beats cherry-picked reviews every time.",
      "Calibrate the scorers. Once a week, several reviewers score the same interaction independently and discuss variance. Without calibration, scores measure the reviewer, not the agent.",
      "Then coach on patterns rather than incidents. One low score is noise; three in the same rubric category is a training gap worth a session.",
    ],
  },
];

/** The about page uses Global Clients where the homepage uses Coverage Models. */
export const aboutStats = [
  { value: "500+", label: "Trained specialists" },
  { value: "300+", label: "Global clients" },
  { value: "98%", label: "Client retention" },
  { value: "60%", label: "Average cost savings" },
];

export const stats = [
  { value: "500+", label: "Trained specialists" },
  { value: "24/7", label: "Coverage available" },
  { value: "98%", label: "Client retention" },
  { value: "60%", label: "Average cost savings" },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating?: number;
  sourceUrl?: string | null;
};

/**
 * Real reviews, taken from the Google Business Profile's Takeout export rather than
 * retyped from the listing (see site.googleReviewsUrl).
 *
 * The export holds 33 reviews: thirty at five stars, two at four and one at three,
 * averaging 4.879. That is where site.googleRating and site.googleReviewCount come
 * from, so the two agree by construction.
 *
 * Twenty are shown. The other thirteen are left out because five carry a rating and
 * no text, three are below five stars, one is a former employee describing working
 * here rather than buying from us, one reads as an internal view of the staff, and
 * four are so short they leave a visibly empty card next to the rest.
 *
 * Quotes are the reviewers' own words. Whitespace, run-together punctuation and
 * missing full stops are tidied; nothing is reworded. Names are case-normalised,
 * since the listing has them in all caps and all lower.
 *
 * Once GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are set, src/lib/google-reviews.ts serves
 * live reviews instead and these become the offline fallback.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "My company started to work with squad international more than a year ago. We are very happy with their services, transparency and result driven approach. Professional team with personal/tailored approach. Really recommend!",
    author: "Vania Tariq",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Squad International is one of the best companies I have ever worked with, they provide the best services. I approached them on behalf of my company at the start of this year. And I have been in business with them since. I would highly recommend working with them.",
    author: "Ahmed Abdullah",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "They are the best in handling the marketing. I am totally satisfied with their service. They have the professionals who are the best in their field. Definitely gonna recommend you.",
    author: "Hishmat Malhani",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "They showed professionalism and handled the tasks as per the given instructions. The instructions were followed to a T. Definitely recommended if you need good service.",
    author: "Muhammad Ali Rahmani",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Very attractive organization. Would recommend anyone to pursue them for their services. Always does their work on time with great professionalism.",
    author: "Mahad Pervaiz",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Had a great experience working with this business line. Would give them a 10/10 for their services. Always does their work on time. Will look forward working with them again.",
    author: "Tabish Zaman",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Excellent services and very attractive organization Squad International Team is professional and update related to all services. Highly recommend. Thanks Mr. Haider Ali.",
    author: "Bilal Hussain",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "I'm a small business owner, partnered with squad international 6 months ago to generate more business. I'm satisfied with the outcomes. Keep it up guys.",
    author: "Bath and Body Essentials",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "I have very good experience with this company and I also prefer you to work with this company because the staff and owner is very humble and friendly.",
    author: "Ibrahim Toufiq",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Got their service few months ago and I should say that they are brilliant at doing their work. Would recommend everyone to contact them if needed!",
    author: "Hawii Girl",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "The best people to handle your marketing. Handled task with total professional behavior. Definitely gonna ask them for future tasks.",
    author: "Ali Akhter",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Total Marketing Solutions and Quick Services. So much satisfied after connecting with Squad International.",
    author: "Ali Raza",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Great telemarketing services. Working with them has boosted my sales. Wonderful experience 👍",
    author: "Mustafa Toufiq",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Totally recommend working with them. They are handling customer services for my restaurant. 👍",
    author: "Faiz Khan",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Thanks squad international appreciate your business and hope do work with you again next time.",
    author: "Hasnain Abbas",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Very professional, managing my clients perfectly. Definitely getting more services from them.",
    author: "Joshua Daniel",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Best telemarketing company 👍 very professional. I get my BPO services from them.",
    author: "Hassan Zakir",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Very happy with the experience. Extremely professional and easy to work with.",
    author: "Denassa Maqsood",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Quality work, timely delivery, highly professionals love to recommend.",
    author: "Iftekhar Hussain",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
  {
    quote:
      "Very professional 👍 authentic leads. Love their work 👍",
    author: "Chocolatechip Cheese",
    role: "Google review",
    rating: 5,
    sourceUrl: site.googleReviewsUrl,
  },
];
