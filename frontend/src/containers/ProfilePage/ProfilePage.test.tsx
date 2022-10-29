import { render } from "@testing-library/react";
import ProfilePage from "./ProfilePage";

describe("<ProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<ProfilePage />);
  });
});
