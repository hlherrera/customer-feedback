export type Highlight = "Food" | "Coffee" | "Service" | "Atmosphere";

export type Cafe = {
  id: number;
  name: string;
  description: string;
};

export type FeedbackDraft = {
  cafe_id: number | null;
  email: string;
  comment: string;
  rating: number | null;
  highlight: Highlight | "";
};

export type FeedbackPayload = {
  cafe_id: number;
  email: string;
  comment: string;
  rating: number;
  highlight: Highlight;
};

export type Feedback = FeedbackPayload & {
  id: number;
  created_at: string;
  cafe: Cafe;
};

export type FeedbackErrors = Partial<Record<keyof FeedbackDraft, string>>;
