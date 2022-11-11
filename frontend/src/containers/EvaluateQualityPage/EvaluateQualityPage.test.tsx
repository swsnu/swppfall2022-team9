import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { renderWithProviders } from "test-utils/mocks";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const renderEvaluateQualityPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<EvaluateQualityPage />} />
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
  });

  it("renders EvaluateQualityPage", async () => {
    renderEvaluateQualityPage(alertProviderProps);
  });
});
