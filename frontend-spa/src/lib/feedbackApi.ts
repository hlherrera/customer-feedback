import type { Cafe, Feedback, FeedbackPayload } from "../types";

const cafesPath = "/api/cafes";
const feedbackPath = "/api/feedback";

const readError = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null);
  return (
    body?.detail ?? body?.title ?? "Something went wrong. Please try again."
  );
};

const requestJson = async <ResponseBody>(
  path: string,
  init?: RequestInit,
): Promise<ResponseBody> => {
  const response = await fetch(path, init);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<ResponseBody>;
};

export const listFeedback = (): Promise<Feedback[]> =>
  requestJson<Feedback[]>(feedbackPath);

export const listCafes = (): Promise<Cafe[]> => requestJson<Cafe[]>(cafesPath);

export const createFeedback = (payload: FeedbackPayload): Promise<Feedback> =>
  requestJson<Feedback>(feedbackPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
