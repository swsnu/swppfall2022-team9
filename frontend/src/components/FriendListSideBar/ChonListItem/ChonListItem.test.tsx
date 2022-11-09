import { fireEvent, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import ChonListItem from "./ChonListItem";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderChonListItem = () => {
  renderWithProviders(
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ChonListItem
              userId={1}
              firstname="test"
              lastname="test"
              imgUrl="testurl.com"
              twoChonList={[
                { id: 1, firstname: "hi", lastname: "hi", imgUrl: "naver.com" },
              ]}
              isTwoChon={false}
            />
          }
        />
      </Routes>
    </BrowserRouter>,
  );
};

describe("<OneChonListItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OneChonListItem", async () => {
    renderChonListItem();
  });

  it("clicks on usernode", async () => {
    renderChonListItem();
    const userNode = screen.getByRole("NodeClick");
    fireEvent.click(userNode);
  });

  it("clicks on toggle button", async () => {
    renderChonListItem();
    const button = screen.getByRole("button");
    fireEvent.click(button);
  });
});
