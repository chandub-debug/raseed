/**
 * Client-side session store using localStorage.
 * Keeps the entire DisputeSession so the user can refresh without losing progress.
 */
import type { DisputeSession } from "./types";
import { generateId } from "./utils";

const STORAGE_KEY = "raseed_session";

function createEmptySession(): DisputeSession {
  return {
    id: generateId(),
    currentStep: 1,
    messages: [],
    uploadedFiles: [],
    facts: {},
    analysis: null,
    complaint: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function loadSession(): DisputeSession {
  if (typeof window === "undefined") return createEmptySession();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySession();
    const parsed = JSON.parse(raw) as DisputeSession;
    // Rehydrate Date objects
    parsed.createdAt = new Date(parsed.createdAt);
    parsed.updatedAt = new Date(parsed.updatedAt);
    parsed.messages = parsed.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    parsed.uploadedFiles = parsed.uploadedFiles.map((f) => ({
      ...f,
      uploadedAt: new Date(f.uploadedAt),
    }));
    return parsed;
  } catch {
    return createEmptySession();
  }
}

export function saveSession(session: DisputeSession): void {
  if (typeof window === "undefined") return;
  try {
    session.updatedAt = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage quota exceeded or unavailable
  }
}

export function clearSession(): DisputeSession {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return createEmptySession();
}
