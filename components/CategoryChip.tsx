export type ChipVariant = "neutral" | "accent";

export default function CategoryChip({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: ChipVariant;
}) {
  const base = "rounded-full px-2 py-0.5 text-xs uppercase font-medium inline-block";
  const variants: Record<ChipVariant, string> = {
    // neutral: subtle pill for general categories on dark background
    neutral: "border border-white/10 bg-white/6 text-white",
    // accent: stronger, high-contrast pill used only for Hero and "Economía en simple"
    accent: "border border-transparent bg-amber-400 text-black",
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
