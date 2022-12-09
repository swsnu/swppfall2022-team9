import { fireEvent, render, screen } from "@testing-library/react";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { friendListStub, usersStub } from "server/stubs/users.stub";
import { act } from "react-dom/test-utils";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import { setupStore } from "store/slices";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "store";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderEvaluateQualityPage = (
  preloadedState: PreloadedState<RootState>,
  userId: number,
) => {
  render(
    <AlertContextProvider>
      <Provider store={setupStore(preloadedState)}>
        <MemoryRouter>
          <Routes>
            <Route path="/:userId" element={<EvaluateQualityPage />} />
            <Route path="*" element={<Navigate to={`/${userId}`} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </AlertContextProvider>,
  );
};

describe("<EvaluateQualityPage/>", () => {
  const preloadedState = {
    users: {
      currentUser: usersStub[0],
      friendList: friendListStub,
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EvaluateQualityPage", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
          ],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [{ name: "tag1" }, { name: "tag2" }],
        }),
      });
    await act(async () => {
      renderEvaluateQualityPage(preloadedState, 8);
    });
  });

  it("tests dispatch error", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => {
        return new Error();
      },
    });
    const preloadedStateWithoutFriendList = {
      users: {
        currentUser: usersStub[0],
        friendList: [],
      },
    };
    await act(async () => {
      renderEvaluateQualityPage(preloadedStateWithoutFriendList, 8);
    });
  });

  it("tests add and delete", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
            { name: "정직한" },
          ],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [{ name: "tag1" }, { name: "tag2" }],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => {},
      });
    await act(async () => {
      renderEvaluateQualityPage(preloadedState, 8);
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(input, { target: { value: "tag" } });
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: "정직" } });
    });
    const select = screen.getByText("정직한");
    await act(async () => {
      fireEvent.click(select);
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: "정직" } });
    });
    const add = screen.getByText("추가");
    await act(async () => {
      fireEvent.click(add);
    });

    // Prevent duplication
    await act(async () => {
      fireEvent.change(input, { target: { value: "정직" } });
    });
    const select2 = screen.getAllByText("정직한")[1];
    await act(async () => {
      fireEvent.click(select2);
    });
    await act(async () => {
      fireEvent.click(add);
    });

    const closeButton = screen.getAllByRole("close-icon")[0];
    await act(async () => {
      fireEvent.click(closeButton);
    });
    const submit = screen.getByText("제출");
    await act(async () => {
      fireEvent.click(submit);
    });
    const returnButton = await screen.findByText("프로필로 돌아가기");
    await act(async () => {
      fireEvent.click(returnButton);
    });
  });

  it("tests no userId", async () => {
    mockDispatch.mockReturnValueOnce({
      unwrap: () => {},
    });
    await act(async () => {
      render(
        <AlertContextProvider>
          <Provider store={setupStore(preloadedState)}>
            <EvaluateQualityPage />
          </Provider>
        </AlertContextProvider>,
      );
    });
  });

  it("tests no viewingOneChon", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
            { name: "정직한" },
          ],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          qualityTags: [{ name: "tag1" }, { name: "tag2" }],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => {},
      });
    await act(async () => {
      renderEvaluateQualityPage(preloadedState, 2);
    });
  });
});
