import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { ChatRoomInfo } from "server/models/chat.model";
import ChatRoomPage from "./ChatRoomPage";
import { User } from "server/models/users.model";
import WS from "jest-websocket-mock";
import { chatRoomInfoListStub, messageLogStub } from "server/stubs/chat.stub";
import { usersStub } from "server/stubs/users.stub";
import { act, fireEvent, screen } from "@testing-library/react";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderChatRoomListPage = (
  alertProviderProps?: AlertContextProps,
  currentUser: User | null = null,
  currentChatRoomInfo: ChatRoomInfo | null = null,
  chatRoomName = "1__2",
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/chat/:chatRoomName/" element={<ChatRoomPage />} />
        <Route path="*" element={<Navigate to={`/chat/${chatRoomName}/`} />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser,
          friendList: [],
        },
        chat: {
          chatRoomInfoList: [],
          currentChatRoomInfo: currentChatRoomInfo,
        },
      },
    },
    alertProviderProps,
  );
};

describe("<ChatRoomPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("should render without errors", () => {
    renderChatRoomListPage(alertProviderProps);
  });

  it("should render with message log", async () => {
    const server = new WS("ws://127.0.0.1:8000/1__2/", { jsonProtocol: true });
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    await act(async () => {
      renderChatRoomListPage(
        alertProviderProps,
        usersStub[0],
        chatRoomInfoListStub[0],
      );
    });

    const input = screen.getByRole("textbox");
    const submitButton = screen.getByText("전송");

    fireEvent.change(input, { target: { value: "안녕하세요" } });
    fireEvent.click(submitButton);

    server.send({ type: "last_50_messages", messages: messageLogStub });
    server.send({
      type: "chat_message_echo",
      senderId: 1,
      content: "hello",
      timeStamp: "2022-12-04T16:57:37.039Z",
    });
    server.send({ type: "unknown_type" });
    server.close();
  });
});
