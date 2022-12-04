import Canvas from "./Canvas";
import { OneChonNode, UserNode } from "./node";

describe("Node", () => {
  it("should start its journey toward correct direction", () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const canvas = new Canvas(canvasElement);
    let userNode = new UserNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      canvas,
      "imgUrl",
    );
    userNode.journey();
    userNode = new UserNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      canvas,
      "",
    );
    userNode.journey();
    userNode = new UserNode(1, "name", { x: 0, y: 0 }, { x: 0, y: -1 }, canvas);
    userNode.journey();
  });
  it("should expand and contract properly", () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const canvas = new Canvas(canvasElement);
    const userNode = new OneChonNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      canvas,
      [],
    );
    userNode.expand();
    userNode.radius = 100;
    userNode.expand();
    userNode.contract();
    userNode.radius = 1;
    userNode.contract();
  });

  it("test image onload", () => {
    let onloadRef: () => void | undefined;
    Object.defineProperty(Image.prototype, "onload", {
      get() {
        return this._onload;
      },
      set(onload: () => void) {
        onloadRef = onload;
        this._onload = onload;
      },
    });
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const canvas = new Canvas(canvasElement);
    new UserNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      canvas,
    );
    onloadRef!();
  });
});
