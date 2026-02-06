import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";

type PageParams = { slug: string };
type PageProps = { params: PageParams | Promise<PageParams> };

type Post = {
  title?: string;
  excerpt?: string;
  featured?: boolean;
  publishedAt?: string;
  body?: PortableTextBlock[];
  slug?: string;
  author?: { name?: string };
  categories?: { title?: string }[];
  mainImageUrl?: string;
  mainImageAlt?: string;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) return {};
  const post = await client.fetch<Post>(POST_BY_SLUG_QUERY, { slug });
  if (!post?.title) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
  const makeAbsolute = (u?: string) => {
    if (!u) return undefined;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (!siteUrl) return u;
    return `${siteUrl}${u.startsWith("/") ? "" : "/"}${u}`;
  };

  const canonical = siteUrl ? `${siteUrl}/posts/${post.slug}` : undefined;
  const imageUrl = makeAbsolute(post.mainImageUrl);

  const metadata: Metadata = {
    title: post.title,
    description: post.excerpt ?? `Artículo: ${post.title}`,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: post.mainImageAlt ?? post.title }] : undefined,
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };

  return metadata;
}

export const revalidate = 60;

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;

  if (!slug) return notFound();

  const post = await client.fetch<Post>(POST_BY_SLUG_QUERY, { slug });

  if (!post?.title) return notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

      <div className="mt-3 text-sm opacity-70">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : null}
        {post.author?.name ? <> • {post.author.name}</> : null}
      </div>

      <article className="prose prose-neutral mt-8 max-w-none">
        {post.body ? <PortableText value={post.body} /> : null}
      </article>
    </main>
  );
}
