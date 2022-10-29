import { render } from "@testing-library/react";
import FriendListSideBar from "./FriendListSideBar";

describe("<FriendListSideBar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders FriendListSideBar", async () => {
    render(<FriendListSideBar />);
  });
});
