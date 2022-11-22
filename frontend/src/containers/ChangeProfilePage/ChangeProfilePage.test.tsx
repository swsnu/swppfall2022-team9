import { fireEvent, screen, waitFor } from "@testing-library/react";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { User } from "server/models/users.model";
import { profileStub } from "server/stubs/profiles.stub";
import { usersStub } from "server/stubs/users.stub";
import { renderWithProviders } from "test-utils/mocks";
import ChangeProfilePage from "./ChangeProfilePage";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
const callBack = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockFileUpload = jest.fn().mockImplementation(file => {
  callBack(file);
});

jest.mock("use-file-upload", () => ({
  ...jest.requireActual("use-file-upload"),
  useFileUpload: () => {
    return [null, mockFileUpload];
  },
}));

const renderChangeProfilePage = (
  user: User | null,
  alertProviderProps?: AlertContextProps,
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ChangeProfilePage />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: user,
          friendList: [],
        },
      },
    },
    alertProviderProps,
  );
};

describe("<ChangeProfilePage/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });
  it("renders Change Profile Page", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderChangeProfilePage(null, alertProviderProps);
  });
  it("tests dispatch error", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject(new Error()),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[4]);
  });

  it("tests onSubmit navigate with current user", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[4]);
  });
  it("tests onDeleteSkillTag", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        profile: { ...profileStub },
      }),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const input = screen.getAllByRole("textbox")[0];
    fireEvent.change(input, { target: { value: "hi" } });
    const changeButton = screen.getAllByText("추가")[0];
    fireEvent.click(changeButton);
    const cancelButton = screen.getByRole("cancel");
    fireEvent.click(cancelButton);
  });
  it("tests onAddEducation and onDeleteEducation", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        profile: { ...profileStub },
      }),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const dateStart = screen.getAllByRole("startDate")[0];
    const dateEnd = screen.getAllByRole("endDate")[0];
    fireEvent.change(dateStart, { target: { value: "2020-10-25" } });
    fireEvent.change(dateEnd, { target: { value: "2021-10-25" } });
    const inputSchool = screen.getAllByRole("textbox")[1];
    const inputMajor = screen.getAllByRole("textbox")[2];
    fireEvent.change(inputSchool, { target: { value: "snu" } });
    fireEvent.change(inputMajor, { target: { value: "cse" } });
    const addButton = screen.getAllByText("추가")[1];
    fireEvent.click(addButton);
    const cancelButton = screen.getByRole("cancel");
    fireEvent.click(cancelButton);
  });
  it("tests onAddJob and onDeleteJob", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        profile: { ...profileStub },
      }),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const dateStart = screen.getAllByRole("startDate")[1];
    const dateEnd = screen.getAllByRole("endDate")[1];
    fireEvent.change(dateStart, { target: { value: "2020-10-25" } });
    fireEvent.change(dateEnd, { target: { value: "2021-10-25" } });
    const inputSchool = screen.getAllByRole("textbox")[3];
    const inputMajor = screen.getAllByRole("textbox")[4];
    fireEvent.change(inputSchool, { target: { value: "snu" } });
    fireEvent.change(inputMajor, { target: { value: "cse" } });
    const addButton = screen.getAllByText("추가")[2];
    fireEvent.click(addButton);
    const cancelButton = screen.getByRole("cancel");
    fireEvent.click(cancelButton);
  });
  it("tests website and introduction input", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        profile: { ...profileStub },
      }),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const websiteInput = screen.getByRole("website");
    const introInput = screen.getByRole("introduction");
    fireEvent.change(websiteInput, { target: { value: "hi" } });
    fireEvent.change(introInput, { target: { value: "hi" } });
  });
  it("tests img upload", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        profile: { ...profileStub },
      }),
    });
    renderChangeProfilePage(usersStub[0], alertProviderProps);
    const uploadButton = screen.getAllByRole("button")[0];
    fireEvent.click(uploadButton);
    await waitFor(() => expect(mockFileUpload).toHaveBeenCalled());
  });
  // it("tests body of the custom img upload hook", async () => {
  //   mockDispatch.mockReturnValue({
  //     unwrap: () => ({
  //       profile: { ...profileStub },
  //     }),
  //   });
  //   const {result} = renderHook(() => useFileUpload);
  //   renderChangeProfilePage(usersStub[0], alertProviderProps);
  //   const uploadButton = screen.getAllByRole("button")[0];
  //   fireEvent.click(uploadButton);
  //   await waitFor(() => expect(mockFileUpload).toHaveBeenCalled());
  // });
});
