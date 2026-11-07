// ─── Core domain types ───────────────────────────────────────────────────────

export type DisputeStep = 1 | 2 | 3 | 4;

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export type EvidenceStatus = "verified" | "unverified" | "missing";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;        // base64 for display / sending to AI
  uploadedAt: Date;
}

export interface EvidenceClaim {
  id: string;
  claim: string;           // e.g. "I paid ₹15,000"
  category: string;        // e.g. "Payment", "Order", "Communication"
  status: EvidenceStatus;
  linkedFileIds: string[]; // which uploaded files support this
  notes: string;           // e.g. "Supported by payment_receipt.pdf"
}

// ─── Case Facts ───────────────────────────────────────────────────────────────

export interface CaseFacts {
  // extracted from conversation
  productName: string;
  orderDate: string;
  orderAmount: string;
  platform: string;         // e.g. "Amazon", "Flipkart"
  issueType: IssueType;
  issueDescription: string;
  refundStatus: string;
  communicationHistory: string;
  desiredOutcome: string;
  additionalDetails: string;
}

export type IssueType =
  | "product_not_delivered"
  | "refund_not_received"
  | "order_cancelled_no_refund"
  | "defective_product"
  | "other"
  | "";

// ─── Case Analysis ────────────────────────────────────────────────────────────

export interface CaseAnalysis {
  summary: string;
  timeline: TimelineEvent[];
  evidenceClaims: EvidenceClaim[];
  missingEvidence: string[];
  legalGrounds: LegalGround[];
  strengthAssessment: "strong" | "moderate" | "weak";
  strengthReason: string;
  possibleDefenses: string[];   // what the company might argue
  recommendedAction: string;
}

export interface TimelineEvent {
  id: string;
  date: string;             // ISO or human-readable
  event: string;
  evidenceFileId?: string;  // if backed by a file
}

export interface LegalGround {
  section: string;          // e.g. "Section 2(7), Consumer Protection Act 2019"
  description: string;
  sourceId: string;         // references legal sources DB
}

// ─── Complaint ────────────────────────────────────────────────────────────────

export interface ComplaintDraft {
  subject: string;
  to: string;               // e.g. "The Grievance Officer, Amazon India"
  body: string;             // full drafted letter
  reliefSought: string[];   // bullet list of what the user wants
  enclosures: string[];     // list of documents to attach
  nextSteps: NextStep[];
}

export interface NextStep {
  order: number;
  action: string;
  channel: string;          // e.g. "National Consumer Helpline", "NCDRC"
  url?: string;
  notes: string;
}

// ─── Full dispute session state ───────────────────────────────────────────────

export interface DisputeSession {
  id: string;
  currentStep: DisputeStep;
  messages: Message[];
  uploadedFiles: UploadedFile[];
  facts: Partial<CaseFacts>;
  analysis: CaseAnalysis | null;
  complaint: ComplaintDraft | null;
  createdAt: Date;
  updatedAt: Date;
}
