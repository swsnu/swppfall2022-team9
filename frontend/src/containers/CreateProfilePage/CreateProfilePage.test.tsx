import { fireEvent, render, screen } from "@testing-library/react";
import CreateProfilePage from "./CreateProfilePage";

describe("<CreateProfilePage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<CreateProfilePage />);
  });

  it("clicks create profile", async () => {
    render(<CreateProfilePage />);
    screen.debug();
    const button = screen.getByText("프로필 생성");
    fireEvent.click(button);
  });

  it("tests urlValidation", async () => {
    render(<CreateProfilePage />);
    const input = screen.getAllByRole("textbox")[5];
    fireEvent.change(input, { target: { value: "iluvswpp@snu.ac.kr" } });
    const button = screen.getByText("프로필 생성");
    fireEvent.click(button);
  });

  it("tests intro input", async () => {
    render(<CreateProfilePage />);
    const input = screen.getAllByRole("textbox")[6];
    fireEvent.change(input, {
      target: { value: "iluvswpp iluvswpp iluvswpp iluvswpp" },
    });
    const button = screen.getByText("프로필 생성");
    fireEvent.click(button);
  });
});
