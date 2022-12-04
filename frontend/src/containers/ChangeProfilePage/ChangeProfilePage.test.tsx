import { fireEvent, screen } from "@testing-library/react";
import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { act } from "react-dom/test-utils";
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

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// jest.mock("use-file-upload", () => ({
//   ...jest.requireActual("use-file-upload"),
//   useFileUpload: () => {
//     return [null, mockFileUpload];
//   },
// }));

const renderChangeProfilePage = (
  currentUser: User | null,
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
          currentUser,
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
    mockDispatch.mockReturnValue({
      unwrap: () => ({ ...profileStub }),
    });
  });
  it("renders Change Profile Page", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
  });
  it("tests dispatch error", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject(new Error()),
    });
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[4]);
  });

  it("tests onSubmit navigate with current user", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
    const submitButton = screen.getByRole("button", { name: "프로필 변경" });
    fireEvent.click(submitButton);
  });
  it("tests website and introduction input", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
    const websiteInput = screen.getByRole("website");
    const introInput = screen.getByRole("introduction");
    fireEvent.change(websiteInput, { target: { value: "hi" } });
    fireEvent.change(introInput, { target: { value: "hi" } });
  });
  it("tests onDeleteSkillTag", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
    const input = screen.getAllByRole("textbox")[0];
    fireEvent.change(input, { target: { value: "hi" } });
    const changeButton = screen.getAllByText("추가")[0];
    fireEvent.click(changeButton);
    const cancelButton = screen.getAllByRole("cancel")[0];
    fireEvent.click(cancelButton);
  });
  it("tests onAddJob and onDeleteJob", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
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
    const cancelButton = screen.getAllByRole("cancel")[5];
    fireEvent.click(cancelButton);
  });
  it("tests onAddEducation and onDeleteEducation", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
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
    const cancelButton = screen.getAllByRole("cancel")[3];
    fireEvent.click(cancelButton);
  });
  it("tests img upload", async () => {
    await act(async () =>
      renderChangeProfilePage(usersStub[0], alertProviderProps),
    );
    const uploadButton = screen.getByText("이미지 업로드");
    fireEvent.click(uploadButton);
    // expect(mockFileUpload).toBeCalled();
    // const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    // const { getByLabelText, getByText } = render(<App />);
    // const inputEl = getByLabelText("Upload File");

    // Object.defineProperty(inputEl, "files", {
    //   value: [file],
    // });

    // fireEvent.change(inputEl);
    // const { result } = renderHook(() => useFileUpload());
    // result.current[1]({ accept: "image/*", multiple: false }, jest.fn());

    // user.upload(, new File());
  });
});
