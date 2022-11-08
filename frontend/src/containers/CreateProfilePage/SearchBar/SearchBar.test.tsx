import { render } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("<SearchBar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile page", async () => {
    render(
      <SearchBar
        propsName=""
        setShowSearchBar={() => {}}
        setInput={() => {}}
      />,
    );
  });
});
