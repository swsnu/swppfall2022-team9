import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { renderWithProviders } from "test-utils/mocks";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { fireEvent, screen, render } from "@testing-library/react";

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

const renderEvaluateQualityPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<EvaluateQualityPage />} />
        {/* <Route path="*" element={<Navigate to="/1" />} /> */}
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
    alertProviderProps,
  );
};

describe("<EvaluateQualityPage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
    // jest.mock("react-router-dom", () => ({
    //   ...jest.requireActual("react-router-dom"),
    //   useParams: () => ({
    //     connectionId: "12",
    //   }),
    // }));
  });

  it("renders EvaluateQualityPage", async () => {
    renderEvaluateQualityPage(alertProviderProps);
  });

  it("renders EvaluateQualityPage", async () => {
    renderEvaluateQualityPage(alertProviderProps);
    axios.get = jest.fn().mockResolvedValue({
      data: [{ name: "tag1" }, { name: "tag2" }, { name: "tag3" }],
    });
    screen.debug();
  });
});
