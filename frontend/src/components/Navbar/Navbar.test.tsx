import { render } from "@testing-library/react";
import Navbar from "./Navbar";

describe("<Navbar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Navbar", async () => {
    render(<Navbar />);
  });
});
