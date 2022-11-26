import { MemoryRouter, Route, Routes } from "react-router-dom";
import { User } from "server/models/users.model";
import { renderWithProviders } from "test-utils/mocks";

import Graph from "./Graph";

import { OneChonInfo } from "types/friend.types";

import { friendListStub, usersStub } from "server/stubs/users.stub";

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

const renderGraph = (
  user: User | null,
  friendList: OneChonInfo[],
  isSearchMode = false,
  searchWord = "",
) => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Graph />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        users: {
          currentUser: user,
          friendList: friendList,
        },
        search: {
          isSearchMode,
          searchWord,
          filteredFriendList: [],
        },
      },
    },
  );
};

describe("<Graph/>", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("render graph canvas", async () => {
    const renderedGraph = renderGraph(usersStub[0], []);
    renderedGraph.unmount();
  });

  it("render graph canvas with no current user", async () => {
    renderGraph(null, []);
  });

  it("render graph canvas with twochons", async () => {
    const renderedGraph = renderGraph(usersStub[0], friendListStub);
    renderedGraph.unmount();
  });

  it("render graph canvas in search mode", async () => {
    const renderedGraph = renderGraph(
      usersStub[0],
      friendListStub,
      true,
      "keyword",
    );
    renderedGraph.unmount();
  });

  // it("tests img element render", async () => {
  //   const renderedGraph = renderGraph(usersStub[0], friendListStub2);
  //   renderedGraph.unmount();
  // });
});
