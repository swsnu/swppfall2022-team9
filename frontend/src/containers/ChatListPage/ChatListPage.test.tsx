import { render } from "@testing-library/react";
import ChatListPage from "./ChatListPage";

describe("<ChatListPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ChatListPage", async () => {
    render(<ChatListPage />);
  });
});
