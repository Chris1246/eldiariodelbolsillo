import Link from "next/link";
import CategoryChip from "@/components/CategoryChip";

export type Category = { title?: string; slug?: string };

export type PostRowItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  publishedAt?: string;
  excerpt?: string;
  categories?: Category[];
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "2-digit" });
}

export default function PostRow({ post, chipVariant = "neutral" }: { post: PostRowItem; chipVariant?: "neutral" | "accent" }) {
  return (
    <article className="py-3 border-b border-white/6 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-medium leading-tight text-base overflow-hidden line-clamp-2">
            <Link className="hover:underline" href={`/posts/${post.slug?.current}`}>
              {post.title}
            </Link>
          </h4>

          <div className="mt-1 flex items-center gap-3 text-xs opacity-70">
            {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
          </div>

          {post.excerpt ? <p className="mt-2 text-sm opacity-80 line-clamp-2">{post.excerpt}</p> : null}
        </div>

        {post.categories?.length ? (
          <div className="shrink-0 ml-2">
            <CategoryChip variant={chipVariant}>{post.categories[0]?.title}</CategoryChip>
          </div>
        ) : null}
      </div>
    </article>
  );
}
