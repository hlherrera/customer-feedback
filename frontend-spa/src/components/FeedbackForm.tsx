import type { SubmitEvent } from "react";
import { Field } from "./Field";
import { HighlightSelect } from "./HighlightSelect";
import { RatingInput } from "./RatingInput";
import type { FeedbackDraft, FeedbackErrors } from "../types";

type FeedbackFormProps = {
  draft: FeedbackDraft;
  errors: FeedbackErrors;
  isSubmitting: boolean;
  onChange: (draft: FeedbackDraft) => void;
  onSubmit: () => void;
};

export const FeedbackForm = ({
  draft,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: FeedbackFormProps) => {
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      className="space-y-5 rounded border border-cafe-200 bg-white p-5 shadow-sm"
      onSubmit={submit}
    >
      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          className="h-11 w-full rounded border border-cafe-200 px-3 text-ink outline-none transition focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100"
          id="email"
          type="email"
          value={draft.email}
          onChange={(event) =>
            onChange({ ...draft, email: event.target.value })
          }
          required
        />
      </Field>

      <Field label="Comment" htmlFor="comment" error={errors.comment}>
        <textarea
          className="min-h-32 w-full rounded border border-cafe-200 px-3 py-2 text-ink outline-none transition focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100"
          id="comment"
          value={draft.comment}
          onChange={(event) =>
            onChange({ ...draft, comment: event.target.value })
          }
          required
        />
      </Field>

      <Field label="Overall rating" error={errors.rating}>
        <RatingInput
          value={draft.rating}
          onChange={(rating) => onChange({ ...draft, rating })}
        />
      </Field>

      <Field
        label="Visit highlight"
        htmlFor="highlight"
        error={errors.highlight}
      >
        <HighlightSelect
          id="highlight"
          value={draft.highlight}
          onChange={(highlight) => onChange({ ...draft, highlight })}
        />
      </Field>

      <button
        className="h-11 w-full rounded bg-cafe-700 px-4 text-sm font-semibold text-white transition hover:bg-cafe-500 disabled:cursor-not-allowed disabled:bg-cafe-200 disabled:text-cafe-700"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit feedback"}
      </button>
    </form>
  );
};
