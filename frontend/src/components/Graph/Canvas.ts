export class Canvas {
  private element: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;
  }
}
