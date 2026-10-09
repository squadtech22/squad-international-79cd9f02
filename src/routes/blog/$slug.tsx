import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllPosts } from "@/lib/blog-posts";
import { RichContent } from "@/lib/rich-content";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
    return { post, more };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} | Squad International Blog` },
          { name: "description", content: loaderData.post.excerpt.slice(0, 155) },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt.slice(0, 155) },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { post, more } = Route.useLoaderData();

  return (
    <>
      <section className="surface-dark">
        <div className="container-page max-w-3xl pb-20 pt-36 md:pb-24 md:pt-40">
          <Breadcrumbs parent="/blog" parentLabel="Blog" current={post.category} />
          <h1 className="mt-5 text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-xs uppercase tracking-wider text-offwhite/55">
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {post.readingTime ? ` · ${post.readingTime}` : ""}
            {post.author ? ` · ${post.author}` : ""}
          </p>
        </div>
      </section>

      <article className="container-page max-w-3xl py-16 md:py-20">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mb-10 aspect-[16/9] w-full rounded-lg object-cover"
          />
        )}
        <p className="text-lg leading-relaxed text-charcoal">{post.excerpt}</p>
        {post.content ? (
          <RichContent nodes={post.content} className="rich-article mt-8" />
        ) : (
          <div className="mt-8 space-y-6">
            {(post.body ?? []).map((para) => (
              <p key={para} className="text-base leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        )}
      </article>

      <section className="border-t border-border bg-card py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl text-charcoal">Keep reading</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {more.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group rounded-lg border border-border bg-background p-6 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
              >
                <span className="eyebrow">{p.category}</span>
                <h3 className="mt-3 text-lg text-charcoal group-hover:text-marigold">{p.title}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-charcoal">
                  Read <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
