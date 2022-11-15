import { renderWithProviders } from "test-utils/mocks";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

const renderEvaluateQualityPage = () => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/:userId" element={<EvaluateQualityPage />} />
        <Route path="*" element={<Navigate to="/1" />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
  );
};

describe("<EvaluateQualityPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EvaluateQualityPage", async () => {
    renderEvaluateQualityPage();
  });

  it("tests dispatch", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        qualityTags: [{ name: "tag" }, { name: "tag2" }],
      }),
    });
    renderEvaluateQualityPage();
  });

  it("tests add and submit button and delete", async () => {
    renderEvaluateQualityPage();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "sincere" } });
    const select = screen.getByText("Sincere");
    fireEvent.click(select);

    const button = screen.getAllByRole("button");
    fireEvent.click(button[0]);

    const close = await waitFor(() => screen.getAllByRole("close-icon")[0]);
    fireEvent.click(close);
    const submit = screen.getByText("제출");
    fireEvent.click(submit);
  });

  it("tests no-userId", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EvaluateQualityPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  it("tests duplicate tag", async () => {
    renderEvaluateQualityPage();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "sincere" } });
    const select = screen.getByText("Sincere");
    fireEvent.click(select);

    const button = screen.getAllByRole("button");
    fireEvent.click(button[0]);

    fireEvent.change(input, { target: { value: "sincere" } });
    const select2 = screen.getAllByText("Sincere")[1];
    fireEvent.click(select2);
    fireEvent.click(button[0]);
  });

  it("tests onFocus", async () => {
    renderEvaluateQualityPage();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "s" } });
    userEvent.hover(screen.getByText("Honest"));
    fireEvent.click(screen.getByText("Honest"));
    await waitFor(() => screen.getByText("Honest"));
    // this renders honest option
    fireEvent.change(input, { target: { value: "s" } });
  });
});
