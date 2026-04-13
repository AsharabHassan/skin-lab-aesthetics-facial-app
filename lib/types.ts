export type Screen =
  | "landing"
  | "capture"
  | "analyzing"
  | "gate"
  | "results"
  | "booking"
  | "confirmed";

export interface FaceZone {
  id: number;
  name: string;
  concern: string;
  recommendation: string;
  severity: "none" | "mild" | "moderate" | "significant";
  overlayRegion:
    | "midface"
    | "jowls"
    | "jawline"
    | "neck"
    | "nasolabial"
    | "marionette";
}

export interface AnalysisResult {
  faceShape: string;
  overallSummary: string;
  threadLiftScore: number;
  scoreCategory: string;
  candidateSummary: string;
  zones: FaceZone[];
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDays: string[];
  preferredTime?: string;
  marketingConsent: boolean;
}

export interface BookingData {
  date: string;          // ISO date string e.g. "2026-04-15"
  time: string;          // e.g. "12:00 PM"
  slotType: "preference";       // all bookings are preferences confirmed by team
}

export interface AppState {
  screen: Screen;
  imageDataUrl: string | null;
  analysisResult: AnalysisResult | null;
  leadData: LeadData | null;
  bookingData: BookingData | null;
}
