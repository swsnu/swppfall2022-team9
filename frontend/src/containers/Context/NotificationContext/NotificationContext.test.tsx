import { render } from "@testing-library/react";
import { useContext } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "test-utils/mocks";
import { NotificationContext } from "./NotificationContext";

const CustomTest = () => {
  //default is set to 0
  const { unreadMessageCount } = useContext(NotificationContext);

  return (
    <div>
      <div>{unreadMessageCount}</div>
    </div>
  );
};

const renderNotificationTest = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<CustomTest />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
  );
};

describe("NotificationContext", () => {
  it("render notification context", async () => {
    renderNotificationTest();
  });
});
