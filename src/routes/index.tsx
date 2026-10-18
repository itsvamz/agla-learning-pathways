import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Speak, VoiceInput } from "@/components/Voice";
import { EXPLORE_CARDS, TRIAL_TX, type Learner } from "@/lib/data";
import { bookkeepingAnswer, formatINR, rupeesToPaise } from "@/lib/rules";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero.jpg";
import { Utensils, Shirt, Sun, Wheat } from "lucide-react";

const CARD_ICON = { E03: Utensils, E04: Shirt, E05: Sun, E06: Wheat } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agla Kadam — Explore careers and your next step" },
      { name: "description", content: "Try real work tasks, compare routes and plan your next learning step with a facilitator." },
      { property: "og:title", content: "Agla Kadam — Explore careers" },
      { property: "og:description", content: "Career trials, route comparison and facilitator support for rural learners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explore,
});

const EDU = [
  ["class9", "Class 9"], ["class10", "Class 10 done"], ["class12", "Class 12 done"], ["graduate", "Graduate"],
] as const;

function Explore() {
  const { s, set, t, learner } = useStore();
  if (!learner)
    return (
      <Shell>
        <div className="hero">
          <img src={hero} alt="A student walking a village path toward the sunrise" width={1536} height={768} />
          <div className="hero-text">
            <p className="font-display text-3xl font-bold leading-tight">Your next step, made clear.</p>
            <p className="text-sm opacity-90">Try real work, compare routes, and get help from your facilitator.</p>
          </div>
        </div>
        <h1 className="h1">{t("who")}</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {s.learners.map((l) => (
            <button key={l.id} className="card card-hover flex items-center gap-3 text-left" onClick={() => set((x) => ({ ...x, learnerId: l.id }))}>
              <span className="avatar" aria-hidden>{l.name[0]}</span>
              <span>
                <span className="block font-semibold">{l.name} <span className="text-sm text-muted-foreground">· {l.age ?? t("unknown")} yrs</span></span>
                <span className="block text-sm text-muted-foreground">{l.goal}</span>
              </span>
            </button>
          ))}
        </div>
      </Shell>
    );
  return (
    <Shell>
      <Profile learner={learner} />
      <h2 className="h2 mt-8">{t("trialsQ")}</h2>
      <BookkeepingTrial />
      <RetailTrial />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {EXPLORE_CARDS.map((c) => (
          <div key={c.id} className="card card-hover">
            {(() => { const I = CARD_ICON[c.id as keyof typeof CARD_ICON]; return <span className="icon-chip"><I className="size-5" /></span>; })()}
            <div className="font-semibold">{c.title}</div>
            <p className="text-sm text-muted-foreground">{c.task}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Profile({ learner }: { learner: Learner }) {
  const { set, t } = useStore();
  const [editing, setEditing] = useState(false);
  const [d, setD] = useState({
    age: learner.age?.toString() ?? "",
    education: learner.education ?? "",
    goal: learner.goal,
    hours: learner.hoursPerWeek?.toString() ?? "",
    funds: learner.upfrontFunds == null ? "" : String(learner.upfrontFunds / 100),
  });
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  const save = () => {
    set((x) => ({
      ...x,
      learners: x.learners.map((l) =>
        l.id === learner.id
          ? { ...l, age: num(d.age), education: (d.education || null) as Learner["education"], goal: d.goal,
              hoursPerWeek: num(d.hours), upfrontFunds: rupeesToPaise(num(d.funds)), version: l.version + 1 }
          : l,
      ),
    }));
    setEditing(false);
  };
  const rows: [string, string][] = [
    ["Age", learner.age?.toString() ?? t("unknown")],
    ["Education", EDU.find((e) => e[0] === learner.education)?.[1] ?? t("unknown")],
    ["Interests", learner.interests],
    ["Goal", learner.goal],
    ["Learning hours / week", learner.hoursPerWeek?.toString() ?? t("unknown")],
    ["Money available now", formatINR(learner.upfrontFunds)],
  ];
  return (
    <section className="card">
      <div className="mb-3 flex items-center gap-2">
        <h1 className="h2 m-0 flex-1">{t("profileQ")}</h1>
        <Speak text={rows.map((r) => `${r[0]}: ${r[1]}`).join(". ")} />
      </div>
      {!editing ? (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-sm text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <button className="btn-ghost mt-4" onClick={() => setEditing(true)}>{t("edit")}</button>
        </>
      ) : (
        <div className="space-y-3">
          <VoiceInput label="Age (leave blank if unsure)" value={d.age} onChange={(v) => setD({ ...d, age: v.replace(/\D/g, "") })} />
          <label className="block text-sm font-medium">Education
            <select className="field mt-1" value={d.education} onChange={(e) => setD({ ...d, education: e.target.value })}>
              <option value="">{t("unknown")}</option>
              {EDU.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <VoiceInput label="What do you hope to do next?" value={d.goal} onChange={(v) => setD({ ...d, goal: v })} />
          <VoiceInput label="Learning hours per week" value={d.hours} onChange={(v) => setD({ ...d, hours: v.replace(/\D/g, "") })} />
          <VoiceInput label="Money available now (₹, blank if unknown)" value={d.funds} onChange={(v) => setD({ ...d, funds: v.replace(/\D/g, "") })} />
          <p className="rounded-md bg-muted p-3 text-sm">
            Please confirm: age <b>{d.age || t("unknown")}</b>, money <b>{d.funds ? `₹${d.funds}` : t("unknown")}</b>.
          </p>
          <button className="btn-primary" onClick={save}>{t("save")}</button>
        </div>
      )}
    </section>
  );
}

function BookkeepingTrial() {
  const { s, set, t, learner } = useStore();
  const saved = s.trials[`${learner!.id}:T01`] ?? {};
  const [bal, setBal] = useState(saved.balance ?? "");
  const [dup, setDup] = useState(saved.duplicate ?? "");
  const [refl, setRefl] = useState(saved.reflection ?? "");
  const ans = bookkeepingAnswer(TRIAL_TX);
  const checked = saved.correct !== undefined;
  const submit = () => {
    const correct = Number(bal) === ans.balance && dup === ans.duplicate;
    set((x) => ({ ...x, trials: { ...x.trials, [`${learner!.id}:T01`]: { balance: bal, duplicate: dup, reflection: refl, correct } } }));
  };
  return (
    <section className="card mt-3">
      <h3 className="font-semibold">Trial: Bookkeeping (≈15 min)</h3>
      <p className="text-sm text-muted-foreground">DEMO Shop records. Find the cash balance and the duplicate receipt.</p>
      <table className="my-3 w-full text-sm">
        <tbody>
          {TRIAL_TX.map((x) => (
            <tr key={x.id} className="border-b border-border">
              <td className="py-1">#{x.id}</td><td>{x.label}</td><td>{x.receipt}</td>
              <td className="text-right">{x.amount > 0 ? "+" : ""}₹{x.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">Cash balance (₹)
          <input className="field mt-1" inputMode="numeric" value={bal} onChange={(e) => setBal(e.target.value)} />
        </label>
        <label className="text-sm font-medium">Duplicate row
          <select className="field mt-1" value={dup} onChange={(e) => setDup(e.target.value)}>
            <option value="">—</option>
            {TRIAL_TX.map((x) => <option key={x.id} value={x.id}>#{x.id}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3"><VoiceInput label="Did checking records feel interesting? Why?" value={refl} onChange={setRefl} /></div>
      <button className="btn-primary mt-3" onClick={submit}>{t("check")}</button>
      {checked && (
        <p className="mt-3 rounded-md bg-muted p-3 text-sm" role="status">
          {saved.correct
            ? `✓ Correct. Receipt R-102 appears twice, so row #3 is ignored: 500 − 120 + 250 = ₹${ans.balance}.`
            : "Not quite yet. Tip: look for two rows with the same receipt number, count it once, then add the rest. Try again!"}
        </p>
      )}
    </section>
  );
}

function RetailTrial() {
  const { s, set, learner } = useStore();
  const key = `${learner!.id}:T02`;
  const [txt, setTxt] = useState(s.trials[key]?.reflection ?? "");
  const done = !!s.trials[key];
  return (
    <section className="card mt-3">
      <h3 className="font-semibold">Trial: Retail and customer service (≈15 min)</h3>
      <p className="text-sm">
        A DEMO customer has ₹600 for a school bag. Bag A costs ₹550 (out of stock). Bag B costs ₹480 (in stock).
        What do you tell them, respectfully?
      </p>
      <div className="mt-3"><VoiceInput label="Your reply to the customer" value={txt} onChange={setTxt} /></div>
      <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
        <li>Clear: did you say Bag A is unavailable?</li>
        <li>Facts: did you mention price and budget?</li>
        <li>Next question: did you ask what matters most to them?</li>
      </ul>
      <button className="btn-primary mt-3" onClick={() => set((x) => ({ ...x, trials: { ...x.trials, [key]: { reflection: txt } } }))}>
        Save my answer
      </button>
      {done && <p className="mt-2 text-sm" role="status">✓ Saved. Compare your reply with the three checks above.</p>}
    </section>
  );
}
