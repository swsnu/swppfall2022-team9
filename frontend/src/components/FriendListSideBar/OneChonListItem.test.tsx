import { render } from "@testing-library/react";
import OneChonListItem from "./OneChonListItem";

describe("<OneChonListItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OneChonListItem", async () => {
    render(<OneChonListItem user={1} twoChonList={[1, 2]} />);
  });
});
