import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import ChatRoomListPage from "./ChatRoomListPage";
import { ChatRoomInfo } from "server/models/chat.model";
import { chatRoomInfoListStub } from "server/stubs/chat.stub";

const renderChatRoomListPage = (
  alertProviderProps?: AlertContextProps,
  currentChatRoomInfo: ChatRoomInfo | null = null,
  chatRoomInfoList: ChatRoomInfo[] = [],
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/chat" element={<ChatRoomListPage />} />
        <Route path="*" element={<Navigate to={"/chat"} />} />
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

describe("<ChatRoomListPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("should render with empty chatRoomInfoList", () => {
    renderChatRoomListPage(alertProviderProps);
  });

  it("should render without non-empty chatRoomInfoList", () => {
    renderChatRoomListPage(alertProviderProps, null, chatRoomInfoListStub);
  });
});
