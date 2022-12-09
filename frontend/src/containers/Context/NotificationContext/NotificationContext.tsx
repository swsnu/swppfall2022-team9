import { createContext, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useAppSelector } from "store/hooks";

export interface NotificationContextProps {
  unreadMessageCount: number;
}

const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps,
);

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

const isDevMode = process.env.NODE_ENV === "development";

const NotificationContextProvider = ({ children }: Props): JSX.Element => {
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const wsScheme = isDevMode ? "ws" : "wss";
  const serverAddress = isDevMode ? "127.0.0.1:8000" : "hoshiwoobo.shop:8001";
  const { readyState } = useWebSocket(
    currentUser
      ? `${wsScheme}://${serverAddress}/ws/notification/${currentUser.id}/`
      : null,
    {
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "new_message_notification":
            setUnreadMessageCount(count => (count += 1));
            break;
          case "unread_count":
            setUnreadMessageCount(data.messages);
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    },
  );
  return (
    <NotificationContext.Provider value={{ unreadMessageCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContextProvider, NotificationContext };
