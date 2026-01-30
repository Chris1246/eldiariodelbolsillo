import Link from "next/link";

export default function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      {href ? (
        <Link className="text-sm opacity-80 hover:underline" href={href}>
          Ver todas →
        </Link>
      ) : null}
    </div>
  );
}
