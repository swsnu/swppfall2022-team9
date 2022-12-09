import { fireEvent, render, screen } from "@testing-library/react";
import { AlertContextProvider } from "containers/Context/AlertContext/AlertContext";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { User } from "server/models/users.model";
import { profileStub, profileStub2 } from "server/stubs/profiles.stub";
import { usersStub } from "server/stubs/users.stub";
import { setupStore } from "store/slices";
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

const renderChangeProfilePage = (currentUser: User | null = null) => {
  render(
    <AlertContextProvider>
      <Provider
        store={setupStore({
          users: {
            currentUser,
            friendList: [],
          },
        })}
      >
        <ChangeProfilePage />
      </Provider>
    </AlertContextProvider>,
  );
};

describe("<ChangeProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("tests dispatch error", async () => {
    mockDispatch.mockResolvedValue({});
    await act(async () => renderChangeProfilePage(usersStub[0]));
    const modalButton = await screen.findByText("홈페이지로 돌아가기");
    fireEvent.click(modalButton);
  });

  it("renders Change Profile Page", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({ ...profileStub }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          skillTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
          ],
        }),
      });
    await act(async () => renderChangeProfilePage(usersStub[0]));
  });

  it("tests onSubmit navigate with current user", async () => {
    await act(async () => renderChangeProfilePage(usersStub[0]));
    const submitButton = screen.getByRole("button", { name: "프로필 변경" });
    fireEvent.click(submitButton);
  });

  it("tests website and introduction input", async () => {
    await act(async () => renderChangeProfilePage(usersStub[0]));
    const websiteInput = screen.getByRole("website");
    const introInput = screen.getByRole("introduction");
    await act(async () => {
      fireEvent.change(websiteInput, { target: { value: "hi" } });
      fireEvent.change(introInput, { target: { value: "hi" } });
    });
  });

  it("tests add and delete", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({ ...profileStub2 }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          skillTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
            { name: "Frontend" },
          ],
        }),
      })
      .mockReturnValueOnce({
        unwrap: () => {},
      });
    await act(async () => {
      renderChangeProfilePage(usersStub[1]);
    });

    const input = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(input, { target: { value: "tag" } });
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: "Front" } });
    });
    const select = screen.getByText("Frontend");
    await act(async () => {
      fireEvent.click(select);
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: "Front" } });
    });
    const add = screen.getAllByText("추가")[0];
    await act(async () => {
      fireEvent.click(add);
    });

    // Prevent duplication
    await act(async () => {
      fireEvent.change(input, { target: { value: "Front" } });
    });
    const select2 = screen.getAllByText("Frontend")[1];
    await act(async () => {
      fireEvent.click(select2);
    });
    await act(async () => {
      fireEvent.click(add);
    });

    const closeButton = screen.getAllByRole("cancel")[0];
    await act(async () => {
      fireEvent.click(closeButton);
    });
    const submit = screen.getByText("프로필 변경");
    await act(async () => {
      fireEvent.click(submit);
    });
  });

  it("tests onAddEducation and onDeleteEducation", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({ ...profileStub2 }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          skillTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
            { name: "Frontend" },
          ],
        }),
      });
    await act(async () => {
      renderChangeProfilePage(usersStub[1]);
    });

    const dateStart = screen.getAllByRole("startDate")[0];
    const dateEnd = screen.getAllByRole("endDate")[0];
    const inputSchool = screen.getAllByRole("textbox")[1];
    const inputMajor = screen.getAllByRole("textbox")[2];
    const addButton = screen.getAllByText("추가")[1];
    const cancelButton = screen.getAllByRole("cancel")[3];
    await act(async () => {
      fireEvent.change(dateStart, { target: { value: "2020-10-25" } });
      fireEvent.change(dateEnd, { target: { value: "2021-10-25" } });
      fireEvent.change(inputSchool, { target: { value: "snu" } });
      fireEvent.change(inputMajor, { target: { value: "cse" } });
      fireEvent.click(addButton);
      fireEvent.click(cancelButton);
    });
  });

  it("tests onAddJob and onDeleteJob", async () => {
    mockDispatch
      .mockReturnValueOnce({
        unwrap: () => ({ ...profileStub2 }),
      })
      .mockReturnValueOnce({
        unwrap: () => ({
          skillTags: [
            { name: "tag1" },
            { name: "tag2" },
            { name: "tag3" },
            { name: "tag4" },
            { name: "tag5" },
            { name: "Frontend" },
          ],
        }),
      });
    await act(async () => {
      renderChangeProfilePage(usersStub[1]);
    });

    const dateStart = screen.getAllByRole("startDate")[1];
    const dateEnd = screen.getAllByRole("endDate")[1];
    const inputJob = screen.getAllByRole("textbox")[0];
    const inputRole = screen.getAllByRole("textbox")[1];
    const addButton = screen.getAllByText("추가")[2];
    const cancelButton = screen.getAllByRole("cancel")[5];
    await act(async () => {
      fireEvent.change(dateStart, { target: { value: "2020-12-25" } });
      fireEvent.change(dateEnd, { target: { value: "2021-12-25" } });
      fireEvent.change(inputJob, { target: { value: "naver" } });
      fireEvent.change(inputRole, { target: { value: "FE" } });
      fireEvent.click(addButton);
      fireEvent.click(cancelButton);
    });
  });

  it("tests img upload", async () => {
    await act(async () => renderChangeProfilePage(usersStub[0]));
    const uploadButton = screen.getByText("이미지 업로드");
    fireEvent.click(uploadButton);
  });
});
