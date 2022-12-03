import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import { Coord } from "types/canvas.types";
import Canvas from "./Canvas";
import {
  convertCartesianToScreen,
  directionPoints,
  distPoints,
  getScreenPoint,
  gradientPoints,
} from "./math";

export const NODE_RADIUS = 28;

export class UserNode {
  EXPAND_RATE = 1.2;

  EXPAND_SPEED = 0.8;

  CONTRACT_SPEED = 0.8;

  JOURNEY_SPEED = 0.06;

  id: number;

  radius: number;

  originalRadius: number;

  imgElement: HTMLImageElement;

  name: string;

  coord: Coord;

  originCoord: Coord;

  destCoord: Coord;

  canvas: Canvas;

  isNotFiltered: boolean; // true if does not contain search keyword

  gradient: number;

  direction: number;

  expandAnimationId = 0;

  contractAnimationId = 0;

  journeyAnimationId = 0;

  journeySpeed: number;

  constructor(
    id: number,
    name: string,
    coord: Coord,
    destCoord: Coord,
    canvas: Canvas,
    imgUrl = DEFAULT_IMAGE_URL,
    isNotFiltered = false,
    radius = NODE_RADIUS,
  ) {
    this.id = id;
    this.imgElement = new Image();
    this.imgElement.src = imgUrl === "" ? DEFAULT_IMAGE_URL : imgUrl;
    this.imgElement.onload = () => {
      canvas.render();
    };
    this.name = name;
    this.coord = { ...coord };
    this.originCoord = { ...coord };
    this.destCoord = { ...destCoord };
    this.canvas = canvas;
    this.radius = radius;
    this.originalRadius = radius;
    this.isNotFiltered = isNotFiltered;
    this.gradient = gradientPoints(this.originCoord, destCoord);
    this.direction = directionPoints(this.originCoord, destCoord);
    this.journeySpeed = Math.abs(coord.x - destCoord.x)
      ? (Math.abs(coord.x - destCoord.x) * this.JOURNEY_SPEED) / canvas.getDpr()
      : (Math.abs(coord.y - destCoord.y) * this.JOURNEY_SPEED) /
        canvas.getDpr();
  }

  expand() {
    if (this.radius >= this.originalRadius * this.EXPAND_RATE) {
      this.radius = this.originalRadius * this.EXPAND_RATE;
      window.cancelAnimationFrame(this.expandAnimationId);
      this.expandAnimationId = 0;
      this.canvas.render();
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
      this.radius = this.originalRadius;
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

  async journey(): Promise<void> {
    while (
      !(
        directionPoints(this.coord, this.destCoord) === 5 ||
        this.direction !== directionPoints(this.coord, this.destCoord)
      )
    ) {
      switch (this.direction) {
        case 1:
          this.coord.x -= this.journeySpeed;
          this.coord.y -= this.gradient * this.journeySpeed;
          break;
        case 2:
          this.coord.y += this.journeySpeed;
          break;
        case 3:
          this.coord.x += this.journeySpeed;
          this.coord.y += this.gradient * this.journeySpeed;
          break;
        case 4:
          this.coord.x -= this.journeySpeed;
          break;
        // case 5:
        //   break;
        case 6:
          this.coord.x += this.journeySpeed;
          break;
        case 7:
          this.coord.x -= this.journeySpeed;
          this.coord.y -= this.gradient * this.journeySpeed;
          break;
        case 8:
          this.coord.y -= this.journeySpeed;
          break;
        case 9:
          this.coord.x += this.journeySpeed;
          this.coord.y += this.gradient * this.journeySpeed;
          break;
      }
      this.canvas.render();
      await new Promise(requestAnimationFrame);
    }
  }

  isTouched(touchPoint: Coord) {
    const scaledRadius = this.radius * this.canvas.getPanZoom().scale;
    const correctedPosition = getScreenPoint(
      this.destCoord,
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
  twoChonNodes: UserNode[] = [];

  omitCount;

  constructor(
    id: number,
    name: string,
    coord: Coord,
    destCoord: Coord,
    canvas: Canvas,
    twoChonNodes: UserNode[],
    imgUrl = DEFAULT_IMAGE_URL,
    isNotFiltered = false,
    omitCount = 0,
    radius = NODE_RADIUS,
  ) {
    super(id, name, coord, destCoord, canvas, imgUrl, isNotFiltered, radius);
    this.twoChonNodes = twoChonNodes;
    this.omitCount = omitCount;
  }
}
