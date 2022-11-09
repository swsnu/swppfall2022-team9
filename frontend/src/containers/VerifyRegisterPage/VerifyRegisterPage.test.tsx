import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import VerifyRegisterPage, {
  VerifyRegisterTokenMessage,
} from "./VerifyRegisterPage";

const mockNavigate = jest.fn();
//외부 dependency useNavigate
jest.mock("react-router", () => ({
  //그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();

//useDispatch mockign
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

describe("<VerifyRegisterPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows successful verify register token", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/verify/:token" element={<VerifyRegisterPage />} />
          <Route path="*" element={<Navigate to={"/verify/1"} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => screen.findByText(VerifyRegisterTokenMessage.SUCCESS));
    const goToHomepageButton = screen.getByRole("simpleMessageButton");
    fireEvent.click(goToHomepageButton);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("shows failed verify register token", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/verify/:token" element={<VerifyRegisterPage />} />
          <Route path="*" element={<Navigate to={"/verify/1"} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText(VerifyRegisterTokenMessage.FAIL));
  });

  it("shows loading", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    render(<VerifyRegisterPage />);
    await waitFor(() => screen.getByText(VerifyRegisterTokenMessage.LOADING));
  });
});
