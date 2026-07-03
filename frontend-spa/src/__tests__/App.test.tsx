import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { listCafes, listFeedback } from "../lib/feedbackApi";

jest.mock("../lib/feedbackApi", () => ({
  createFeedback: jest.fn(),
  listCafes: jest.fn(),
  listFeedback: jest.fn(),
}));

const mockedListCafes = jest.mocked(listCafes);
const mockedListFeedback = jest.mocked(listFeedback);

describe("App", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("keeps cafe selection available when feedback loading fails", async () => {
    mockedListCafes.mockResolvedValue([
      {
        id: 1,
        name: "McDonald's",
        description: "Quick-service cafe counter.",
      },
    ]);
    mockedListFeedback.mockRejectedValue(new Error("Feedback unavailable."));

    render(<App />);

    const cafeSelect = await screen.findByLabelText("Cafe");

    await waitFor(() => expect(cafeSelect).not.toBeDisabled());
    expect(screen.getByText("Feedback unavailable.")).toBeInTheDocument();

    fireEvent.change(cafeSelect, { target: { value: "1" } });

    expect(cafeSelect).toHaveValue("1");
  });
});
