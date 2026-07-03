import { render } from "@testing-library/react";
import { FeedbackList } from "../components/FeedbackList";

describe("FeedbackList", () => {
  it("matches the recent feedback snapshot", () => {
    const { container } = render(
      <FeedbackList
        feedback={[
          {
            id: 1,
            cafe_id: 1,
            email: "person@example.com",
            comment: "Great coffee and calm service.",
            rating: 5,
            highlight: "Coffee",
            created_at: "2026-07-02T00:00:00+00:00",
            cafe: {
              id: 1,
              name: "McDonald's",
              description: "Quick-service cafe counter.",
            },
          },
        ]}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
