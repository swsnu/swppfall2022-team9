import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { User } from "models/users.model";
import { renderWithProviders } from "test-utils/mocks";
import Graph from "./Graph";
import { usersStub } from "mocks/stubs/users.stub";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  // 그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Navigate: (props: any) => {
    // we need to check navigate to
    mockNavigate(props.to);
    return null;
  },
}));

const renderGraph = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Graph />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
  );
};

describe("<Graph/>", () => {
  it("render graph", async () => {
    renderGraph();
  });
});
