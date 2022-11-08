import { render } from "@testing-library/react";
import BackDrop from "./BackDrop";

describe("<BackDrop/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(
      <BackDrop
        removeBackDrop={() => {}}
        propsName=""
        setShowSearchBar={() => {}}
        setInput={() => {}}
      />,
    );
  });
});
