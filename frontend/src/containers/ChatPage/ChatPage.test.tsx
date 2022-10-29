import { render } from "@testing-library/react";
import ChatPage from "./ChatPage";

describe("<ChatPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ChatPage", async () => {
    render(<ChatPage />);
  });
});
