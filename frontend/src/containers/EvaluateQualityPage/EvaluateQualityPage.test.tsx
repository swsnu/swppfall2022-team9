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
        <Route path="/:id" element={<EvaluateQualityPage />} />
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

  it("tests useParams", async () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({
        userId: 1,
      }),
    }));
    renderEvaluateQualityPage();
  });
});
