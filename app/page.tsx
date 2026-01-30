import Link from "next/link";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

type PostListItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  publishedAt?: string;
  categories?: { title?: string }[];
  excerpt?: string;
  featured?: boolean;
  mainImageUrl?: string;
  mainImageAlt?: string;
};

const LATEST_POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(coalesce(publishedAt, _createdAt) desc)[0...12]{
    _id,
    title,
    excerpt,
    featured,
    slug,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    publishedAt,
    categories[]->{title}
  }
`;

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "2-digit" });
}

export default async function HomePage() {
  const posts = await client.fetch<PostListItem[]>(LATEST_POSTS_QUERY);
  const main = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <div className="text-sm opacity-70">El Diario del Bolsillo</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Economía en simple, directo a tu bolsillo.
        </h1>
        <p className="mt-3 text-base opacity-80">
          Lo importante del día explicado con ejemplos de vida real (supermercado, bencina, arriendo).
        </p>
      </header>

      {/* Noticia del día */}
      {main ? (
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-2 text-xs uppercase tracking-wide opacity-70">Portada del día</div>
          <h2 className="text-2xl font-semibold leading-tight">
            <Link className="hover:underline" href={`/posts/${main.slug?.current}`}>
              {main.title}
            </Link>
          </h2>

          <div className="mt-3 flex flex-wrap gap-2 text-sm opacity-80">
            {main.publishedAt ? <span>{formatDate(main.publishedAt)}</span> : null}
            {main.categories?.length ? (
              <>
                <span>•</span>
                <span>
                  {main.categories
                    .map((c) => c?.title)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </>
            ) : null}
          </div>

          {main.excerpt ? <p className="mt-4 text-sm opacity-85">{main.excerpt}</p> : null}

          <div className="mt-4">
            <Link
              className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
              href={`/posts/${main.slug?.current}`}
            >
              Leer →
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Aún no hay posts publicados</h2>
          <p className="mt-2 opacity-80">
            Publica un post en <code className="opacity-90">/studio</code> y aparecerá aquí.
          </p>
        </section>
      )}

      {/* Más noticias */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-lg font-semibold">Más noticias</h3>
          <Link className="text-sm opacity-80 hover:underline" href="/posts">
            Ver todas →
          </Link>
        </div>

        <div className="space-y-4">
          {rest.map((p) => (
            <article key={p._id} className="rounded-2xl border border-white/10 p-4 hover:bg-white/5">
              <h4 className="font-medium">
                <Link className="hover:underline" href={`/posts/${p.slug?.current}`}>
                  {p.title}
                </Link>
              </h4>
              <div className="mt-2 flex flex-wrap gap-2 text-sm opacity-75">
                {p.publishedAt ? <span>{formatDate(p.publishedAt)}</span> : null}
                {p.categories?.length ? (
                  <>
                    <span>•</span>
                    <span>
                      {p.categories
                        .map((c) => c?.title)
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </>
                ) : null}
              </div>
              {p.excerpt ? <p className="mt-3 text-sm opacity-80">{p.excerpt}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
