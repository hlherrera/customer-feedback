import { render } from "@testing-library/react";
import { emptyFeedbackDraft } from "../constants";
import { FeedbackForm } from "../components/FeedbackForm";

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
});
