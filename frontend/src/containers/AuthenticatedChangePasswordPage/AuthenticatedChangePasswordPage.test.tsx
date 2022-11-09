import { render } from "@testing-library/react";
import AuthenticatedChangePasswordPage from "./AuthenticatedChangePasswordPage";

describe("<AuthenticatedChangePasswordPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthenticatedChangePasswordPage", async () => {
    render(<AuthenticatedChangePasswordPage />);
  });
});
