import { messageLogStub } from "server/stubs/chat.stub";
import ChatMessage from "./ChatMessage";
import { fireEvent, render, screen } from "@testing-library/react";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<ChatMessage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without errors", () => {
    render(
      <ChatMessage
        isConsecutive={false}
        content={messageLogStub[0].content}
        timeStamp={messageLogStub[0].timeStamp}
      />,
    );
  });

  it("should navigate to corresponding user profile page when clicked", () => {
    render(
      <ChatMessage
        isConsecutive={false}
        content={messageLogStub[0].content}
        timeStamp={messageLogStub[0].timeStamp}
        imgUrl={"stubUrl"}
        name={"박신혜"}
        userId={2}
      />,
    );
    const userImage = screen.getByRole("img");
    fireEvent.click(userImage);
    expect(mockNavigate).toBeCalledWith(`/profile/${2}`);
  });

  it("should not navigate to corresponding user profile page when clicked for consecutive messages", () => {
    render(
      <ChatMessage
        isConsecutive={true}
        content={messageLogStub[0].content}
        timeStamp={messageLogStub[0].timeStamp}
        imgUrl={"stubUrl"}
        name={"박신혜"}
        userId={2}
      />,
    );
    const userImage = screen.getByRole("img");
    fireEvent.click(userImage);
    expect(mockNavigate).toBeCalledTimes(0);
  });
});
