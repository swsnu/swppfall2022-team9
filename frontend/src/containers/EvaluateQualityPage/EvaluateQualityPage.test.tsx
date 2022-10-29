import { render } from "@testing-library/react";
import EvaluateQualityPage from "./EvaluateQualityPage";

describe("<EvaluateQualityPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EvaluateQualityPage", async () => {
    render(<EvaluateQualityPage />);
  });
});
