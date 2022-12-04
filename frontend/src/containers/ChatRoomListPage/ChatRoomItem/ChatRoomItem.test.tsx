import { chatRoomInfoListStub } from "server/stubs/chat.stub";
import ChatRoomItem from "./ChatRoomItem";
import { fireEvent, render, screen } from "@testing-library/react";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<ChatRoomItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without errors", () => {
    render(<ChatRoomItem chatRoomInfo={chatRoomInfoListStub[0]} />);
  });

  it("should navigate to selected chat room page when clicked", () => {
    render(<ChatRoomItem chatRoomInfo={chatRoomInfoListStub[0]} />);
    const item = screen.getByRole("list");
    fireEvent.click(item);
    expect(mockNavigate).toBeCalledWith(
      `/chat/${chatRoomInfoListStub[0].chatRoomName}/`,
    );
  });
});
