import { User } from "server/models/users.model";
import { Coord, PanZoom } from "types/canvas.types";
import { OneChonNode, UserNode } from "components/Graph/utils/node";
import {
  addPoints,
  convertCartesianToScreen,
  diffPoints,
  getEdgeCoords,
  getOneAndTwoChonCoordinates,
  getScreenPoint,
  getWorldPoint,
} from "./math";
import { addEvent, removeEvent, touchy, TouchyEvent } from "./touch";
import { OneChonInfo } from "types/chon.types";
export class Canvas {
  private MAX_SCALE = 2;

  private MIN_SCALE = 0.6;

  private ZOOM_SENSITIVITY = 300;

  private element: HTMLCanvasElement;

  private pinchZoomPrevDiff = 0;

  private panZoom: PanZoom = {
    scale: 1,
    offset: { x: 0, y: 0 },
  };

  private panPoint: { lastMousePos: Coord } = {
    lastMousePos: { x: 0, y: 0 },
  };

  private width = 0;

  private height = 0;

  private dpr = 1;

  private ctx: CanvasRenderingContext2D;

  private currentUserNode?: UserNode;

  private chonNodes?: OneChonNode[];

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.initialize();
  }

  getContext() {
    return this.ctx;
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
    evt.preventDefault();
    const point = this.getPointFromTouchyEvent(evt);
    this.panPoint.lastMousePos = { x: point.offsetX, y: point.offsetY };
    if (window.TouchEvent && evt instanceof TouchEvent) {
      const touchCount = evt.touches.length;
      if (touchCount >= 2) {
        const firstTouch = evt.touches[0];
        const secondTouch = evt.touches[1];
        const pinchZoomCurrentDiff =
          Math.abs(firstTouch.clientX - secondTouch.clientX) +
          Math.abs(firstTouch.clientY - secondTouch.clientY);
        this.pinchZoomPrevDiff = pinchZoomCurrentDiff;
      }
    }
    touchy(this.element, addEvent, "mousemove", this.handlePanning);
    touchy(this.element, addEvent, "mousemove", this.handlePinchZoom);
  }

  onMouseMove() {}

  onMouseUp() {
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
  }

  onMouseOut() {
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
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
    if (window.TouchEvent && evt instanceof TouchEvent) {
      if (evt.touches.length > 1) {
        return;
      }
    }
    const point = this.getPointFromTouchyEvent(evt);

    const currentMousePos: Coord = { x: point.offsetX, y: point.offsetY };
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
    const diffPointsOfMouseOffset = diffPoints(mouseOffset, {
      x: this.element.width / this.dpr / 2,
      y: this.element.height / this.dpr / 2,
    });
    const worldPos = getWorldPoint(
      {
        x: diffPointsOfMouseOffset.x,
        y: diffPointsOfMouseOffset.y,
      },
      this.panZoom,
    );
    const newMousePos = getScreenPoint(worldPos, {
      scale: newScale,
      offset: addPoints(panZoom.offset, {
        x: this.element.width / this.dpr / 2,
        y: this.element.height / this.dpr / 2,
      }),
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
        { x: mouseOffset.x, y: mouseOffset.y },
        this.panZoom,
        newScale,
      );

      this.setPanZoom({ scale: newScale, offset: newOffset });
    } else {
      const offset = diffPoints(this.panZoom.offset, {
        x: e.deltaX,
        y: e.deltaY,
      });
      this.setPanZoom({ offset });
    }
  };

  handlePinchZoom = (evt: TouchyEvent) => {
    if (window.TouchEvent && evt instanceof TouchEvent) {
      const touchCount = evt.touches.length;
      if (!(touchCount >= 2)) {
        return;
      }
      const firstTouch = evt.touches[0];
      const secondTouch = evt.touches[1];
      const pinchZoomCurrentDiff =
        Math.abs(firstTouch.clientX - secondTouch.clientX) +
        Math.abs(firstTouch.clientY - secondTouch.clientY);
      const firstTouchPoint = this.getPointFromTouch(firstTouch);
      const secondTouchPoint = this.getPointFromTouch(secondTouch);
      const touchCenterPos = {
        x: (firstTouchPoint.offsetX + secondTouchPoint.offsetX) / 2,
        y: (firstTouchPoint.offsetY + secondTouchPoint.offsetY) / 2,
      } as Coord;

      const deltaX = this.pinchZoomPrevDiff - pinchZoomCurrentDiff;
      const zoom = 1 - (deltaX * 2) / this.ZOOM_SENSITIVITY;
      const newScale = this.panZoom.scale * zoom;
      if (this.MIN_SCALE > newScale || newScale > this.MAX_SCALE) {
        return;
      }
      const newOffset = this.returnScrollOffsetFromMouseOffset(
        touchCenterPos,
        this.panZoom,
        newScale,
      );
      this.setPanZoom({ scale: newScale, offset: newOffset });
      this.pinchZoomPrevDiff = pinchZoomCurrentDiff;
    }
  };

  getPointFromTouch(touch: Touch) {
    const r = this.element.getBoundingClientRect();
    const offsetX = touch.clientX - r.left;
    const offsetY = touch.clientY - r.top;
    return {
      offsetX: offsetX,
      offsetY: offsetY,
    };
  }

  getPointFromTouchyEvent(evt: TouchyEvent) {
    if (window.TouchEvent && evt instanceof TouchEvent) {
      return this.getPointFromTouch(evt.touches[0]);
      // }
    } else {
      // this is for PC
      // offsetX = evt.offsetX;
      // offsetY = evt.offsetY;
      // originY += window.scrollY;
      // originX += window.scrollX;
      return {
        //   y: originY - this.panZoom.offset.y,
        //   x: originX - this.panZoom.offset.x,
        offsetX: evt.offsetX,
        offsetY: evt.offsetY,
      };
    }
  }

  setCurrentUserNode(currentUser: User) {
    this.currentUserNode = new UserNode(
      "https://w.namu.la/s/bf1f348b11726fc2cd015373f40ae5504ee4f190ebaf444fa43618adc1825e8c59dd256d9f77c14a8eace45649660a8b07bcf7a926bb8acdfce39909bad36c87eeda63354b81e8b22a5ba21aaf66c499ea3069fedffaf4335d4b2ce62a4672325d33aa82e1ead5d1737b75cebfb13139",
      currentUser.lastname + currentUser.firstname,
      { x: 0, y: 0 },
    );
    this.currentUserNode.imgElement.onload = () => {
      this.render();
    };
  }

  setOneChonNodes(chonList: OneChonInfo[]) {
    const oneChonCount = chonList.length;
    const twoChonCount = chonList.map(oneChon => oneChon.chons.length);
    const radius = 30;
    const coords = getOneAndTwoChonCoordinates(
      oneChonCount,
      twoChonCount,
      radius,
    );

    this.chonNodes = chonList.map((oneChon, oneChonIdx) => {
      const twoChonNodes = oneChon.chons.map((twoChon, twoChonIdx) => {
        const twoChonNode = new UserNode(
          twoChon.imgUrl,
          twoChon.lastname + twoChon.firstname,
          coords[oneChonIdx].twoChonCoords[twoChonIdx].userCoord,
        );
        twoChonNode.imgElement.onload = () => {
          this.render();
        };
        return twoChonNode;
      });

      const oneChonNode = new OneChonNode(
        oneChon.imgUrl,
        oneChon.lastname + oneChon.firstname,
        coords[oneChonIdx].userCoord,
        twoChonNodes,
      );
      oneChonNode.imgElement.onload = () => {
        this.render();
      };
      return oneChonNode;
    });
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
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
    this.dpr = devicePixelRatio ? devicePixelRatio : this.dpr;
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y);
  }

  drawGraph() {
    if (this.currentUserNode) {
      this.drawUserNode(this.currentUserNode);
      this.chonNodes?.forEach(oneChonNode => {
        const [edgeFromCurrentUser, edgeToOneChon] = getEdgeCoords(
          this.currentUserNode!.coord,
          oneChonNode.coord,
          oneChonNode.radius,
        );
        this.drawUserNode(oneChonNode);
        this.drawEdge(edgeFromCurrentUser, edgeToOneChon, 1); // Edge from current user to 1-chon
        oneChonNode.twoChonNodes?.forEach(twoChonNode => {
          const [edgeFromOneChon, edgeToTwoChon] = getEdgeCoords(
            oneChonNode.coord,
            twoChonNode.coord,
            oneChonNode.radius,
          );
          this.drawUserNode(twoChonNode);
          this.drawEdge(edgeFromOneChon, edgeToTwoChon, 2); // Edge from 1-chon to 2-chon
        });
      });
    }
  }

  drawUserNode(userNode: UserNode) {
    const ctx = this.ctx;
    const scaledRadius = userNode.radius * this.panZoom.scale;
    const correctedPosition = getScreenPoint(userNode.coord, this.panZoom);
    const screenPosition = convertCartesianToScreen(
      this.element,
      correctedPosition,
      this.dpr,
    );
    const centerX = screenPosition.x;
    const centerY = screenPosition.y;

    // User node clipped in circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.closePath();
    ctx.drawImage(
      userNode.imgElement,
      centerX - scaledRadius,
      centerY - scaledRadius,
      scaledRadius * 2,
      scaledRadius * 2,
    );

    // Round border
    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, scaledRadius * 0.95, 0, Math.PI * 2);
    ctx.fill("evenodd");
    ctx.closePath();
    ctx.restore();
  }

  drawEdge(edgeA: Coord, edgeB: Coord, chon: number) {
    const ctx = this.ctx;
    const correctedEdgeA = getScreenPoint(edgeA, this.panZoom);
    const screenEdgeA = convertCartesianToScreen(
      this.element,
      correctedEdgeA,
      this.dpr,
    );
    const correctedEdgeB = getScreenPoint(edgeB, this.panZoom);
    const screenEdgeB = convertCartesianToScreen(
      this.element,
      correctedEdgeB,
      this.dpr,
    );

    ctx.save();
    ctx.lineWidth = 2;
    if (chon == 2) {
      // Dashline from 1-chons to 2-chons
      ctx.setLineDash([4, 2]);
    }
    ctx.beginPath();
    ctx.moveTo(screenEdgeA.x, screenEdgeA.y);
    ctx.lineTo(screenEdgeB.x, screenEdgeB.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  render() {
    this.clear();
    this.drawGraph();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    touchy(this.element, removeEvent, "mouseup", this.onMouseUp);
    touchy(this.element, removeEvent, "mouseout", this.onMouseOut);
    touchy(this.element, removeEvent, "mousedown", this.onMouseDown);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
    this.element.removeEventListener("wheel", this.handleWheel);
  }
}
