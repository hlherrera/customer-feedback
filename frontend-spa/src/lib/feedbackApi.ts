import type { Feedback, FeedbackPayload } from "../types";

const feedbackPath = "/api/feedback";

const readError = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null);
  return (
    body?.detail ?? body?.title ?? "Something went wrong. Please try again."
  );
};

export const listFeedback = async (): Promise<Feedback[]> => {
  const response = await fetch(feedbackPath);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Feedback[]>;
};

export const createFeedback = async (
  payload: FeedbackPayload,
): Promise<Feedback> => {
  const response = await fetch(feedbackPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Feedback>;
};
