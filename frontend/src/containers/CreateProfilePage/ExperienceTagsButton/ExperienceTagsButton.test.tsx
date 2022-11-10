import { render } from "@testing-library/react";
import ExperienceTagsButton from "./ExperienceTagsButton";

describe("<ExperienceTagsButton/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(<ExperienceTagsButton />);
  });
});
