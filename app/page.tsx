import { client } from "@/sanity/lib/client";
import { HOME_QUERY } from "@/sanity/lib/queries";
import HeroCard, { Post as HeroPost } from "@/components/HeroCard";
import PostRow from "@/components/PostRow";
import SectionHeader from "@/components/SectionHeader";

export const revalidate = 60;

type Category = { title?: string; slug?: string };

type PostItem = {
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

type HomeQueryResult = {
  hero?: PostItem;
  today?: PostItem[];
  economiaInCategory?: PostItem[];
  economiaFallback?: PostItem[];
  latest?: PostItem[];
};


export default async function HomePage() {
  const data = await client.fetch<HomeQueryResult>(HOME_QUERY);

  const hero = data?.hero ?? data?.latest?.[0] ?? null;

  // today: 5-6 headlines
  const todayCandidates = data?.today ?? [];

  // economia: prefer category results, fallback to matches
  const economiaFromCat = data?.economiaInCategory ?? [];
  const economiaFallback = data?.economiaFallback ?? [];
  const economia: PostItem[] = [];
  economia.push(...economiaFromCat.slice(0, 2));
  if (economia.length < 2) {
    for (const p of economiaFallback) {
      if (economia.length >= 2) break;
      if (!economia.find((e) => e._id === p._id)) economia.push(p);
    }
  }

  // Deduplicate: hero should not appear in today or latest; economy items shouldn't repeat
  const exclude = new Set<string>();
  if (hero) exclude.add(hero._id);

  const today: PostItem[] = [];
  for (const p of todayCandidates) {
    if (today.length >= 6) break;
    if (!exclude.has(p._id)) {
      today.push(p);
      exclude.add(p._id);
    }
  }

  const economiaFinal: PostItem[] = [];
  for (const p of economia) {
    if (!exclude.has(p._id) && economiaFinal.length < 2) {
      economiaFinal.push(p);
      exclude.add(p._id);
    }
  }

  // latest: 12 posts excluding already used
  const latestCandidates = data?.latest ?? [];
  const latest: PostItem[] = [];
  for (const p of latestCandidates) {
    if (latest.length >= 12) break;
    if (!exclude.has(p._id)) {
      latest.push(p);
      exclude.add(p._id);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6">
        <div className="text-sm opacity-70">El Diario del Bolsillo</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Economía en simple, directo a tu bolsillo.
        </h1>
        <p className="mt-3 text-base opacity-80">
          Lo importante del día explicado con ejemplos de vida real (supermercado, bencina, arriendo).
        </p>
      </header>

      {/* Hero */}
      {hero ? <HeroCard post={hero as HeroPost} /> : null}

      {/* Lo de hoy */}
      <section className="mt-8">
        <SectionHeader title={`Lo de hoy`} href="/posts" />
        <div className="space-y-3">
          {today.map((p) => (
            <PostRow key={p._id} post={p} />
          ))}
        </div>
      </section>

      {/* Economía en simple */}
      <section className="mt-8">
        <SectionHeader title={`Economía en simple`} href="/posts?category=economia-en-simple" />
        <div className="space-y-3">
          {economiaFinal.length ? (
            economiaFinal.map((p) => <PostRow key={p._id} post={p} chipVariant="accent" />)
          ) : (
            <p className="text-sm opacity-70">Más economía en simple pronto.</p>
          )}
        </div>
      </section>

      {/* Último */}
      <section className="mt-8">
        <SectionHeader title={`Último`} href="/posts" />
        <div className="space-y-3">
          {latest.map((p) => (
            <PostRow key={p._id} post={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
