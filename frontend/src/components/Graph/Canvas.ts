import { clear } from "console";
import { Coord, Coords } from "types/canvas.types";
export class Canvas {
  private element: HTMLCanvasElement;

  private width = 0;

  private height = 0;

  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;
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

  drawNodes() {}

  render() {
    this.drawNodes();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
