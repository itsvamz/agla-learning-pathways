import type { Costs, Education, Requirement } from "./rules";
import { rupeesToPaise as r } from "./rules";

export type Learner = {
  id: string;
  name: string;
  age: number | null;
  education: Education;
  interests: string;
  goal: string;
  hoursPerWeek: number | null;
  travelMinutes: number | null;
  monthlyTravelBudget: number | null; // paise
  upfrontFunds: number | null; // paise
  version: number;
};

export const LEARNERS: Learner[] = [
  { id: "L001", name: "Asha", age: 14, education: "class9", interests: "Organising events, science", goal: "Explore careers", hoursPerWeek: 4, travelMinutes: 20, monthlyTravelBudget: r(300), upfrontFunds: r(0), version: 1 },
  { id: "L002", name: "Meena", age: 16, education: "class10", interests: "Design, practical tasks", goal: "Continue studying", hoursPerWeek: 5, travelMinutes: 15, monthlyTravelBudget: r(500), upfrontFunds: r(1000), version: 1 },
  { id: "L003", name: "Sana", age: 17, education: "class12", interests: "Arts, reading", goal: "Further study and a scholarship", hoursPerWeek: 6, travelMinutes: 45, monthlyTravelBudget: r(800), upfrontFunds: r(1500), version: 1 },
  { id: "L004", name: "Ravi", age: 19, education: "class12", interests: "Handling records, people", goal: "Earn soon", hoursPerWeek: 3, travelMinutes: 40, monthlyTravelBudget: r(1000), upfrontFunds: r(2500), version: 1 },
  { id: "L005", name: "Noor", age: 22, education: "graduate", interests: "Writing, office work", goal: "Entry-level work using my degree", hoursPerWeek: 8, travelMinutes: 60, monthlyTravelBudget: r(1200), upfrontFunds: r(3000), version: 1 },
  { id: "L006", name: "Kiran", age: null, education: null, interests: "Not sure yet", goal: "Explore", hoursPerWeek: 3, travelMinutes: null, monthlyTravelBudget: null, upfrontFunds: r(0), version: 1 },
];

export type Pathway = {
  id: "PATH_STUDY" | "PATH_RECORDS" | "PATH_SERVICE";
  title: string;
  summary: string;
  requirements: Requirement[];
  paidWork: boolean;
  costs: Costs;
  travelPerDay: number | null;
  daysPerMonth: number;
  steps: { id: string; title: string; minutes: number; prereq?: string[] }[];
  sources: { title: string; url: string; status: "published" | "estimated" | "unknown"; dataClass: "public_reference" | "synthetic_demo" }[];
};

export const PATHWAYS: Pathway[] = [
  {
    id: "PATH_STUDY",
    title: "Continue formal education",
    summary: "Next school or higher-study step for your stage, with scholarships to check.",
    requirements: [{ kind: "min_education", level: "class9" }],
    paidWork: false,
    costs: { fee: r(0), materials: r(300), application: null, deposit: r(0), waiverApplied: r(0) },
    travelPerDay: r(20), daysPerMonth: 22,
    steps: [
      { id: "s1", title: "Explore subjects on DIKSHA", minutes: 20 },
      { id: "s2", title: "Practice: one chapter quiz", minutes: 30, prereq: ["s1"] },
      { id: "s3", title: "Reflect on what you enjoyed", minutes: 15 },
      { id: "s4", title: "Check scholarship document list", minutes: 25 },
      { id: "s5", title: "Talk with your facilitator", minutes: 20 },
    ],
    sources: [
      { title: "DIKSHA learning platform", url: "https://diksha.gov.in", status: "published", dataClass: "public_reference" },
      { title: "National Scholarship Portal", url: "https://scholarships.gov.in", status: "published", dataClass: "public_reference" },
      { title: "Application fee for local college", url: "", status: "unknown", dataClass: "synthetic_demo" },
    ],
  },
  {
    id: "PATH_RECORDS",
    title: "Bookkeeping and office work",
    summary: "Practise records work, then an optional reviewed training route.",
    requirements: [{ kind: "min_education", level: "class10" }],
    paidWork: false,
    costs: { fee: r(6000), materials: r(700), application: r(100), deposit: r(500), waiverApplied: r(1000) },
    travelPerDay: r(40), daysPerMonth: 20,
    steps: [
      { id: "r1", title: "Intro: what a bookkeeper does", minutes: 20 },
      { id: "r2", title: "Practise a cash ledger", minutes: 30, prereq: ["r1"] },
      { id: "r3", title: "Reflect on the bookkeeping trial", minutes: 15 },
      { id: "r4", title: "Check DEMO training document list", minutes: 25 },
      { id: "r5", title: "Facilitator conversation", minutes: 20 },
    ],
    sources: [
      { title: "Skill India Digital", url: "https://www.skillindiadigital.gov.in", status: "published", dataClass: "public_reference" },
      { title: "DEMO Records Training Centre fee", url: "", status: "estimated", dataClass: "synthetic_demo" },
    ],
  },
  {
    id: "PATH_SERVICE",
    title: "Retail and customer service",
    summary: "Customer-handling practice, training, and for adults a supported apprenticeship application.",
    requirements: [{ kind: "min_education", level: "class10" }, { kind: "min_age", years: 18 }],
    paidWork: true,
    costs: { fee: r(0), materials: r(200), application: r(0), deposit: r(0), waiverApplied: r(0) },
    travelPerDay: r(70), daysPerMonth: 20,
    steps: [
      { id: "v1", title: "Intro to customer service", minutes: 20 },
      { id: "v2", title: "Role-play an unavailable item", minutes: 30, prereq: ["v1"] },
      { id: "v3", title: "Reflect on the retail trial", minutes: 15 },
      { id: "v4", title: "Prepare DEMO apprenticeship documents", minutes: 25 },
      { id: "v5", title: "Facilitator conversation", minutes: 20 },
    ],
    sources: [
      { title: "Apprenticeship India", url: "https://www.apprenticeshipindia.gov.in", status: "published", dataClass: "public_reference" },
      { title: "DEMO Retail apprenticeship (open, example)", url: "", status: "estimated", dataClass: "synthetic_demo" },
    ],
  },
];

export const TRIAL_TX = [
  { id: "1", label: "Sale to DEMO customer", amount: 500, receipt: "R-101" },
  { id: "2", label: "Bought stationery", amount: -120, receipt: "R-102" },
  { id: "3", label: "Bought stationery", amount: -120, receipt: "R-102" },
  { id: "4", label: "Sale to DEMO customer", amount: 250, receipt: "R-103" },
];

export const EXPLORE_CARDS = [
  { id: "E03", title: "Hospitality", task: "Organise a meal-service checklist and fix a booking clash." },
  { id: "E04", title: "Apparel and design", task: "Read a customer brief and explain choices within cloth and time limits." },
  { id: "E05", title: "Electrical and solar service", task: "Study a diagram and say when a trained supervisor is needed. Never touch live equipment." },
  { id: "E06", title: "Agriculture and food processing", task: "Plan a packaging sequence from fictional stock records." },
];

export type CaseStatus = "new" | "assigned" | "waiting_learner" | "waiting_provider" | "ready_to_review" | "resolved" | "reopened";
export type FCase = {
  id: string; learnerId: string; issue: string; summary: string;
  owner: string | null; next: string; due: string; status: CaseStatus; history: string[];
};

export const SEED_CASES: FCase[] = [
  { id: "C1", learnerId: "L003", issue: "missing_document", summary: "Needs income certificate (DEMO) for scholarship form", owner: null, next: "Explain which office issues it", due: "2026-10-22", status: "new", history: [] },
  { id: "C2", learnerId: "L006", issue: "eligibility_unclear", summary: "Age and education not yet confirmed", owner: null, next: "Ask Kiran to confirm age and last class", due: "2026-10-25", status: "new", history: [] },
  { id: "C3", learnerId: "L004", issue: "affordability_question", summary: "₹3,800 gap before the records course can start", owner: "Facilitator Priya", next: "Check fee-waiver options", due: "2026-10-20", status: "assigned", history: [] },
];
