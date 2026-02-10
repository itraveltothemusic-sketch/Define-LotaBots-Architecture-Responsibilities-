interface ModuleHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ModuleHeader({ eyebrow, title, description }: ModuleHeaderProps) {
  return (
    <header>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-4xl text-sm text-slate-600">{description}</p>
    </header>
  );
}
