// Pure, testable domain rules for Agla Kadam. Money is integer paise; unknown is null.

export type Paise = number | null;
export const rupeesToPaise = (r: number | null) => (r == null ? null : Math.round(r * 100));
export const formatINR = (p: Paise) =>
  p == null ? "Unknown" : `₹${(p / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export type Costs = {
  fee: Paise;
  materials: Paise;
  application: Paise;
  deposit: Paise;
  waiverApplied: Paise;
};

export type Affordability = {
  cashDueBeforeStart: number;
  incomplete: boolean;
  cashGap: Paise;
  monthlyTravel: Paise;
  monthlyTravelBalance: Paise;
};

export function affordability(
  costs: Costs,
  fundsAvailable: Paise,
  travel: { daysPerMonth: number; roundTripPerDay: Paise },
  monthlyTravelBudget: Paise,
): Affordability {
  const parts = [costs.fee, costs.materials, costs.application, costs.deposit];
  const incomplete = parts.some((p) => p == null);
  const due = Math.max(
    0,
    parts.reduce<number>((s, p) => s + (p ?? 0), 0) - (costs.waiverApplied ?? 0),
  );
  const cashGap = fundsAvailable == null || incomplete ? null : Math.max(0, due - fundsAvailable);
  const monthlyTravel =
    travel.roundTripPerDay == null ? null : travel.daysPerMonth * travel.roundTripPerDay;
  const monthlyTravelBalance =
    monthlyTravel == null || monthlyTravelBudget == null ? null : monthlyTravelBudget - monthlyTravel;
  return { cashDueBeforeStart: due, incomplete, cashGap, monthlyTravel, monthlyTravelBalance };
}

export type Education = "class9" | "class10" | "class12" | "graduate" | null;
const eduRank = { class9: 0, class10: 1, class12: 2, graduate: 3 } as const;

export type Eligibility = "meets" | "does_not_meet" | "unknown";
export type EligibilityResult = { state: Eligibility; unmet: string[]; unknown: string[] };

export type Requirement =
  | { kind: "min_education"; level: Exclude<Education, null> }
  | { kind: "min_age"; years: number };

export function evaluate(
  profile: { age: number | null; education: Education },
  reqs: Requirement[],
): EligibilityResult {
  const unmet: string[] = [];
  const unknown: string[] = [];
  for (const r of reqs) {
    if (r.kind === "min_education") {
      if (profile.education == null) unknown.push(`Education level (needs ${r.level})`);
      else if (eduRank[profile.education] < eduRank[r.level]) unmet.push(`Complete ${r.level}`);
    } else {
      if (profile.age == null) unknown.push(`Confirmed age (needs ${r.years}+)`);
      else if (profile.age < r.years) unmet.push(`Age ${r.years} or older`);
    }
  }
  const state: Eligibility = unmet.length ? "does_not_meet" : unknown.length ? "unknown" : "meets";
  return { state, unmet, unknown };
}

/** Paid-work scope only unlocks for a confirmed age of at least 18. */
export const paidWorkUnlocked = (age: number | null) => age != null && age >= 18;

export type PlanItem = { id: string; title: string; minutes: number; prereq?: string[] };

/** Orders prerequisites first and never schedules beyond weekly capacity. */
export function buildPlan(items: PlanItem[], capacityMinutes: number) {
  const ordered: PlanItem[] = [];
  const seen = new Set<string>();
  const visit = (it: PlanItem) => {
    if (seen.has(it.id)) return;
    seen.add(it.id);
    (it.prereq ?? []).forEach((p) => {
      const dep = items.find((i) => i.id === p);
      if (dep) visit(dep);
    });
    ordered.push(it);
  };
  items.forEach(visit);
  const scheduled: PlanItem[] = [];
  let total = 0;
  for (const it of ordered) {
    if (total + it.minutes > capacityMinutes) break;
    scheduled.push(it);
    total += it.minutes;
  }
  return { scheduled, total, remaining: capacityMinutes - total };
}

export type ReviewStatus = "draft" | "submitted" | "returned" | "verified" | "rejected";
const evidenceTransitions: Record<ReviewStatus, ReviewStatus[]> = {
  draft: ["submitted"],
  submitted: ["returned", "verified", "rejected"],
  returned: ["submitted"],
  verified: [],
  rejected: [],
};
export function canTransitionEvidence(
  from: ReviewStatus,
  to: ReviewStatus,
  role: "learner" | "facilitator",
) {
  if (!evidenceTransitions[from].includes(to)) return false;
  if (to === "submitted") return role === "learner";
  return role === "facilitator";
}

/** Bookkeeping trial check: cash balance of the non-duplicate transactions. */
export function bookkeepingAnswer(tx: { id: string; amount: number; receipt: string }[]) {
  const seen = new Set<string>();
  let balance = 0;
  let duplicate: string | null = null;
  for (const t of tx) {
    if (seen.has(t.receipt)) {
      duplicate = t.id;
      continue;
    }
    seen.add(t.receipt);
    balance += t.amount;
  }
  return { balance, duplicate };
}
