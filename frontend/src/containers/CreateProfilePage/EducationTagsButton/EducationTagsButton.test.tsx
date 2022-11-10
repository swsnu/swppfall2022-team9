import { render } from "@testing-library/react";
import EducationTagsButton from "./EducationTagsButton";

describe("<EducationTagsButton/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<EducationTagsButton />);
  });
});
