import { clear } from "console";
import { User } from "models/users.model";
import { Coord, Coords } from "types/canvas.types";
import { UserNode } from "components/Graph/utils/node";
import { convertCartesianToScreen } from "./utils/math";
export class Canvas {
  private element: HTMLCanvasElement;

  private width = 0;

  private height = 0;

  private ctx: CanvasRenderingContext2D;

  private currentUserNode?: UserNode;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  setCurrentUserNode(currentUser: User) {
    // TODO: For now we set the imgUrl to empty string
    this.currentUserNode = new UserNode("", currentUser.name);
  }

  setWidth(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.element.width = devicePixelRatio ? width * devicePixelRatio : width;
    this.element.style.width = `${width}px`;
  }

  setHeight(height: number, devicePixelRatio?: number) {
    this.height = height;
    this.element.height = devicePixelRatio ? height * devicePixelRatio : height;
    this.element.style.height = `${height}px`;
  }

  setSize(width: number, height: number, devicePixelRatio?: number) {
    this.setWidth(width, devicePixelRatio);
    this.setHeight(height, devicePixelRatio);
  }

  drawUserNode(coord: Coord, userNode: UserNode) {
    this.ctx.save();
    const screenPosition = convertCartesianToScreen(this.element, coord);
    this.ctx.beginPath();
    this.ctx.arc(
      screenPosition[0],
      screenPosition[1],
      userNode.radius,
      0,
      2 * Math.PI,
      false,
    );
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }

  drawNodes() {
    if (this.currentUserNode) {
      this.drawUserNode([0, 0], this.currentUserNode);
    }
  }

  render() {
    this.drawNodes();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
