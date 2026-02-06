import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { ALL_PUBLISHED_POSTS } from "@/sanity/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
if (!siteUrl) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable for sitemap generation");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<{ slug: string; publishedAt?: string }[]>(ALL_PUBLISHED_POSTS);

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date().toISOString(),
    },
    ...posts.map((p) => ({
      url: `${siteUrl}/posts/${p.slug}`,
      lastModified: p.publishedAt ?? new Date().toISOString(),
    })),
  ];

  return urls;
}
