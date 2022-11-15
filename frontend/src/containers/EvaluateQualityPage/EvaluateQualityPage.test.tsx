import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { renderWithProviders } from "test-utils/mocks";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { fireEvent, screen, render, waitFor } from "@testing-library/react";

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

  it("tests add and submit button and delete", async () => {
    renderEvaluateQualityPage();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "sincere" } });
    const select = screen.getByText("Sincere");
    fireEvent.click(select);
    const button = screen.getAllByRole("button");

    fireEvent.click(button[0]);
    fireEvent.click(button[1]);

    const close = screen.getByRole("close-icon");
    fireEvent.click(close);
  });

  it("tests dispatch", async () => {
    // axios.get = jest.fn().mockResolvedValue({
    //   data: [
    //     { value: "tag", label: "tag" },
    //     { value: "tag1", label: "tag1" },
    //   ],
    // });
    mockDispatch.mockReturnValue({
      unwrap: () =>
        Promise.resolve([
          { value: "tag", label: "tag" },
          { value: "tag2", label: "tag2" },
        ]),
    });
    renderEvaluateQualityPage();
  });
});
