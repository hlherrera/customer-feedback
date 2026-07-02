import { HIGHLIGHTS } from "../constants";
import type {
  FeedbackDraft,
  FeedbackErrors,
  FeedbackPayload,
  Highlight,
} from "../types";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  { ok: true; value: FeedbackPayload } | { ok: false; errors: FeedbackErrors };

const isHighlight = (value: string): value is Highlight =>
  HIGHLIGHTS.includes(value as Highlight);

export const validateFeedbackDraft = (
  draft: FeedbackDraft,
): ValidationResult => {
  const email = draft.email.trim();
  const comment = draft.comment.trim();
  const rating = draft.rating;
  const highlight = draft.highlight;
  const errors: FeedbackErrors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!comment) {
    errors.comment = "Comment is required.";
  }

  if (
    rating === null ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    errors.rating = "Choose a rating from 1 to 5.";
  }

  if (!highlight || !isHighlight(highlight)) {
    errors.highlight = "Choose one highlight.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      email,
      comment,
      rating: rating as number,
      highlight: highlight as Highlight,
    },
  };
};

export const formatFeedbackDate = (value: string): string => value.slice(0, 10);
