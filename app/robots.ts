import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
if (!siteUrl) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable for robots generation");
}

const robots: MetadataRoute.Robots = {
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${siteUrl}/sitemap.xml`,
};

export default function GET(): MetadataRoute.Robots {
  return robots;
}
