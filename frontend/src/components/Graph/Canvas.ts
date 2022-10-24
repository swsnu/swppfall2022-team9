import { clear } from "console";
import { User } from "models/users.model";
import { Coord, Coords, PanZoom } from "types/canvas.types";
import { UserNode } from "components/Graph/utils/node";
import {
  addPoints,
  convertCartesianToScreen,
  diffPoints,
  getScreenPoint,
  getWorldPoint,
} from "./utils/math";
import { addEvent, removeEvent, touchy, TouchyEvent } from "./utils/touch";
export class Canvas {
  private MAX_SCALE = 2;

  private MIN_SCALE = 0.6;

  private ZOOM_SENSITIVITY = 300;

  private element: HTMLCanvasElement;

  private panZoom: PanZoom = {
    scale: 1,
    offset: [0, 0],
  };

  private panPoint: { lastMousePos: Coord } = {
    lastMousePos: [0, 0],
  };

  private width = 0;

  private height = 0;

  private ctx: CanvasRenderingContext2D;

  private currentUserNode?: UserNode;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.initialize();
  }

  initialize() {
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    // add event listeners
    touchy(this.element, addEvent, "mousedown", this.onMouseDown);
    touchy(this.element, addEvent, "mouseup", this.onMouseUp);
    touchy(this.element, addEvent, "mouseout", this.onMouseOut);
    this.element.addEventListener("wheel", this.handleWheel);
  }

  onMouseDown(evt: TouchyEvent) {
    this.panPoint.lastMousePos = [evt.offsetX, evt.offsetY];
    touchy(this.element, addEvent, "mousemove", this.handlePanning);
  }

  onMouseMove(evt: TouchyEvent) {}

  onMouseUp() {
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
  }

  onMouseOut() {
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
  }

  setPanZoom(param: Partial<PanZoom>) {
    const { scale, offset } = param;
    if (scale) {
      this.panZoom.scale = scale;
    }
    if (offset) {
      this.panZoom.offset = offset;
    }

    this.render();
    //reset the offset
    // this.panZoom.offset = [0, 0];
  }

  handlePanning = (evt: TouchyEvent) => {
    const lastMousePos = this.panPoint.lastMousePos;
    const point = evt;
    const currentMousePos: Coord = [point.offsetX, point.offsetY];
    this.panPoint.lastMousePos = currentMousePos;
    const mouseDiff = diffPoints(lastMousePos, currentMousePos);
    const offset = diffPoints(this.panZoom.offset, mouseDiff);
    this.panZoom.offset = offset;
    this.setPanZoom({ offset });
    return;
  };

  returnScrollOffsetFromMouseOffset = (
    mouseOffset: Coord,
    panZoom: PanZoom,
    newScale: number,
  ) => {
    const worldPos = getWorldPoint(
      diffPoints(mouseOffset, [
        this.element.width / 2,
        this.element.height / 2,
      ]),
      panZoom,
    );
    const newMousePos = getScreenPoint(worldPos, {
      scale: newScale,
      offset: addPoints(panZoom.offset, [
        this.element.width / 2,
        this.element.height / 2,
      ]),
    });
    const scaleOffset = diffPoints(mouseOffset, newMousePos);
    const offset = addPoints(panZoom.offset, scaleOffset);
    return offset;
  };

  handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const { deltaY } = e;
      const zoom = 1 - deltaY / this.ZOOM_SENSITIVITY;
      const newScale = this.panZoom.scale * zoom;

      if (newScale > this.MAX_SCALE || newScale < this.MIN_SCALE) {
        return;
      }
      const mouseOffset = { x: e.offsetX, y: e.offsetY };
      const newOffset = this.returnScrollOffsetFromMouseOffset(
        [mouseOffset.x, mouseOffset.y],
        this.panZoom,
        newScale,
      );

      this.setPanZoom({ scale: newScale, offset: newOffset });
    } else {
      const offset = diffPoints(this.panZoom.offset, [e.deltaX, e.deltaY]);
      this.setPanZoom({ offset });
    }
  };

  // getPointFromTouch(touch: Touch) {
  //   const r = this.element.getBoundingClientRect();
  //   const originY = touch.clientY;
  //   const originX = touch.clientX;
  //   const offsetX = touch.clientX - r.left;
  //   const offsetY = touch.clientY - r.top;
  //   return {
  //     x: originX - this.panZoom.offset[0],
  //     y: originY - this.panZoom.offset[1],
  //     offsetX: offsetX,
  //     offsetY: offsetY,
  //   };
  // }

  getPointFromTouchyEvent(evt: TouchyEvent) {
    let originY;
    let originX;
    let offsetX;
    let offsetY;
    if (window.TouchEvent && evt instanceof TouchEvent) {
      //this is for tablet or mobile
      // let firstCanvasTouchIndex = 0;
      // for (let i = 0; i < evt.touches.length; i++) {
      //   const target = evt.touches.item(i)!.target;
      //   if (target instanceof HTMLCanvasElement) {
      //     firstCanvasTouchIndex = i;
      //     break;
      //   }
      // }
      // if (isCanvasTouchIncluded) {
      //   return this.getPointFromTouch(evt.touches[firstCanvasTouchIndex]);
      // } else {
      //   return this.getPointFromTouch(evt.touches[0]);
      // }
    } else {
      // this is for PC
      originY = evt.clientY;
      originX = evt.clientX;
      offsetX = evt.offsetX;
      offsetY = evt.offsetY;
      // originY += window.scrollY;
      // originX += window.scrollX;
      // return {
      //   y: originY - this.panZoom.offset.y,
      //   x: originX - this.panZoom.offset.x,
      //   offsetX: offsetX,
      //   offsetY: offsetY,
    }
  }

  setCurrentUserNode(currentUser: User) {
    // TODO: For now we set the imgUrl to empty string
    this.currentUserNode = new UserNode("", currentUser.name, [0, 0]);
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

  // this is the drawing method of a user node(currentUser, 1-chon, 2-chon)
  // you are free to change this part
  // TODO: draw img url in the circle (clipped)
  drawUserNode(userNode: UserNode) {
    this.ctx.save();
    const correctedPosition = getScreenPoint(userNode.coord, this.panZoom);
    const screenPosition = convertCartesianToScreen(
      this.element,
      correctedPosition,
    );
    this.ctx.beginPath();
    this.ctx.arc(
      screenPosition[0],
      screenPosition[1],
      userNode.radius * this.panZoom.scale,
      0,
      2 * Math.PI,
      false,
    );
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.lineWidth = 5 * this.panZoom.scale;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }

  drawNodes() {
    if (this.currentUserNode) {
      this.drawUserNode(this.currentUserNode);
    }
  }

  render() {
    this.clear();

    this.drawNodes();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.clear();
    touchy(this.element, removeEvent, "mouseup", this.onMouseUp);
    touchy(this.element, removeEvent, "mouseout", this.onMouseOut);
    touchy(this.element, removeEvent, "mousedown", this.onMouseDown);
    this.element.removeEventListener("wheel", this.handleWheel);
  }
}
