import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dryer vent safety, cleaning timing, and Boulder County home tips from Boulder County Dryer Vent.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        kicker="Blog"
        title="Dryer vent tips for Boulder County homes"
        lede="Plain education — when to clean, fire risk, and what fixed-price service includes. No sales gimmicks."
      />
      <section className="site-wrap py-12">
        <ul className="grid gap-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={routes.blogPost(post.slug)} className="card block p-6 hover:shadow-lift">
                <p className="text-sm text-charcoal-400">{post.date}</p>
                <h2 className="display mt-1 text-2xl text-teal-900">{post.title}</h2>
                {post.description ? <p className="mt-2 text-charcoal-700">{post.description}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
