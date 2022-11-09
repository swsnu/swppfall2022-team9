import { fireEvent, render, screen } from "@testing-library/react";
import TagsButton from "./TagsButton";

const mockUseState = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux");
  useState: () => mockUseState,
}));

describe("<TagsButton/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders TagsButton", async () => {
    render(
      <TagsButton tagName="Test" setProfile={() => {}} propsName="test" />,
    );
  });

  it("clicks tags button", async () => {
    render(
      <TagsButton tagName="Test" setProfile={() => {}} propsName="test" />,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockUseState).toHaveBeenCalled()
  });
});
