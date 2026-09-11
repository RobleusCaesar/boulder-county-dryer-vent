import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, renderBlogMarkdown } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { CtaBand } from "@/components/site/CtaBand";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.description || post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="site-wrap py-12">
        <p className="kicker">
          <Link href={routes.blog} className="hover:text-teal-700">
            Blog
          </Link>
        </p>
        <h1 className="display mt-2 max-w-3xl text-4xl text-teal-900 sm:text-5xl">{post.title}</h1>
        <p className="mt-3 text-sm text-charcoal-400">{post.date}</p>
        <div
          className="prose-bcdv mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-charcoal-800 [&_h2]:display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-teal-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: renderBlogMarkdown(post.body) }}
        />
      </article>
      <CtaBand />
    </>
  );
}
