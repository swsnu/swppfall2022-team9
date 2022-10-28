import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { AlertContext, AlertContextProvider } from "./AlertContext";

const CustomTest = () => {
  const { open, close } = useContext(AlertContext);

  return (
    <div>
      <button onClick={() => open({ message: "hi" })} aria-label="open1">
        open1
      </button>
      <button
        onClick={() =>
          open({
            message: "hi",
            buttons: [
              {
                label: "click",
                onClick: () => {},
                style: { backgroundColor: "yellow" },
              },
              {
                label: "click2",
                onClick: () => {},
              },
            ],
          })
        }
        aria-label="open2"
      >
        open2
      </button>
      <button onClick={() => close()} aria-label="close">
        close
      </button>
    </div>
  );
};

describe("AlertContext", () => {
  it("click open message", async () => {
    render(
      <AlertContextProvider>
        <CustomTest />
      </AlertContextProvider>,
    );
    const open1Button = screen.getByRole("button", { name: "open1" });
    fireEvent.click(open1Button);
    expect(() => screen.getByText("hi"));
    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);
  });

  it("render alert modal with buttons", async () => {
    render(
      <AlertContextProvider>
        <CustomTest />
      </AlertContextProvider>,
    );
    const open1Button = screen.getByRole("button", { name: "open2" });
    fireEvent.click(open1Button);
    expect(() => screen.getByText("hi"));
    const modalButton = screen.getByRole("button", { name: "click" });
    fireEvent.click(modalButton);
  });

  it("close by clicking icon", async () => {
    render(
      <AlertContextProvider>
        <CustomTest />
      </AlertContextProvider>,
    );
    const open1Button = screen.getByRole("button", { name: "open2" });
    fireEvent.click(open1Button);
    const closeIcon = await waitFor(() => screen.getByRole("close-icon"));
    console.log(closeIcon);
    fireEvent.click(closeIcon);
  });

  it("simple clicking confirm", async () => {
    render(
      <AlertContextProvider>
        <CustomTest />
      </AlertContextProvider>,
    );
    const open1Button = screen.getByRole("button", { name: "open1" });
    fireEvent.click(open1Button);
    const confirmButton = await waitFor(() =>
      screen.getByRole("button", { name: "확인" }),
    );
    fireEvent.click(confirmButton);
  });
});
