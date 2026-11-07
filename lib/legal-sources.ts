// ─── Legal Sources Knowledge Base ────────────────────────────────────────────
// Official Indian consumer law references used by RASEED.
// All sources are from government / statutory bodies.
// AI is NOT permitted to cite sections outside this list.

export interface LegalSource {
  id: string;
  title: string;
  section?: string;
  description: string;
  officialUrl: string;
  category: "act" | "rule" | "guideline" | "forum" | "helpline";
  keywords: string[];
}

export const LEGAL_SOURCES: LegalSource[] = [
  // ── Consumer Protection Act 2019 ──────────────────────────────────────────
  {
    id: "cpa2019-s2-6",
    title: "Consumer Protection Act, 2019",
    section: "Section 2(6) — Definition of Complaint",
    description:
      "Defines 'complaint' to include unfair trade practices, defective goods, deficient services, and charging excess price.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["complaint", "definition", "unfair trade", "deficient service"],
  },
  {
    id: "cpa2019-s2-7",
    title: "Consumer Protection Act, 2019",
    section: "Section 2(7) — Definition of Consumer",
    description:
      "A consumer is any person who buys goods or hires services for consideration, for personal use. Online purchases are explicitly included.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["consumer", "definition", "online purchase", "e-commerce"],
  },
  {
    id: "cpa2019-s2-11",
    title: "Consumer Protection Act, 2019",
    section: "Section 2(11) — Definition of Deficiency",
    description:
      "Deficiency means any fault, imperfection, shortcoming or inadequacy in quality, nature and manner of performance required under a service.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["deficiency", "service", "fault", "imperfection"],
  },
  {
    id: "cpa2019-s2-47",
    title: "Consumer Protection Act, 2019",
    section: "Section 2(47) — Unfair Trade Practice",
    description:
      "Includes false representation about goods or services and non-delivery of paid goods.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["unfair trade", "false representation", "non-delivery"],
  },
  {
    id: "cpa2019-s34",
    title: "Consumer Protection Act, 2019",
    section: "Section 34 — Jurisdiction of District Commission",
    description:
      "District Consumer Disputes Redressal Commission has jurisdiction for complaints where the value of goods/services and compensation claimed does not exceed ₹1 crore.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["district commission", "jurisdiction", "DCDRC", "value of claim"],
  },
  {
    id: "cpa2019-s47",
    title: "Consumer Protection Act, 2019",
    section: "Section 47 — Jurisdiction of State Commission",
    description:
      "State Consumer Disputes Redressal Commission handles complaints where the value exceeds ₹1 crore but does not exceed ₹10 crores.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["state commission", "jurisdiction", "SCDRC"],
  },
  {
    id: "cpa2019-s58",
    title: "Consumer Protection Act, 2019",
    section: "Section 58 — Jurisdiction of National Commission (NCDRC)",
    description:
      "NCDRC handles complaints exceeding ₹10 crores in value and appeals from State Commissions.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["NCDRC", "national commission", "jurisdiction"],
  },
  {
    id: "cpa2019-s69",
    title: "Consumer Protection Act, 2019",
    section: "Section 69 — Limitation Period",
    description:
      "A complaint must be filed within two years from the date on which the cause of action arose. The Commission may condone delay if sufficient cause is shown.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["limitation", "two years", "time limit", "filing deadline"],
  },
  {
    id: "cpa2019-s80",
    title: "Consumer Protection Act, 2019",
    section: "Section 80 — Mediation",
    description:
      "The Commission may refer a dispute to mediation before proceeding with a formal hearing, if both parties consent.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/CP%20Act%202019.pdf",
    category: "act",
    keywords: ["mediation", "settlement", "alternative dispute"],
  },

  // ── Consumer Protection (E-Commerce) Rules 2020 ───────────────────────────
  {
    id: "ecomm-rules-2020-r6",
    title: "Consumer Protection (E-Commerce) Rules, 2020",
    section: "Rule 6 — Duties of e-commerce entities",
    description:
      "E-commerce platforms must provide a grievance redressal mechanism, display the name and contact of a Grievance Officer, and acknowledge complaints within 48 hours and resolve within one month.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/e-comm.pdf",
    category: "rule",
    keywords: [
      "e-commerce",
      "grievance officer",
      "grievance redressal",
      "48 hours",
      "one month",
      "online marketplace",
    ],
  },
  {
    id: "ecomm-rules-2020-r7",
    title: "Consumer Protection (E-Commerce) Rules, 2020",
    section: "Rule 7 — Duties of sellers on marketplace",
    description:
      "Sellers must not adopt unfair trade practices, must deliver goods as described, and must honour return and refund policies.",
    officialUrl:
      "https://consumeraffairs.nic.in/sites/default/files/e-comm.pdf",
    category: "rule",
    keywords: ["seller", "marketplace", "return policy", "refund policy", "delivery"],
  },

  // ── Grievance Channels ────────────────────────────────────────────────────
  {
    id: "nch-1800",
    title: "National Consumer Helpline (NCH)",
    description:
      "Toll-free helpline 1800-11-4000 and 14404 run by the Department of Consumer Affairs. Consumers can register complaints against companies. Online registration available at consumerhelpline.gov.in.",
    officialUrl: "https://consumerhelpline.gov.in",
    category: "helpline",
    keywords: ["helpline", "NCH", "1800-11-4000", "14404", "register complaint"],
  },
  {
    id: "edaakhil",
    title: "e-Daakhil — Online Consumer Complaint Portal",
    description:
      "Official portal to file consumer complaints with District, State, or National Consumer Commissions online. No need to visit the forum in person.",
    officialUrl: "https://edaakhil.nic.in",
    category: "forum",
    keywords: ["e-Daakhil", "online filing", "DCDRC", "consumer forum", "edaakhil"],
  },
  {
    id: "pgportal",
    title: "Centralised Public Grievance Redress and Monitoring System (CPGRAMS)",
    description:
      "Government portal for lodging grievances against Central Government departments including DPIIT and MCA, which regulate e-commerce companies.",
    officialUrl: "https://pgportal.gov.in",
    category: "forum",
    keywords: ["CPGRAMS", "government grievance", "central government"],
  },
  {
    id: "rbi-ombudsman",
    title: "RBI Integrated Ombudsman Scheme",
    description:
      "If the dispute involves a failed or disputed payment (debit from bank/UPI without delivery), a complaint can be filed with the RBI Ombudsman against the payment service provider.",
    officialUrl: "https://cms.rbi.org.in",
    category: "forum",
    keywords: ["RBI", "ombudsman", "payment", "UPI", "bank", "debit", "failed transaction"],
  },
];

// ─── Helper: look up sources by keyword ───────────────────────────────────────
export function findRelevantSources(keywords: string[]): LegalSource[] {
  const lower = keywords.map((k) => k.toLowerCase());
  return LEGAL_SOURCES.filter((s) =>
    s.keywords.some((kw) => lower.some((q) => kw.includes(q) || q.includes(kw)))
  );
}

// ─── Helper: get source by ID ─────────────────────────────────────────────────
export function getSourceById(id: string): LegalSource | undefined {
  return LEGAL_SOURCES.find((s) => s.id === id);
}

// ─── Recommended grievance channels by issue type ─────────────────────────────
export const GRIEVANCE_CHANNELS_BY_ISSUE: Record<string, string[]> = {
  product_not_delivered: ["nch-1800", "edaakhil", "ecomm-rules-2020-r6"],
  refund_not_received:   ["nch-1800", "edaakhil", "rbi-ombudsman"],
  order_cancelled_no_refund: ["nch-1800", "edaakhil"],
  defective_product:     ["nch-1800", "edaakhil"],
  other:                 ["nch-1800", "edaakhil"],
};
