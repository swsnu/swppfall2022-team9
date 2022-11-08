import { render } from "@testing-library/react";
import AddTagsButton from "./AddTagsButton";

describe("<TagsButton/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Tags", async () => {
    render(
      <AddTagsButton
        tagName="Test"
        tagsList={[]}
        setProfile={() => {}}
        propsName="skillTags"
      />,
    );
  });
});
