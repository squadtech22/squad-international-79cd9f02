import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { getAllPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  loader: () => getAllPosts(),
  head: () => ({
    meta: [
      { title: "Outsourcing Insights Blog | Squad International" },
      {
        name: "description",
        content:
          "Practical writing on outsourcing, customer support operations, lead generation, SOPs and quality control for teams scaling their operations.",
      },
      { property: "og:title", content: "Outsourcing Insights Blog | Squad International" },
      {
        property: "og:description",
        content: "Field notes on support operations, SOPs, quality control and pipeline generation.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Field notes on running operations"
        description="What we've learned building and managing support, assistance and pipeline teams."
      />

      <section className="container-page py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              {p.coverImage && (
                <div className="-mx-6 -mt-6 mb-6 overflow-hidden md:-mx-8 md:-mt-8">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <span className="eyebrow">{p.category}</span>
              <h2 className="mt-3 text-xl text-charcoal">{p.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
                {new Date(p.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {p.readingTime}
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-marigold"
              >
                Read article <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}

        </div>
      </section>

      <CtaBand />
    </>
  );
}
