import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import SearchBar from "./SearchBar";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useDispatch: () => mockDispatch,
}));

describe("<SearchBar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SearchBar", async () => {
    renderWithProviders(<SearchBar />);
  });

  it("tests input", async () => {
    renderWithProviders(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hi" } });
  });

  it("tests submit", async () => {
    renderWithProviders(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hi" } });
    const search = screen.getByRole("search")
    fireEvent.submit(search);
  });
});
