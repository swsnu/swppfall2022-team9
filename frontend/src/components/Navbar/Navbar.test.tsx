import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import Navbar from "./Navbar";

const renderNavbar = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
  );
};

describe("<Navbar/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Navbar", async () => {
    renderNavbar();
  });
});
