import { validateFeedbackDraft } from "../lib/feedback";

describe("validateFeedbackDraft", () => {
  it("accepts a complete valid draft", () => {
    expect(
      validateFeedbackDraft({
        email: " person@example.com ",
        comment: " Great coffee. ",
        rating: 5,
        highlight: "Coffee",
      }),
    ).toEqual({
      ok: true,
      value: {
        email: "person@example.com",
        comment: "Great coffee.",
        rating: 5,
        highlight: "Coffee",
      },
    });
  });

  it("rejects an invalid email", () => {
    expect(
      validateFeedbackDraft({
        email: "person",
        comment: "Great coffee.",
        rating: 5,
        highlight: "Coffee",
      }),
    ).toEqual({
      ok: false,
      errors: {
        email: "Enter a valid email address.",
      },
    });
  });

  it("rejects missing rating and highlight values", () => {
    expect(
      validateFeedbackDraft({
        email: "person@example.com",
        comment: "Great coffee.",
        rating: null,
        highlight: "",
      }),
    ).toEqual({
      ok: false,
      errors: {
        rating: "Choose a rating from 1 to 5.",
        highlight: "Choose one highlight.",
      },
    });
  });
});
