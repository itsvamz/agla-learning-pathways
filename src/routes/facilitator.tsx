import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import type { CaseStatus } from "@/lib/data";
import { canTransitionEvidence, type ReviewStatus } from "@/lib/rules";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/facilitator")({
  head: () => ({
    meta: [
      { title: "Facilitator queue — Agla Kadam" },
      { name: "description", content: "Cases that need help, the exact blocker, owner and due date." },
      { property: "og:title", content: "Facilitator queue — Agla Kadam" },
      { property: "og:description", content: "Resolve learner blockers and review evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Facilitator,
});

const ME = "Facilitator Priya";

function Facilitator() {
  const { s, set, t } = useStore();
  const name = (id: string) => s.learners.find((l) => l.id === id)?.name ?? id;
  const cases = [...s.cases].sort((a, b) => (a.status === "resolved" ? 1 : 0) - (b.status === "resolved" ? 1 : 0) || a.due.localeCompare(b.due));
  const move = (id: string, status: CaseStatus, note: string) =>
    set((x) => ({
      ...x,
      cases: x.cases.map((c) => (c.id === id ? { ...c, status, owner: c.owner ?? ME, history: [...c.history, `${new Date().toLocaleString("en-IN")} · ${ME}: ${note}`] } : c)),
    }));
  const review = (id: string, to: ReviewStatus) => {
    const reason = to === "returned" ? prompt("Exact reason for returning?") ?? "" : "";
    if (to === "returned" && !reason) return;
    set((x) => ({
      ...x,
      evidence: x.evidence.map((e) =>
        e.id === id && canTransitionEvidence(e.status, to, "facilitator")
          ? { ...e, status: to, history: [...e.history, `${to} by ${ME}${reason ? `: ${reason}` : ""} (within demo)`] }
          : e,
      ),
    }));
  };
  const pending = s.evidence.filter((e) => e.status === "submitted");

  return (
    <Shell>
      <h1 className="h1">{t("queueQ")}</h1>
      <p className="mb-4 text-sm text-muted-foreground">Signed in as {ME} (demo facilitator). No messages are sent outside this prototype.</p>
      <div className="space-y-3">
        {cases.map((c) => (
          <article key={c.id} className="card">
            <div className="flex flex-wrap items-center gap-2">
              <b className="flex-1">{name(c.learnerId)} · {c.issue.replace(/_/g, " ")}</b>
              <span className="status">Status: {c.status.replace(/_/g, " ")}</span>
            </div>
            <p className="mt-1">{c.summary}</p>
            <p className="text-sm text-muted-foreground">Next: {c.next} · Owner: {c.owner ?? "Unassigned"} · Due {c.due} (example date)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {!c.owner && <button className="btn-primary" onClick={() => move(c.id, "assigned", "Claimed")}>Claim</button>}
              {c.status !== "resolved" && <button className="btn-ghost" onClick={() => move(c.id, "waiting_learner", "Followed up, waiting on learner")}>Waiting on learner</button>}
              {c.status !== "resolved" && <button className="btn-ghost" onClick={() => move(c.id, "resolved", "Resolved")}>Resolve</button>}
              {c.status === "resolved" && <button className="btn-ghost" onClick={() => move(c.id, "reopened", "Reopened with new info")}>Reopen</button>}
            </div>
            {c.history.length > 0 && <ul className="mt-2 text-xs text-muted-foreground">{c.history.map((h, i) => <li key={i}>{h}</li>)}</ul>}
          </article>
        ))}
      </div>

      <h2 className="h2 mt-8">Evidence ready to review</h2>
      {pending.length === 0 && <p className="text-sm text-muted-foreground">Nothing waiting.</p>}
      <div className="space-y-3">
        {pending.map((e) => (
          <div key={e.id} className="card">
            <span className="badge-demo">EXAMPLE</span> <b>{name(e.learnerId)}</b> · {e.label}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => review(e.id, "verified")}>Verify</button>
              <button className="btn-ghost" onClick={() => review(e.id, "returned")}>Return with reason</button>
              <button className="btn-ghost" onClick={() => review(e.id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
