import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LEARNERS, SEED_CASES, type FCase, type Learner, type Pathway } from "./data";
import type { Lang, TKey } from "./i18n";
import { t as tr } from "./i18n";
import type { ReviewStatus } from "./rules";

export type Evidence = { id: string; learnerId: string; label: string; status: ReviewStatus; history: string[] };

type State = {
  lang: Lang;
  learnerId: string | null;
  learners: Learner[];
  routeChoice: Record<string, Pathway["id"]>;
  done: Record<string, string[]>; // learnerId -> step ids
  trials: Record<string, { balance?: string; duplicate?: string; reflection?: string; correct?: boolean }>;
  evidence: Evidence[];
  cases: FCase[];
};

const initial = (): State => ({
  lang: "en", learnerId: null, learners: LEARNERS, routeChoice: {}, done: {}, trials: {},
  evidence: [{ id: "EV-DEMO-1", learnerId: "L003", label: "DEMO application receipt", status: "submitted", history: ["Submitted by Sana (example)"] }],
  cases: SEED_CASES,
});

const KEY = "agla-kadam-demo-v1";
const Ctx = createContext<{ s: State; set: (f: (s: State) => State) => void; reset: () => void; t: (k: TKey) => string } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...initial(), ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, loaded]);
  return (
    <Ctx.Provider value={{ s, set: setS, reset: () => setS({ ...initial(), lang: s.lang }), t: (k) => tr(s.lang, k) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  const learner = c.s.learners.find((l) => l.id === c.s.learnerId) ?? null;
  return { ...c, learner };
}
