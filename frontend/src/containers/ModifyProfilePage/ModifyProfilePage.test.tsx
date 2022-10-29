import { render } from "@testing-library/react";
import ModifyProfilePage from "./ModifyProfilePage";

describe("<ModifyProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<ModifyProfilePage />);
  });
});
