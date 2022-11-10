import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CreateProfilePage from "./CreateProfilePage";
import { Profile } from "server/models/profile.model";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderCreateProfilePage = (currentUser: boolean) => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<CreateProfilePage />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: currentUser
            ? {
                id: 1,
                email: "email@email.com",
                password: "123",
                username: "jubby",
                firstname: "iluv",
                lastname: "swpp",
              }
            : null,
          friendList: [
            {
              id: 1,
              firstname: "swpp",
              lastname: "snu",
              imgUrl: "spl.snu.ac.kr",
              chons: [],
            },
          ],
        },
      },
    },
  );
};

describe("<CreateProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    renderCreateProfilePage(true);
  });

  it("renders profile page without current user", async () => {
    renderCreateProfilePage(false);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("clicks create profile", async () => {
    renderCreateProfilePage(true);
    const button = screen.getByText("프로필 생성");
    fireEvent.click(button);
  });

  it("tests input validation", async () => {
    renderCreateProfilePage(true);
    // const stubValidProfile: Profile = {
    //   id: 1,
    //   imgUrl: "https://naver.com",
    //   qualityTags: ["Sincere"],
    //   majorTags: ["Psychology"],
    //   degreeTags: ["BA"],
    //   skillTags: ["Frontend"],
    //   languageTags: ["English"],
    //   website: "https://naver.com",
    //   introduction: "hello",
    // };
    // React.useState = jest.fn().mockReturnValueOnce([stubValidProfile, {}]);
    const majorInput = screen.getByText("Major");
    console.log(majorInput);
    // fireEvent.change(majorInput, { target: { value: "Psychology" } });
    // console.log(majorInput);
    // const degreeInput = screen.getAllByRole("textbox")[1];
    // fireEvent.change(degreeInput, { target: { value: "BA" } });
    // const qualityInput = screen.getAllByRole("textbox")[2];
    // fireEvent.change(qualityInput, { target: { value: "Sincere" } });
    // const skillInput = screen.getAllByRole("textbox")[3];
    // fireEvent.change(skillInput, { target: { value: "Frontend" } });
    // const langInput = screen.getAllByRole("textbox")[4];
    // fireEvent.change(langInput, { target: { value: "English" } });
    // screen.debug();

    // const webInput = screen.getAllByRole("textbox")[5];
    // fireEvent.change(webInput, { target: { value: "iluvswpp@snu.ac.kr" } });
    // const introInput = screen.getAllByRole("textbox")[6];
    // fireEvent.change(introInput, {
    //   target: { value: "iluvswpp iluvswpp iluvswpp iluvswpp" },
    // });

    const button = screen.getByText("프로필 생성");
    fireEvent.click(button);
  });
});
