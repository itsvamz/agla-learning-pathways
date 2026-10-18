import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LANG_LABEL, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function Shell({ children }: { children: ReactNode }) {
  const { s, set, t, learner, reset } = useStore();
  const nav = [
    { to: "/", k: "explore" as const },
    { to: "/route", k: "route" as const },
    { to: "/next", k: "next" as const },
    { to: "/facilitator", k: "facilitator" as const },
  ];
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold text-primary">Agla Kadam</Link>
          <select
            aria-label="Language"
            className="field ml-auto w-auto py-1"
            value={s.lang}
            onChange={(e) => set((x) => ({ ...x, lang: e.target.value as Lang }))}
          >
            {(Object.keys(LANG_LABEL) as Lang[]).map((l) => <option key={l} value={l}>{LANG_LABEL[l]}</option>)}
          </select>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 pb-2" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="nav-link" activeProps={{ "data-active": "true" } as any} activeOptions={{ exact: true }}>
              {t(n.k)}
            </Link>
          ))}
        </nav>
      </header>
      <div className="bg-accent text-accent-foreground">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-2 text-sm">
          <span className="badge-demo">EXAMPLE</span> {t("demo")}
          {learner && (
            <>
              <span className="ml-auto">· {learner.name}</span>
              <button className="underline" onClick={() => set((x) => ({ ...x, learnerId: null }))}>{t("switch")}</button>
            </>
          )}
          <button className="underline" onClick={reset}>{t("reset")}</button>
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}

export function NeedLearner() {
  const { t } = useStore();
  return (
    <div className="card text-center">
      <p className="mb-4">{t("who")}</p>
      <Link to="/" className="btn-primary">{t("explore")}</Link>
    </div>
  );
}
