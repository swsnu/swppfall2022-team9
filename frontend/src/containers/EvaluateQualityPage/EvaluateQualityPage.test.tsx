import { renderWithProviders } from "test-utils/mocks";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { friendListStub, usersStub } from "server/stubs/users.stub";

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

const renderEvaluateQualityPage = (userId: number) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/:userId" element={<EvaluateQualityPage />} />
        <Route path="*" element={<Navigate to={`/${userId}`} />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: usersStub[0],
          friendList: friendListStub
        }
      },
    },
  );
};

describe("<EvaluateQualityPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EvaluateQualityPage", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderEvaluateQualityPage(1);
  });

  it("tests dispatch", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        qualityTags: [{ name: "tag" }, { name: "tag2" }],
      }),
    });
    renderEvaluateQualityPage(1);
  });

  it("tests no-userId", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderWithProviders(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EvaluateQualityPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  it("tests add and submit button and delete", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({}),
      })
      .mockReturnValueOnce({
        unwrap: () => ({ qualityTags: [{ name: "tag" }, { name: "tag2" }] }),
      });
    renderEvaluateQualityPage(8);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "성실한" } });
    const select = screen.getByDisplayValue("성실한");
    await waitFor(() => fireEvent.click(select));

    const add = screen.getByText("추가");
    await waitFor(() => fireEvent.click(add));

    const submit = screen.getByText("제출");
    await waitFor(() => fireEvent.click(submit));
  });

  it("tests qualitytags assigned", async () => {
    mockDispatch
      .mockReturnValue({
        unwrap: () => ({ qualityTags: [{ name: "tag" }, { name: "tag2" }] }),
      })
    renderEvaluateQualityPage(1);
    
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "성실한" } });
    const select = screen.getByDisplayValue("성실한");
    await waitFor(() => fireEvent.click(select));

    const add = screen.getByText("추가");
    await waitFor(() => fireEvent.click(add));
  });
});
