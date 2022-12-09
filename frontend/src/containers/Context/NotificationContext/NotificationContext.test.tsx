import { render } from "@testing-library/react";
import { WS } from "jest-websocket-mock";
import { useContext } from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { usersStub } from "server/stubs/users.stub";
import { setupStore } from "store/slices";
import {
  NotificationContext,
  NotificationContextProvider,
} from "./NotificationContext";

const CustomTest = () => {
  //default is set to 0
  const { unreadMessageCount } = useContext(NotificationContext);

  return (
    <div>
      <div>{unreadMessageCount}</div>
    </div>
  );
};

describe("NotificationContext", () => {
  it("render notification context", async () => {
    const server = new WS("wss://hoshiwoobo.shop:8001/ws/notification/1/", {
      jsonProtocol: true,
    });

    await act(async () => {
      render(
        <Provider
          store={setupStore({
            users: { currentUser: usersStub[0], friendList: [] },
          })}
        >
          <NotificationContextProvider>
            <CustomTest />
          </NotificationContextProvider>
        </Provider>,
      );
    });

    server.send({
      type: "new_message_notification",
      senderId: 1,
      content: "hello",
      timeStamp: "2022-12-04T16:57:37.039Z",
    });
    server.send({ type: "unread_count", messages: 10 });
    server.send({ type: "unknown_type" });
    server.close();
  });
});
