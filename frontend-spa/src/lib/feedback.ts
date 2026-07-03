import { z } from "zod";
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

const highlightValues = HIGHLIGHTS as [Highlight, ...Highlight[]];

const feedbackDraftSchema = z.object({
  cafe_id: z
    .number("Choose a cafe.")
    .int("Choose a cafe.")
    .min(1, "Choose a cafe."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .regex(emailPattern, "Enter a valid email address."),
  comment: z.string().trim().min(1, "Comment is required."),
  rating: z
    .number("Choose a rating from 1 to 5.")
    .int("Choose a rating from 1 to 5.")
    .min(1, "Choose a rating from 1 to 5.")
    .max(5, "Choose a rating from 1 to 5."),
  highlight: z.enum(highlightValues, {
    error: "Choose one highlight.",
  }),
});

export const validateFeedbackDraft = (
  draft: FeedbackDraft,
): ValidationResult => {
  const result = feedbackDraftSchema.safeParse(draft);

  if (!result.success) {
    return { ok: false, errors: toFeedbackErrors(result.error.issues) };
  }

  return {
    ok: true,
    value: result.data,
  };
};

const toFeedbackErrors = (issues: z.core.$ZodIssue[]): FeedbackErrors =>
  issues.reduce<FeedbackErrors>((errors, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      return { ...errors, [field]: issue.message };
    }
    return errors;
  }, {});

export const formatFeedbackDate = (value: string): string => value.slice(0, 10);
