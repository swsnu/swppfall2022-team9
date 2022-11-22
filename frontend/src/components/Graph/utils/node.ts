import { Coord, PanZoom } from "types/canvas.types";
import { Canvas } from "./Canvas";
import { convertCartesianToScreen, distPoints, getScreenPoint } from "./math";

export const NODE_RADIUS = 40;

export class UserNode {
  id: number;

  radius: number;

  originalRadius: number;

  imgElement: HTMLImageElement;

  name: string;

  coord: Coord;

  canvas: Canvas;

  isNotFiltered: boolean; // true if does not contain search keyword

  expandAnimationId = 0;

  contractAnimationId = 0;

  private EXPAND_RATE = 4.5 / 4;

  private EXPAND_SPEED = 0.5;

  private CONTRACT_SPEED = 0.5;

  constructor(
    id: number,
    imgUrl: string,
    name: string,
    coord: Coord,
    canvas: Canvas,
    isNotFiltered = false,
    radius = NODE_RADIUS,
  ) {
    this.id = id;
    this.imgElement = new Image();
    this.imgElement.src = imgUrl;
    this.name = name;
    this.coord = coord;
    this.canvas = canvas;
    this.radius = radius;
    this.originalRadius = radius;
    this.isNotFiltered = isNotFiltered;
  }

  expand() {
    if (this.radius >= this.originalRadius * this.EXPAND_RATE) {
      window.cancelAnimationFrame(this.expandAnimationId);
      this.expandAnimationId = 0;
      return;
    }
    this.radius += this.EXPAND_SPEED;
    this.canvas.render();
    this.expandAnimationId = window.requestAnimationFrame(
      this.expand.bind(this),
    );
  }

  contract() {
    if (this.radius <= this.originalRadius) {
      window.cancelAnimationFrame(this.contractAnimationId);
      this.contractAnimationId = 0;
      return;
    }
    this.radius -= this.CONTRACT_SPEED;
    this.canvas.render();
    this.contractAnimationId = window.requestAnimationFrame(
      this.contract.bind(this),
    );
  }

  isTouched(touchPoint: Coord) {
    const scaledRadius = this.radius * this.canvas.getPanZoom().scale;
    const correctedPosition = getScreenPoint(
      this.coord,
      this.canvas.getPanZoom(),
    );
    const userNodeCenterScreenPosition = convertCartesianToScreen(
      this.canvas.getCanvasElement(),
      correctedPosition,
      this.canvas.getDpr(),
    );
    return distPoints(touchPoint, userNodeCenterScreenPosition) <= scaledRadius;
  }
}

export class OneChonNode extends UserNode {
  twoChonNodes?: UserNode[];

  constructor(
    id: number,
    imgUrl: string,
    name: string,
    coord: Coord,
    canvas: Canvas,
    twoChonNodes: UserNode[],
    isNotFiltered = false,
  ) {
    super(id, imgUrl, name, coord, canvas, isNotFiltered);
    this.twoChonNodes = twoChonNodes;
  }
}
