import { fireEvent, renderHook, waitFor } from "@testing-library/react";
import { useRef } from "react";
import useHandleClickOutside from "./useHandleClickOutside";

// https://stackoverflow.com/questions/58610112/testing-mousedown-event-outside-react-component-jest-enzyme

describe("handle click outside hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call callback when clicked outside", async () => {
    const mockCallback = jest
      .fn()
      .mockImplementation((value: boolean) => value);
    const element = document.createElement("div");
    const otherElement = document.createElement("a");
    const { result, unmount, rerender } = renderHook(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fakeRef = useRef<any>(element);
      return useHandleClickOutside({
        wrapperRef: fakeRef,
        setIsClickedOutside: mockCallback,
      });
    });
    await waitFor(() => expect(result.current).toBe(element));
    fireEvent.mouseDown(document, { target: otherElement });
    await waitFor(() => expect(mockCallback).toHaveBeenCalled());
    rerender();
    unmount();
  });

  it("should call no callback when ref current is null", async () => {
    const mockCallback = jest
      .fn()
      .mockImplementation((value: boolean) => value);
    const otherElement = document.createElement("a");
    const { result } = renderHook(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fakeRef = useRef<any>(null);
      return useHandleClickOutside({
        wrapperRef: fakeRef,
        setIsClickedOutside: mockCallback,
      });
    });
    await waitFor(() => expect(result.current).toBe(null));
    fireEvent.mouseDown(document, { target: otherElement });
  });
});
