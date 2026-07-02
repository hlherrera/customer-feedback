export type Highlight = "Food" | "Coffee" | "Service" | "Atmosphere";

export type FeedbackDraft = {
  email: string;
  comment: string;
  rating: number | null;
  highlight: Highlight | "";
};

export type FeedbackPayload = {
  email: string;
  comment: string;
  rating: number;
  highlight: Highlight;
};

export type Feedback = FeedbackPayload & {
  id: number;
  created_at: string;
};

export type FeedbackErrors = Partial<Record<keyof FeedbackDraft, string>>;
