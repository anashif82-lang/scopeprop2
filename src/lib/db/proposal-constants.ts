import type { SectionKey } from "@/types";

export const SECTION_LABELS: Record<SectionKey, string> = {
  executive_summary: "Executive Summary",
  problem_understanding: "Our Understanding",
  scope_of_work: "Scope of Work",
  deliverables: "Deliverables",
  timeline: "Timeline",
  pricing: "Pricing",
  assumptions: "Assumptions",
  exclusions: "Exclusions",
  next_steps: "Next Steps",
};

export const SECTION_ORDER: SectionKey[] = [
  "executive_summary",
  "problem_understanding",
  "scope_of_work",
  "deliverables",
  "timeline",
  "pricing",
  "assumptions",
  "exclusions",
  "next_steps",
];
