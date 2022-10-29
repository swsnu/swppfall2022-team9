import { render } from "@testing-library/react";
import ChangePasswordPage from "./ChangePasswordPage";

describe("<ChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ChangePasswordPage", async () => {
    render(<ChangePasswordPage />);
  });
});
