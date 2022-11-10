import { screen, fireEvent, render } from "@testing-library/react";
import SkillTagsButton from "./SkillTagsButton";

describe("<SkillTagsButton/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it("renders SkillTags", async () => {
  //   render(
  //     <SkillTagsButton
  //     // tagName="Test"
  //     // tagsList={[]}
  //     // setProfile={() => {}}
  //     // propsName="skillTags"
  //     />,
  //   );
  // });

  // it("clicks add tags button", async () => {
  //   render(
  //     <SkillTagsButton
  //     // tagName="Test"
  //     // tagsList={[]}
  //     // setProfile={() => {}}
  //     // propsName="skillTags"
  //     />,
  //   );
  //   const button = screen.getByRole("button");
  //   fireEvent.click(button);
  // });

  // it("clicks show search bar button and remove search bar", async () => {
  //   render(
  //     <SkillTagsButton
  //     // tagName="Test"
  //     // tagsList={[]}
  //     // setProfile={() => {}}
  //     // propsName="skillTags"
  //     />,
  //   );
  //   const input = screen.getByRole("textbox");
  //   fireEvent.click(input);
  //   const backdrop = screen.getByRole("backdrop");
  //   fireEvent.click(backdrop);
  // });

  // it("clicks show search bar button and tests set input", async () => {
  //   render(
  //     <SkillTagsButton
  //     // tagName="Test"
  //     // tagsList={[]}
  //     // setProfile={() => {}}
  //     // propsName="skillTags"
  //     />,
  //   );
  //   const input = screen.getByRole("textbox");
  //   fireEvent.click(input);
  //   const backdrop = screen.getByText("Frontend");
  //   fireEvent.click(backdrop);
  //   const button = screen.getByRole("button");
  //   fireEvent.click(button);
  // });
});
