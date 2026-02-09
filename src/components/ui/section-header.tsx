interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <header className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-300">{description}</p>
    </header>
  );
}
