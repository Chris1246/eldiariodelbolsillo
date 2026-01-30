import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  console.log("slug:", slug);

  if (!slug) notFound();

  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) notFound();

  // 👇 aquí renderiza tu post como lo tengas armado
  return (
    <main>
      <h1>{post.title}</h1>
      {/* ... */}
    </main>
  );
}
