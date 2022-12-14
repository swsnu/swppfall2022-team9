import { fireEvent, waitFor } from "@testing-library/react";
import { usersStub } from "server/stubs/users.stub";
import { useRef } from "react";
import useCanvas from "./useCanvas";
import { renderHook } from "@testing-library/react-hooks";

// reference: https://kooku0.github.io/blog/%EC%99%B8%EB%B6%80-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%BD%94%EB%93%9C-%EC%A7%9C%EA%B8%B0/

describe("useCanvas hook", () => {
  let onSetViewProfileCallback: (id: number | null) => void;
  let onSetIsPanZoomedCallBack: () => void;
  beforeEach(() => {
    // const mockCanvasElement = document.createElement("canvas");
    // const fakeCanvas = new Canvas(mockCanvasElement);
    jest.clearAllMocks();
    // (useCanvas as jest.Mock).mockReturnValue({} as Canvas);
    onSetViewProfileCallback = jest.fn();
    onSetIsPanZoomedCallBack = jest.fn();
  });

  afterEach(() => {});

  it("tests drawing nodes", async () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const parentRef = divElement;
    const childRef = canvasElement;
    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(parentRef);
      const canvasRef = useRef<HTMLCanvasElement>(childRef);
      return useCanvas({
        divRef: containerRef,
        canvasRef: canvasRef,
        onSetViewProfileCallback,
        onSetIsPanZoomedCallBack,
      });
    });
    result.current?.setSize(500, 500);
    waitFor(() => expect(result.current?.getWidth()).toBe(500));

    result.current?.setCurrentUser(usersStub[0]);
    result.current?.render();
    const ctx = result.current?.getContext();
    const events = ctx?.__getEvents();
    expect(events).toMatchSnapshot();
  });

  it("render graph canvas", async () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const parentRef = divElement;
    const childRef = canvasElement;
    const { result, unmount } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(parentRef);
      const canvasRef = useRef<HTMLCanvasElement>(childRef);
      return useCanvas({
        divRef: containerRef,
        canvasRef: canvasRef,
        onSetViewProfileCallback,
        onSetIsPanZoomedCallBack,
      });
    });
    result.current?.setWidth(500);
    result.current?.setHeight(500);
    result.current?.setWidth(500, 1);
    result.current?.setHeight(500, 1);
    waitFor(() => expect(result.current?.getWidth()).toBe(500));
    waitFor(() => expect(result.current?.getHeight()).toBe(500));
    unmount();
  });

  it("renders without canvas", async () => {
    const divElement = document.createElement("div");
    const parentRef = divElement;
    const { result, unmount } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(parentRef);
      const canvasRef = useRef<HTMLCanvasElement>(null);
      return useCanvas({
        divRef: containerRef,
        canvasRef: canvasRef,
        onSetViewProfileCallback,
        onSetIsPanZoomedCallBack,
      });
    });
    waitFor(() => expect(result.current).toBe(null));
    unmount();
  });

  it("tests panning zooming", async () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const parentRef = divElement;
    const childRef = canvasElement;
    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(parentRef);
      const canvasRef = useRef<HTMLCanvasElement>(childRef);
      return useCanvas({
        divRef: containerRef,
        canvasRef: canvasRef,
        onSetViewProfileCallback,
        onSetIsPanZoomedCallBack,
      });
    });
    result.current?.setSize(500, 500);

    fireEvent.mouseDown(canvasElement);
    fireEvent.mouseMove(canvasElement);
    fireEvent.mouseOut(canvasElement);
    fireEvent.mouseUp(canvasElement);
    fireEvent.touchStart(canvasElement, {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 50, clientY: 50 },
      ],
    });
    fireEvent.touchMove(canvasElement, {
      touches: [
        { clientX: -10, clientY: -10 },
        { clientX: 60, clientY: 60 },
      ],
    });
    result.current?.setPanZoom({ scale: 2 });
    fireEvent.touchMove(canvasElement, {
      touches: [
        { clientX: -20, clientY: -20 },
        { clientX: 70, clientY: 70 },
      ],
    });
    fireEvent.touchEnd(canvasElement);
    fireEvent.touchStart(canvasElement, {
      touches: [{ clientX: -10, clientY: -10 }],
    });
    fireEvent.touchMove(canvasElement, {
      touches: [{ clientX: -20, clientY: -20 }],
    });
    fireEvent.touchEnd(canvasElement);
    result.current?.setPanZoom({ scale: 1 });
    fireEvent.pointerDown(canvasElement);
    fireEvent.pointerUp(canvasElement);
    fireEvent.pointerEnter(canvasElement);
    fireEvent.wheel(canvasElement, { deltaY: 10, ctrlKey: true });
    //max scale
    result.current?.setPanZoom({ scale: 2 });
    fireEvent.wheel(canvasElement, { deltaY: -10, ctrlKey: true });
    fireEvent.wheel(canvasElement, { deltaY: -10 });

    result.current?.destroy();
  });
});
