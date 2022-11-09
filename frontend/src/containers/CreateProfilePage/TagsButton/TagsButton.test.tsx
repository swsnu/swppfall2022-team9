import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TagsButton from "./TagsButton";
import { Profile } from "server/models/profile.model";

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
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    const init: Profile = {
      id: 1,
      imgUrl: "url",
      qualityTags: ["Computer"],
      majorTags: ["Computer"],
      degreeTags: ["Computer"],
      skillTags: ["Computer"],
      languageTags: ["Computer"],
      website: "web",
      introduction: "hi my name is slim shady",
    };
    useStateSpy.mockImplementation(() => {
      return [init, setState];
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(useStateSpy).toHaveBeenCalled();
  });
});
