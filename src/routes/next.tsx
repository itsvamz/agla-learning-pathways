import { createFileRoute, Link } from "@tanstack/react-router";
import { NeedLearner, Shell } from "@/components/Shell";
import { PATHWAYS } from "@/lib/data";
import { buildPlan, canTransitionEvidence } from "@/lib/rules";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/next")({
  head: () => ({
    meta: [
      { title: "My next step — Agla Kadam" },
      { name: "description", content: "This week's learning plan and application evidence checklist." },
      { property: "og:title", content: "My next step — Agla Kadam" },
      { property: "og:description", content: "A small weekly plan that fits the time you have." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NextPage,
});

function NextPage() {
  const { s, set, t, learner } = useStore();
  if (!learner) return <Shell><NeedLearner /></Shell>;
  const pid = s.routeChoice[learner.id];
  const path = PATHWAYS.find((p) => p.id === pid);
  const cap = (learner.hoursPerWeek ?? 2) * 60;
  const done = s.done[learner.id] ?? [];
  const plan = path ? buildPlan(path.steps, cap) : null;
  const primary = plan?.scheduled.find((i) => !done.includes(i.id));
  const myEvidence = s.evidence.filter((e) => e.learnerId === learner.id);

  const toggle = (id: string) =>
    set((x) => {
      const cur = x.done[learner.id] ?? [];
      return { ...x, done: { ...x.done, [learner.id]: cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id] } };
    });

  const addEvidence = () =>
    set((x) => ({
      ...x,
      evidence: [...x.evidence, { id: `EV-DEMO-${Date.now()}`, learnerId: learner.id, label: "DEMO document photo (redacted sample)", status: "draft", history: ["Created"] }],
    }));
  const submit = (id: string) =>
    set((x) => ({
      ...x,
      evidence: x.evidence.map((e) =>
        e.id === id && canTransitionEvidence(e.status, "submitted", "learner")
          ? { ...e, status: "submitted", history: [...e.history, `Submitted by ${learner.name}`] }
          : e,
      ),
    }));

  return (
    <Shell>
      <h1 className="h1">{t("planQ")}</h1>
      {!path || !plan ? (
        <div className="card">
          <p className="mb-3">Choose a route first so your plan connects to a real next decision.</p>
          <Link to="/route" className="btn-primary">{t("route")}</Link>
        </div>
      ) : (
        <>
          {primary && (
            <div className="card border-primary">
              <div className="text-sm text-muted-foreground">Do this first</div>
              <div className="text-lg font-semibold">{primary.title} · {primary.minutes} min</div>
            </div>
          )}
          <section className="card mt-3">
            <h2 className="h2">{path.title}</h2>
            <ul className="space-y-2">
              {plan.scheduled.map((i) => (
                <li key={i.id}>
                  <label className="flex min-h-11 items-center gap-3">
                    <input type="checkbox" className="size-5 accent-primary" checked={done.includes(i.id)} onChange={() => toggle(i.id)} />
                    <span className={done.includes(i.id) ? "line-through text-muted-foreground" : ""}>{i.title}</span>
                    <span className="ml-auto text-sm text-muted-foreground">{i.minutes} min</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Scheduled {plan.total} of {cap} min this week · {plan.remaining} min free.
              {plan.scheduled.length < path.steps.length && " Some steps wait for next week to fit your time."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Finishing a lesson is learning progress — it is not a qualification or an application.</p>
          </section>
        </>
      )}

      <h2 className="h2 mt-8">{t("appQ")}</h2>
      <section className="card">
        {myEvidence.length === 0 && <p className="text-sm text-muted-foreground">No documents added yet.</p>}
        <ul className="space-y-3">
          {myEvidence.map((e) => (
            <li key={e.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-demo">EXAMPLE</span>
                <span className="flex-1 font-medium">{e.label}</span>
                <span className={`status status-ev-${e.status}`}>Status: {e.status}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{e.history.join(" → ")}</p>
              {(e.status === "draft" || e.status === "returned") && (
                <button className="btn-primary mt-2" onClick={() => submit(e.id)}>{t("submit")}</button>
              )}
            </li>
          ))}
        </ul>
        <button className="btn-ghost mt-3" onClick={addEvidence}>+ Add sample document</button>
      </section>
    </Shell>
  );
}
