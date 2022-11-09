import { screen, render, fireEvent } from "@testing-library/react";
import AccountPage from "./AccountPage";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<AccountPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders account page", async () => {
    render(<AccountPage />);
    const birthdateInput = screen.getByRole("birthdate");
    fireEvent.change(birthdateInput, { target: { value: "1998-06-29" } });
  });

  it("on click change password", async () => {
    render(<AccountPage />);
    const changePasswordButton = screen.getByRole("changePassword");
    fireEvent.click(changePasswordButton);
    expect(mockNavigate).toBeCalledWith("/account/password");
  });

  it("on click logout", async () => {
    render(<AccountPage />);
    const logoutButton = screen.getByRole("button", {
      name: /로그아웃/i,
    });
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("on click delete account", async () => {
    render(<AccountPage />);
    const deleteAccountButton = screen.getByRole("button", {
      name: /계정삭제/i,
    });
    fireEvent.click(deleteAccountButton);
    // TODO: on click delete account
  });
});
