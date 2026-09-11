import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on dryer vent cleaning in Boulder County — intervals, visits, fire risk, and published prices.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        kicker="Blog"
        title="Notes from the book, not filler"
        lede="How often to clean, what a visit includes, and how the published prices work. No fake reviews and no invented stats."
      />
      <section className="site-wrap grid gap-4 py-12">
        {blogPosts.map((post) => (
          <article key={post.slug} className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">{post.date}</p>
            <h2 className="mt-2 text-2xl font-semibold">
              <Link href={routes.post(post.slug)} className="hover:text-teal-800">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-charcoal-600">{post.excerpt}</p>
            <Link href={routes.post(post.slug)} className="mt-4 inline-block font-semibold text-teal-700">
              Read →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
