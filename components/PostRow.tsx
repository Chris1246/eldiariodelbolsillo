import Link from "next/link";

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

export default function PostRow({ post }: { post: PostRowItem }) {
  return (
    <article className="rounded-2xl border border-white/10 p-4 hover:bg-white/5">
      <h4 className="font-medium">
        <Link className="hover:underline" href={`/posts/${post.slug?.current}`}>
          {post.title}
        </Link>
      </h4>
      <div className="mt-2 flex flex-wrap gap-2 text-sm opacity-75">
        {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
        {post.categories?.length ? (
          <>
            <span>•</span>
            <span>
              {post.categories.map((c) => c?.title).filter(Boolean).join(", ")}
            </span>
          </>
        ) : null}
      </div>
      {post.excerpt ? <p className="mt-3 text-sm opacity-80">{post.excerpt}</p> : null}
    </article>
  );
}
