import type { FeedbackDraft, Highlight } from "./types";

export const HIGHLIGHTS: readonly Highlight[] = [
  "Food",
  "Coffee",
  "Service",
  "Atmosphere",
];

export const RATINGS = [1, 2, 3, 4, 5] as const;

export const emptyFeedbackDraft = (): FeedbackDraft => ({
  cafe_id: null,
  email: "",
  comment: "",
  rating: null,
  highlight: "",
});
