import { useEffect, useState } from "react";
import { emptyFeedbackDraft } from "./constants";
import { FeedbackForm } from "./components/FeedbackForm";
import { FeedbackList } from "./components/FeedbackList";
import { StatusMessage } from "./components/StatusMessage";
import { createFeedback, listFeedback } from "./lib/feedbackApi";
import { validateFeedbackDraft } from "./lib/feedback";
import type { Feedback, FeedbackDraft, FeedbackErrors } from "./types";

type SubmissionStatus = { tone: "success" | "error"; message: string } | null;

const App = () => {
  const [draft, setDraft] = useState<FeedbackDraft>(() => emptyFeedbackDraft());
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [status, setStatus] = useState<SubmissionStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    listFeedback()
      .then((items) => {
        if (active) {
          setFeedback(items);
        }
      })
      .catch((error: Error) => {
        if (active) {
          setStatus({ tone: "error", message: error.message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const submitFeedback = async () => {
    const result = validateFeedbackDraft(draft);

    if (!result.ok) {
      setErrors(result.errors);
      setStatus(null);
      return;
    }

    setErrors({});
    setStatus(null);
    setIsSubmitting(true);

    try {
      const created = await createFeedback(result.value);
      setFeedback((items) => [created, ...items]);
      setDraft(emptyFeedbackDraft());
      setStatus({ tone: "success", message: "Thank you for the feedback." });
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Feedback could not be submitted.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cafe-50 px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase text-sage">
              Local cafe
            </p>
            <h1 className="text-3xl font-semibold text-cafe-700 sm:text-4xl">
              Customer feedback
            </h1>
          </div>

          {status ? (
            <StatusMessage tone={status.tone}>{status.message}</StatusMessage>
          ) : null}

          <FeedbackForm
            draft={draft}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={setDraft}
            onSubmit={submitFeedback}
          />
        </section>

        <FeedbackList feedback={feedback} />
      </div>
    </main>
  );
};

export default App;
