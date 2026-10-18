import { describe, expect, it } from "vitest";
import {
  affordability,
  bookkeepingAnswer,
  buildPlan,
  canTransitionEvidence,
  evaluate,
  paidWorkUnlocked,
  rupeesToPaise as r,
} from "./rules";

describe("affordability fixture (page 11)", () => {
  const costs = { fee: r(6000), materials: r(700), application: r(100), deposit: r(500), waiverApplied: r(1000) };
  it("cash due is 6300 and gap is 3800 with 2500 available", () => {
    const a = affordability(costs, r(2500), { daysPerMonth: 20, roundTripPerDay: r(40) }, r(1000));
    expect(a.cashDueBeforeStart).toBe(630000);
    expect(a.cashGap).toBe(380000);
    expect(a.monthlyTravel).toBe(80000);
    expect(a.monthlyTravelBalance).toBe(20000);
  });
  it("travel at 70/day creates a 400 monthly shortfall", () => {
    const a = affordability(costs, r(2500), { daysPerMonth: 20, roundTripPerDay: r(70) }, r(1000));
    expect(a.monthlyTravelBalance).toBe(-40000);
  });
  it("unknown fee is not zero", () => {
    const a = affordability({ ...costs, fee: null }, r(9999), { daysPerMonth: 0, roundTripPerDay: 0 }, 0);
    expect(a.incomplete).toBe(true);
    expect(a.cashGap).toBeNull();
  });
});

describe("eligibility", () => {
  it("unknown age stays unknown and does not unlock paid work", () => {
    expect(evaluate({ age: null, education: "class12" }, [{ kind: "min_age", years: 18 }]).state).toBe("unknown");
    expect(paidWorkUnlocked(null)).toBe(false);
    expect(paidWorkUnlocked(17)).toBe(false);
    expect(paidWorkUnlocked(18)).toBe(true);
  });
  it("class 9 does not meet a class 10 requirement", () => {
    expect(evaluate({ age: 14, education: "class9" }, [{ kind: "min_education", level: "class10" }]).state).toBe("does_not_meet");
  });
});

describe("plan capacity", () => {
  it("example plan totals 110 of 180 minutes", () => {
    const p = buildPlan(
      [
        { id: "a", title: "", minutes: 20 },
        { id: "b", title: "", minutes: 30, prereq: ["a"] },
        { id: "c", title: "", minutes: 15 },
        { id: "d", title: "", minutes: 25 },
        { id: "e", title: "", minutes: 20 },
      ],
      180,
    );
    expect(p.total).toBe(110);
    expect(p.remaining).toBe(70);
  });
  it("never exceeds capacity", () => {
    expect(buildPlan([{ id: "a", title: "", minutes: 50 }], 40).total).toBe(0);
  });
});

describe("evidence review", () => {
  it("only facilitators can verify; learners resubmit returned evidence", () => {
    expect(canTransitionEvidence("submitted", "verified", "learner")).toBe(false);
    expect(canTransitionEvidence("submitted", "verified", "facilitator")).toBe(true);
    expect(canTransitionEvidence("returned", "submitted", "learner")).toBe(true);
    expect(canTransitionEvidence("verified", "rejected", "facilitator")).toBe(false);
  });
});

describe("bookkeeping trial", () => {
  it("ignores the duplicate receipt", () => {
    expect(
      bookkeepingAnswer([
        { id: "1", amount: 500, receipt: "R1" },
        { id: "2", amount: -120, receipt: "R2" },
        { id: "3", amount: -120, receipt: "R2" },
      ]),
    ).toEqual({ balance: 380, duplicate: "3" });
  });
});
