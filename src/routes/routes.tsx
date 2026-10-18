import { createFileRoute } from "@tanstack/react-router";
import { NeedLearner, Shell } from "@/components/Shell";
import { PATHWAYS } from "@/lib/data";
import { affordability, evaluate, formatINR, paidWorkUnlocked } from "@/lib/rules";
import { useStore } from "@/lib/store";
import study from "@/assets/path-study.jpg";
import records from "@/assets/path-records.jpg";
import service from "@/assets/path-service.jpg";

const IMG = { PATH_STUDY: study, PATH_RECORDS: records, PATH_SERVICE: service };

export const Route = createFileRoute("/routes")({
  head: () => ({
    meta: [
      { title: "My route — Agla Kadam" },
      { name: "description", content: "Compare study, records and service routes by requirements and cost." },
      { property: "og:title", content: "My route — Agla Kadam" },
      { property: "og:description", content: "See which routes fit and what they cost before starting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RoutePage,
});

function RoutePage() {
  const { s, set, t, learner } = useStore();
  if (!learner) return <Shell><NeedLearner /></Shell>;
  const chosen = s.routeChoice[learner.id];
  return (
    <Shell>
      <h1 className="h1">{t("routesQ")}</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Decision support only — providers make the final decision. Profile version {learner.version}.
      </p>
      <div className="space-y-4">
        {PATHWAYS.map((p) => {
          const reqs = p.paidWork ? p.requirements : p.requirements;
          const e = evaluate(learner, reqs);
          const a = affordability(p.costs, learner.upfrontFunds, { daysPerMonth: p.daysPerMonth, roundTripPerDay: p.travelPerDay }, learner.monthlyTravelBudget);
          const label = e.state === "meets" ? t("meets") : e.state === "does_not_meet" ? t("does_not_meet") : t("unknownElig");
          const icon = e.state === "meets" ? "✓" : e.state === "does_not_meet" ? "✕" : "?";
          return (
            <article key={p.id} className="card" data-state={e.state}>
              <img src={IMG[p.id]} alt="" className="card-img" loading="lazy" width={992} height={672} />
              <div className="flex flex-wrap items-start gap-2">
                <h2 className="h2 m-0 flex-1">{p.title}</h2>
                <span className={`status status-${e.state}`}>{icon} {label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.summary}</p>
              {e.unmet.length > 0 && <p className="mt-2 text-sm"><b>Missing:</b> {e.unmet.join(", ")} — this stays visible as a future goal.</p>}
              {e.unknown.length > 0 && <p className="mt-2 text-sm"><b>Next question:</b> {e.unknown.join(", ")}</p>}
              {p.paidWork && !paidWorkUnlocked(learner.age) && (
                <p className="mt-2 text-sm">Paid-work steps open only for a confirmed age of 18+ in this prototype. Learning steps stay open.</p>
              )}
              <dl className="mt-3 grid grid-cols-2 gap-2 rounded-md bg-muted p-3 text-sm">
                <dt>Cash needed before start</dt>
                <dd className="font-medium">{formatINR(a.cashDueBeforeStart)}{a.incomplete && " + unknown amounts (incomplete estimate)"}</dd>
                <dt>Gap after your money</dt>
                <dd className="font-medium">{a.cashGap == null ? t("unknown") : formatINR(a.cashGap)}</dd>
                <dt>Monthly travel</dt>
                <dd className="font-medium">{formatINR(a.monthlyTravel)} ({p.daysPerMonth} days × {formatINR(p.travelPerDay)})</dd>
                <dt>Travel budget left</dt>
                <dd className="font-medium">
                  {a.monthlyTravelBalance == null ? t("unknown") : a.monthlyTravelBalance < 0 ? `Short by ${formatINR(-a.monthlyTravelBalance)}` : formatINR(a.monthlyTravelBalance)}
                </dd>
              </dl>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium">Source details</summary>
                <ul className="mt-2 space-y-1">
                  {p.sources.map((src) => (
                    <li key={src.title}>
                      {src.url ? <a className="underline" href={src.url} target="_blank" rel="noreferrer">{src.title}</a> : src.title}
                      {" "}· <i>{src.status}</i> · {src.dataClass === "synthetic_demo" ? "EXAMPLE data" : "public reference"}
                    </li>
                  ))}
                </ul>
              </details>
              <button
                className={chosen === p.id ? "btn-ghost mt-3" : "btn-primary mt-3"}
                onClick={() => set((x) => ({ ...x, routeChoice: { ...x.routeChoice, [learner.id]: p.id } }))}
              >
                {chosen === p.id ? `✓ ${t("chosen")}` : t("choose")}
              </button>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}
