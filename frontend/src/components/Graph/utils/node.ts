import { Coord } from "types/canvas.types";
import { Canvas } from "./Canvas";
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

  CONTRACT_SPEED = 0.5;

  JOURNEY_SPEED = 0.015;

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

  isJourneyEnd = false;

  constructor(
    id: number,
    imgUrl: string,
    name: string,
    coord: Coord,
    destCoord: Coord,
    canvas: Canvas,
    isNotFiltered = false,
    radius = NODE_RADIUS,
  ) {
    this.id = id;
    this.imgElement = new Image();
    this.imgElement.src = imgUrl;
    this.name = name;
    this.coord = coord;
    this.originCoord = { ...coord };
    this.destCoord = destCoord;
    this.canvas = canvas;
    this.radius = radius;
    this.originalRadius = radius;
    this.isNotFiltered = isNotFiltered;
    this.gradient = gradientPoints(coord, destCoord);
    this.direction = directionPoints(coord, destCoord);
    this.journeySpeed = Math.abs(coord.x - destCoord.x)
      ? Math.abs(coord.x - destCoord.x) * this.JOURNEY_SPEED
      : Math.abs(coord.y - destCoord.y) * this.JOURNEY_SPEED;
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

  journey() {
    this.isJourneyEnd =
      directionPoints(this.coord, this.destCoord) === 5 ||
      this.direction !== directionPoints(this.coord, this.destCoord)
        ? true
        : false;
    if (this.isJourneyEnd) {
      this.coord.x = this.destCoord.x;
      this.coord.y = this.destCoord.y;
      this.canvas.render();
      window.cancelAnimationFrame(this.journeyAnimationId);
      return;
    }

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
      case 5:
        // NA
        break;
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
    this.journeyAnimationId = window.requestAnimationFrame(
      this.journey.bind(this),
    );
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
    imgUrl: string,
    name: string,
    coord: Coord,
    destCoord: Coord,
    canvas: Canvas,
    twoChonNodes: UserNode[],
    isNotFiltered = false,
    omitCount = 0,
  ) {
    super(id, imgUrl, name, coord, destCoord, canvas, isNotFiltered);
    this.twoChonNodes = twoChonNodes;
    this.omitCount = omitCount;
  }
}
