import { User } from "server/models/users.model";
import { Coord, NodeTouchInfo, PanZoom } from "types/canvas.types";
import {
  NODE_RADIUS,
  OneChonNode,
  UserNode,
} from "components/Graph/utils/node";
import {
  addPoints,
  convertCartesianToScreen,
  diffPoints,
  distPoints,
  getEdgeCoords,
  getOneAndTwoChonCoordinates,
  getScreenPoint,
  getWorldPoint,
} from "./math";
import { addEvent, removeEvent, touchy, TouchyEvent } from "./touch";
import { OneChonInfo } from "types/friend.types";
export class Canvas {
  private MAX_SCALE = 2;

  private MIN_SCALE = 0.6;

  private ZOOM_SENSITIVITY = 300;

  private CENTER_NODE_RADIUS = (NODE_RADIUS * 5) / 4;

  private EXPAND_SPEED = 0.5;

  private EXPAND_RATE = 4.5 / 4;

  private CONTRACT_SPEED = 0.5;

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

  private currentUser?: User;

  private friendList: OneChonInfo[] = [];

  private centerNode?: UserNode;

  private oneChonNodes?: OneChonNode[];

  private nodes?: UserNode[]; // For convenient node iteration

  private touchingNode?: NodeTouchInfo;

  private touchedNode?: NodeTouchInfo;

  private requestAnimationId = 0;

  private EDGE_WIDTH = 3;

  private EDGE_LENGTH = 28;

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
    touchy(this.element, addEvent, "mousemove", this.onMouseMove);
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

  onMouseMove(evt: TouchyEvent) {
    evt.preventDefault();
    const point = this.getPointFromTouchyEvent(evt);
    const pointCoord = { x: point.offsetX, y: point.offsetY };

    const touchingNode = this.nodes?.find(node =>
      this.isNodeTouched(node, pointCoord),
    );

    if (touchingNode) {
      if (!this.touchedNode) {
        this.touchingNode = {
          userNode: touchingNode,
          minRadius: touchingNode.radius,
          maxRadius: touchingNode.radius * this.EXPAND_RATE,
        };
        this.touchedNode = {
          userNode: touchingNode,
          minRadius: touchingNode.radius,
          maxRadius: touchingNode.radius * this.EXPAND_RATE,
        };
        window.cancelAnimationFrame(this.requestAnimationId);
        this.nodeExpandAnimation();
      }
    } else {
      if (this.touchingNode && this.touchedNode) {
        this.touchingNode = undefined;
        window.cancelAnimationFrame(this.requestAnimationId);
        this.nodeContractAnimation();
      }
    }
  }

  onMouseUp() {
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
  }

  onMouseOut() {
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

  setCurrentUser(currentUser: User) {
    this.currentUser = currentUser;
    this.setCenterNode(currentUser.id);
  }

  setFriendList(friendList: OneChonInfo[]) {
    this.friendList = friendList;
    this.setOneChonNodes(this.centerNode!.id);
  }

  setCenterNode(userId: number) {
    const targetOneChon = this.friendList.find(oneChon => oneChon.id == userId);
    const centerNode = new UserNode(
      userId,
      targetOneChon
        ? targetOneChon.imgUrl
        : "https://play-lh.googleusercontent.com/38AGKCqmbjZ9OuWx4YjssAz3Y0DTWbiM5HB0ove1pNBq_o9mtWfGszjZNxZdwt_vgHo=w240-h480-rw",
      targetOneChon
        ? targetOneChon.lastname + targetOneChon.firstname
        : this.currentUser!.lastname + this.currentUser!.firstname,
      { x: 0, y: 0 },
      false,
      this.CENTER_NODE_RADIUS,
    );
    this.centerNode = centerNode;
    this.centerNode.imgElement.onload = () => {
      this.render();
    };
    this.nodes = [centerNode];
  }

  setOneChonNodes(userId: number) {
    const targetOneChon = this.friendList.find(oneChon => oneChon.id == userId);
    if (targetOneChon) {
      if (targetOneChon.chons.length == 0) {
        this.oneChonNodes = undefined;
        return;
      }
      const oneChonCount = targetOneChon.chons.length;
      const coords = getOneAndTwoChonCoordinates(
        oneChonCount,
        Array(oneChonCount).fill(0),
        this.EDGE_LENGTH,
      );

      this.oneChonNodes = targetOneChon.chons.map((oneChon, oneChonIdx) => {
        const oneChonNode = new OneChonNode(
          oneChon.id,
          oneChon.imgUrl,
          oneChon.lastname + oneChon.firstname,
          coords[oneChonIdx].userCoord,
          [],
          oneChon.isNotFiltered,
        );
        oneChonNode.imgElement.onload = () => {
          this.render();
        };
        this.nodes?.push(oneChonNode);
        return oneChonNode;
      });
    } else {
      const friendList = this.friendList;
      if (friendList.length == 0) {
        this.oneChonNodes = undefined;
        return;
      }
      const oneChonCount = friendList.length;
      const twoChonCount = friendList.map(oneChon => oneChon.chons.length);
      const coords = getOneAndTwoChonCoordinates(
        oneChonCount,
        twoChonCount,
        this.EDGE_LENGTH,
      );

      this.oneChonNodes = friendList.map((oneChon, oneChonIdx) => {
        const twoChonNodes = oneChon.chons.map((twoChon, twoChonIdx) => {
          const twoChonNode = new UserNode(
            twoChon.id,
            twoChon.imgUrl,
            twoChon.lastname + twoChon.firstname,
            coords[oneChonIdx].twoChonCoords[twoChonIdx].userCoord,
            twoChon.isNotFiltered,
          );
          twoChonNode.imgElement.onload = () => {
            this.render();
          };
          this.nodes?.push(twoChonNode);
          return twoChonNode;
        });

        const oneChonNode = new OneChonNode(
          oneChon.id,
          oneChon.imgUrl,
          oneChon.lastname + oneChon.firstname,
          coords[oneChonIdx].userCoord,
          twoChonNodes,
          oneChon.isNotFiltered,
        );
        oneChonNode.imgElement.onload = () => {
          this.render();
        };
        this.nodes?.push(oneChonNode);
        return oneChonNode;
      });
    }
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
    if (this.centerNode) {
      this.drawUserNode(this.centerNode);
      this.oneChonNodes?.forEach(oneChonNode => {
        const [edgeFromCenterNode, edgeToOneChon] = getEdgeCoords(
          this.centerNode!.coord,
          oneChonNode.coord,
          this.centerNode!.radius,
          oneChonNode.radius,
        );
        this.drawEdge(edgeFromCenterNode, edgeToOneChon, 1); // Edge from current user to 1-chon
        oneChonNode.twoChonNodes?.forEach(twoChonNode => {
          const [edgeFromOneChonNode, edgeToTwoChon] = getEdgeCoords(
            oneChonNode.coord,
            twoChonNode.coord,
            // oneChonNode.radius,
            // twoChonNode.radius,
            NODE_RADIUS,
            NODE_RADIUS,
          );
          this.drawEdge(edgeFromOneChonNode, edgeToTwoChon, 2); // Edge from 1-chon to 2-chon
          this.drawUserNode(twoChonNode);
        });
        this.drawUserNode(oneChonNode);
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

    if (userNode.isNotFiltered) {
      ctx.filter = "opacity(30%)";
    }
    ctx.drawImage(
      userNode.imgElement,
      centerX - scaledRadius,
      centerY - scaledRadius,
      scaledRadius * 2,
      scaledRadius * 2,
    );

    // Round border
    ctx.beginPath();
    ctx.lineWidth = // Set border line width
      userNode === this.centerNode ? scaledRadius * 0.13 : scaledRadius * 0.1;
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.stroke();
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
    ctx.lineWidth = this.EDGE_WIDTH;
    if (chon == 2) {
      ctx.setLineDash([4, 2]); // Dashline from 1-chons to 2-chons
    }
    ctx.beginPath();
    ctx.moveTo(screenEdgeA.x, screenEdgeA.y);
    ctx.lineTo(screenEdgeB.x, screenEdgeB.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  isNodeTouched(node: UserNode, touchPoint: Coord) {
    const scaledRadius = node.radius * this.panZoom.scale;
    const correctedPosition = getScreenPoint(node.coord, this.panZoom);
    const userNodeCenterScreenPosition = convertCartesianToScreen(
      this.element,
      correctedPosition,
      this.dpr,
    );
    return distPoints(touchPoint, userNodeCenterScreenPosition) <= scaledRadius;
  }

  nodeExpandAnimation() {
    const touchedNode = this.touchedNode!;
    if (touchedNode.userNode.radius >= touchedNode.maxRadius) {
      window.cancelAnimationFrame(this.requestAnimationId);
      return;
    }
    touchedNode.userNode.radius += this.EXPAND_SPEED;
    this.render();

    this.requestAnimationId = window.requestAnimationFrame(
      this.nodeExpandAnimation.bind(this),
    );
  }

  nodeContractAnimation() {
    const touchedNode = this.touchedNode!;
    if (touchedNode.userNode.radius <= touchedNode.minRadius) {
      window.cancelAnimationFrame(this.requestAnimationId);
      this.touchedNode = undefined;
      // return new Promise(resolve => {});
      return;
    }
    touchedNode.userNode.radius -= this.CONTRACT_SPEED;
    this.render();

    this.requestAnimationId = window.requestAnimationFrame(
      this.nodeContractAnimation.bind(this),
    );
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
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
    this.element.removeEventListener("wheel", this.handleWheel);
  }
}
