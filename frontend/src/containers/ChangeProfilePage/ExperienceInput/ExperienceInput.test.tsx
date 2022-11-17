import { AlertContextProps } from "containers/Context/AlertContext/AlertContext";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { User } from "server/models/users.model";
import ExperienceInput, { ExperienceType } from "./ExperienceInput";
import { screen, fireEvent } from "@testing-library/react";

const mockDispatch = jest.fn();

//useDispatch mocking
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderExperienceInput = (
  user: User | null,
  alertProviderProps?: AlertContextProps,
) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ExperienceInput
              type={ExperienceType.EDUCATION}
              title="Title"
              experienceName="Experience"
              onAddBubble={() => {}}
              bubbles={[
                {
                  name: "name",
                  role: "role",
                  dateStart: "2017-12-12",
                  dateEnd: "2017-12-17",
                },
              ]}
              onDeleteBubble={() => {}}
            />
          }
        />
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

describe("<ExperienceInput/>", () => {
  let alertProviderProps: AlertContextProps;
  beforeEach(() => {
    jest.clearAllMocks();
    alertProviderProps = {
      open: jest.fn(),
      close: jest.fn(),
    };
  });
  it("renders Change Profile Page", async () => {
    renderExperienceInput(null, alertProviderProps);
  });
  it("tests add button", async () => {
    renderExperienceInput(null, alertProviderProps);
    const button = screen.getByText("추가");
    fireEvent.click(button);
  });
  it("tests add button with valid input and onDeleteButton", async () => {
    renderExperienceInput(null, alertProviderProps);
    const dateStart = screen.getByRole("startDate");
    const dateEnd = screen.getByRole("endDate");
    fireEvent.change(dateStart, { target: { value: "2020-10-25" } });
    fireEvent.change(dateEnd, { target: { value: "2021-10-25" } });
    const title = screen.getAllByRole("textbox")[0];
    const experience = screen.getAllByRole("textbox")[1];
    fireEvent.change(title, { target: { value: "title" } });
    fireEvent.change(experience, { target: { value: "experience" } });
    const button = screen.getByText("추가");
    fireEvent.click(button);
    const cancelButton = screen.getByRole("cancel");
    fireEvent.click(cancelButton);
  });
  it("tests add button with invalid date input", async () => {
    renderExperienceInput(null, alertProviderProps);
    const dateStart = screen.getByRole("startDate");
    const dateEnd = screen.getByRole("endDate");
    fireEvent.change(dateStart, { target: { value: "2020-10-25" } });
    fireEvent.change(dateEnd, { target: { value: "2019-10-25" } });
    const title = screen.getAllByRole("textbox")[0];
    const experience = screen.getAllByRole("textbox")[1];
    fireEvent.change(title, { target: { value: "title" } });
    fireEvent.change(experience, { target: { value: "experience" } });
    const button = screen.getByText("추가");
    fireEvent.click(button);
  });
});
