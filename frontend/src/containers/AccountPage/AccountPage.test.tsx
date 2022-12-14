import { screen, fireEvent, render, act } from "@testing-library/react";
import {
  AlertContextProps,
  AlertContextProvider,
} from "containers/Context/AlertContext/AlertContext";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { usersStub } from "server/stubs/users.stub";
import { renderWithProviders } from "test-utils/mocks";
import AccountPage from "./AccountPage";
import { setupStore } from "store/slices";
import store from "store";

const renderAccountPage = (alertProviderProps?: AlertContextProps) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AccountPage />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: usersStub[0],
          friendList: [],
        },
      },
    },
    alertProviderProps,
  );
};
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
  let alertProviderProps: AlertContextProps;
  const preloadedState = {
    users: {
      currentUser: usersStub[0],
      friendList: [],
    },
    account: {
      currentAccountInfo: {
        lastname: usersStub[0].lastname,
        firstname: usersStub[0].firstname,
        email: usersStub[0].email,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });

  it("clicks submit", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });
    renderAccountPage(alertProviderProps);
    const form = screen.getByRole("submit");
    fireEvent.submit(form);
  });

  it("on click change password", async () => {
    renderAccountPage(alertProviderProps);
    const changePasswordButton = screen.getByRole("changePassword");
    fireEvent.click(changePasswordButton);
    expect(mockNavigate).toBeCalledWith("/account/password");
  });

  it("on click logout", async () => {
    renderAccountPage(alertProviderProps);
    const logoutButton = screen.getByRole("button", {
      name: /로그아웃/i,
    });
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("tests value change", async () => {
    renderAccountPage(alertProviderProps);
    const lastname = screen.getByRole("lastname");
    fireEvent.change(lastname, { target: { value: "hi" } });
    const firstname = screen.getByRole("firstname");
    fireEvent.change(firstname, { target: { value: "hi" } });
    const email = screen.getByRole("email");
    fireEvent.change(email, { target: { value: "hi" } });
  });

  it("should change account with valid form", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const inputEmail = screen.getByLabelText("이메일");

    const emailButton = screen.getAllByRole("button")[0];
    const submitButton = screen.getByRole("button", { name: "수정하기" });

    await act(async () => {
      fireEvent.change(inputLastName, { target: { value: "" } });
      fireEvent.change(inputFirstName, { target: { value: "" } });
      fireEvent.change(inputEmail, { target: { value: "" } });
    });

    fireEvent.click(submitButton);

    await act(async () => {
      fireEvent.change(inputLastName, { target: { value: "권" } });
      fireEvent.change(inputFirstName, { target: { value: "나라" } });
      fireEvent.change(inputEmail, { target: { value: "ddd" } });
      fireEvent.change(inputEmail, { target: { value: "swpptest@snu.ac.kr" } });
    });

    screen.getByDisplayValue("권");
    screen.getByDisplayValue("나라");
    screen.getByDisplayValue("swpptest@snu.ac.kr");

    await act(async () => {
      fireEvent.click(emailButton);
    });

    const emailConfirmButton = await screen.findByText("확인");

    await act(async () => {
      fireEvent.click(emailConfirmButton);
      fireEvent.click(submitButton);
    });

    const modalButton = await screen.findByRole("button", { name: "확인" });
    fireEvent.click(modalButton);
  });

  it("not changing email", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const submitButton = screen.getByRole("button", { name: "수정하기" });

    await act(async () => {
      fireEvent.change(inputLastName, { target: { value: "권" } });
      fireEvent.change(inputFirstName, { target: { value: "나라" } });
    });

    screen.getByDisplayValue("권");
    screen.getByDisplayValue("나라");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const modalButton = await screen.findByRole("button", { name: "확인" });
    fireEvent.click(modalButton);
  });

  it("tests server error for submission", async () => {
    mockDispatch.mockResolvedValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );

    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const submitButton = screen.getByRole("button", { name: "수정하기" });

    await act(async () => {
      fireEvent.change(inputLastName, { target: { value: "권" } });
      fireEvent.change(inputFirstName, { target: { value: "나라" } });
    });

    screen.getByDisplayValue("권");
    screen.getByDisplayValue("나라");

    await act(async () => {
      fireEvent.click(submitButton);
    });
  });

  it("tests duplicated email", async () => {
    mockDispatch.mockResolvedValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
    const inputLastName = screen.getByLabelText("성");
    const inputFirstName = screen.getByLabelText("이름");
    const inputEmail = screen.getByLabelText("이메일");

    const emailButton = screen.getAllByRole("button")[0];

    await act(async () => {
      fireEvent.change(inputLastName, { target: { value: "권" } });
      fireEvent.change(inputFirstName, { target: { value: "나라" } });
      fireEvent.change(inputEmail, { target: { value: "swpptest@snu.ac.kr" } });
    });

    screen.getByDisplayValue("권");
    screen.getByDisplayValue("나라");
    screen.getByDisplayValue("swpptest@snu.ac.kr");

    await act(async () => {
      fireEvent.click(emailButton);
    });

    const emailConfirmButton = await screen.findByText("확인");

    await act(async () => {
      fireEvent.click(emailConfirmButton);
    });
  });

  it("tests server error for fetchgin account info", async () => {
    mockDispatch.mockResolvedValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={setupStore(preloadedState)}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );

    const confirmButton = await screen.findByText("확인");

    await act(async () => {
      fireEvent.click(confirmButton);
    });
  });

  it("no current user", async () => {
    mockDispatch.mockResolvedValue({ unwrap: () => {} });
    render(
      <AlertContextProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </AlertContextProvider>,
    );
  });
});
