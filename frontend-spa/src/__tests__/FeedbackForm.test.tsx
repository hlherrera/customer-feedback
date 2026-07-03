import { render, screen } from "@testing-library/react";
import { emptyFeedbackDraft } from "../constants";
import { FeedbackForm } from "../components/FeedbackForm";
import { emailPattern } from "../lib/feedback";

const cafes = [
  {
    id: 1,
    name: "McDonald's",
    description: "Quick-service cafe counter.",
  },
];

describe("FeedbackForm", () => {
  it("matches the simple form snapshot", () => {
    const { container } = render(
      <FeedbackForm
        cafes={cafes}
        draft={emptyFeedbackDraft()}
        errors={{}}
        isCafeLoading={false}
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
        cafes={cafes}
        draft={emptyFeedbackDraft()}
        errors={{}}
        isCafeLoading={false}
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

  it("renders cafe options", () => {
    render(
      <FeedbackForm
        cafes={cafes}
        draft={emptyFeedbackDraft()}
        errors={{}}
        isCafeLoading={false}
        isSubmitting={false}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Cafe")).toHaveDisplayValue("Select one");
    expect(
      screen.getByRole("option", { name: "McDonald's" }),
    ).toBeInTheDocument();
  });
});
