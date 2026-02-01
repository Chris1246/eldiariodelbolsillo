import Link from "next/link";
import Image from "next/image";
import CategoryChip from "@/components/CategoryChip";

export type Category = { title?: string; slug?: string };

export type Post = {
  _id: string;
  title: string;
  slug?: { current?: string };
  publishedAt?: string;
  excerpt?: string;
  featured?: boolean;
  mainImageUrl?: string;
  mainImageAlt?: string;
  categories?: Category[];
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "2-digit" });
}

export default function HeroCard({ post }: { post: Post }) {
  if (!post) return null;

  return (
    <article className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-xs uppercase tracking-wide opacity-70">Portada del día</div>

      {post.mainImageUrl ? (
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg sm:h-48">
          <Image
            src={post.mainImageUrl}
            alt={post.mainImageAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex-1">
        {post.categories?.length ? (
          <div className="mb-2">
            <CategoryChip variant="accent">{post.categories[0]?.title}</CategoryChip>
          </div>
        ) : null}

        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">
          <Link className="hover:underline" href={`/posts/${post.slug?.current}`}>
            {post.title}
          </Link>
        </h2>

        <div className="mt-2 flex items-center gap-3 text-xs opacity-70">
          {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
        </div>

        {post.excerpt ? <p className="mt-3 text-sm opacity-85 line-clamp-3">{post.excerpt}</p> : null}

        <div className="mt-4">
          <Link
            className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            href={`/posts/${post.slug?.current}`}
          >
            Leer →
          </Link>
        </div>
      </div>
    </article>
  );
}
