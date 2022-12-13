import { chatRoomInfoListStub } from "server/stubs/chat.stub";
import ChatRoomItem from "./ChatRoomItem";
import { fireEvent, render, screen } from "@testing-library/react";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { ChatRoomInfo } from "server/models/chat.model";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const renderChatRoomItem = (
  alertProviderProps?: AlertContextProps,
  currentChatRoomInfo: ChatRoomInfo | null = null,
  chatRoomInfoList: ChatRoomInfo[] = [],
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={<ChatRoomItem chatRoomInfo={chatRoomInfoListStub[0]} />}
        />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        chat: {
          chatRoomInfoList: chatRoomInfoList,
          currentChatRoomInfo: currentChatRoomInfo,
        },
      },
    },
    alertProviderProps,
  );
};

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
    renderChatRoomItem();
  });

  it("should navigate to selected chat room page when clicked", () => {
    renderChatRoomItem();

    const item = screen.getByRole("list");
    fireEvent.click(item);
    expect(mockNavigate).toBeCalledWith(
      `/chat/${chatRoomInfoListStub[0].chatRoomName}/`,
    );
  });
});
