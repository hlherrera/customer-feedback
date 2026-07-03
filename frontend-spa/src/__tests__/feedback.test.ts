import { validateFeedbackDraft } from "../lib/feedback";

describe("validateFeedbackDraft", () => {
  it("accepts a complete valid draft", () => {
    expect(
      validateFeedbackDraft({
        cafe_id: 1,
        email: " person@example.com ",
        comment: " Great coffee. ",
        rating: 5,
        highlight: "Coffee",
      }),
    ).toEqual({
      ok: true,
      value: {
        cafe_id: 1,
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
        cafe_id: 1,
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

  it("rejects missing cafe, rating, and highlight values", () => {
    expect(
      validateFeedbackDraft({
        cafe_id: null,
        email: "person@example.com",
        comment: "Great coffee.",
        rating: null,
        highlight: "",
      }),
    ).toEqual({
      ok: false,
      errors: {
        cafe_id: "Choose a cafe.",
        rating: "Choose a rating from 1 to 5.",
        highlight: "Choose one highlight.",
      },
    });
  });
});
