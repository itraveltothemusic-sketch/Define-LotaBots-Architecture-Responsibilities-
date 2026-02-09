import { StatusBadge } from "@/components/ui/status-badge";

interface TopbarProps {
  title: string;
  subtitle: string;
  databaseMode: "connected" | "fixture";
}

export function Topbar({ title, subtitle, databaseMode }: TopbarProps) {
  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            label={
              databaseMode === "connected"
                ? "Neon: Connected"
                : "Neon: Fixture Mode"
            }
            tone={databaseMode === "connected" ? "success" : "warning"}
          />
          <StatusBadge label="ATOS Online" tone="info" />
        </div>
      </div>
    </header>
  );
}
