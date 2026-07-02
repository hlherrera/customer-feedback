import { render, screen } from "@testing-library/react";
import { emptyFeedbackDraft } from "../constants";
import { FeedbackForm } from "../components/FeedbackForm";
import { emailPattern } from "../lib/feedback";

describe("FeedbackForm", () => {
  it("matches the simple form snapshot", () => {
    const { container } = render(
      <FeedbackForm
        draft={emptyFeedbackDraft()}
        errors={{}}
        isSubmitting={false}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("uses the shared regex for browser email validation", () => {
    render(
      <FeedbackForm
        draft={emptyFeedbackDraft()}
        errors={{}}
        isSubmitting={false}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "pattern",
      emailPattern.source,
    );
  });
});
