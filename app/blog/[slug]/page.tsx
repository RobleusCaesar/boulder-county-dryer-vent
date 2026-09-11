import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { CtaBand } from "@/components/site/CtaBand";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="site-wrap max-w-3xl py-12">
        <p className="kicker">Blog · {post.date}</p>
        <h1 className="display mt-2 text-4xl leading-tight">{post.title}</h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-charcoal-800">
          {post.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <Link href={routes.blog} className="mt-10 inline-block font-semibold text-teal-700">
          ← All notes
        </Link>
      </article>
      <CtaBand />
    </>
  );
}
