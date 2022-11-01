import { render } from "@testing-library/react";
import TwoChonListItem from "./TwoChonListItem";

describe("<TwoChonListItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders TwoChonListItem", async () => {
    render(<TwoChonListItem />);
  });
});
