import { formatFeedbackDate } from "../lib/feedback";
import type { Feedback } from "../types";

type FeedbackListProps = {
  feedback: Feedback[];
};

export const FeedbackList = ({ feedback }: FeedbackListProps) => (
  <section className="rounded border border-cafe-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-cafe-700">Recent feedback</h2>
      <span className="rounded-full bg-cafe-100 px-3 py-1 text-sm text-cafe-700">
        {feedback.length}
      </span>
    </div>

    {feedback.length === 0 ? (
      <p className="text-sm text-cafe-700">No feedback yet.</p>
    ) : (
      <ul className="space-y-3">
        {feedback.map((item) => (
          <li
            className="rounded border border-cafe-100 bg-cafe-50 p-4"
            key={item.id}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-cafe-700">
              <span className="font-semibold text-ink">{item.email}</span>
              <span>{formatFeedbackDate(item.created_at)}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink">{item.comment}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-cafe-700">
              <span className="rounded-full bg-white px-2.5 py-1">
                {item.rating}/5
              </span>
              <span className="rounded-full bg-white px-2.5 py-1">
                {item.highlight}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);
