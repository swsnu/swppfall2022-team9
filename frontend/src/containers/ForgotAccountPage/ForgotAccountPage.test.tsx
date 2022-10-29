import { render } from "@testing-library/react";
import ForgotAccountPage from "./ForgotAccountPage";

describe("<ForgotAccountPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ForgotAccountPage", async () => {
    render(<ForgotAccountPage />);
  });
});
