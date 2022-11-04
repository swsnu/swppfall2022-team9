import { render } from "@testing-library/react";
import CreateProfilePage from "./CreateProfilePage";

describe("<CreateProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<CreateProfilePage />);
  });
});
