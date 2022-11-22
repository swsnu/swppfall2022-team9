import { User } from "server/models/users.model";
import { Coord, PanZoom } from "types/canvas.types";
import {
  NODE_RADIUS,
  OneChonNode,
  UserNode,
} from "components/Graph/utils/node";
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
import { OneChonInfo } from "types/friend.types";
import { ThemeColor } from "styles/common.styles";
export class Canvas {
  private MAX_SCALE = 2;

  private MIN_SCALE = 0.6;

  private ZOOM_SENSITIVITY = 300;

  private CENTER_NODE_RADIUS = NODE_RADIUS * 1.4;

  private EDGE_WIDTH = 3;

  private EDGE_LENGTH = NODE_RADIUS;

  private OPACITY_NOT_FILTERED = 10;

  private OPACITY_EXPANDED = 30;

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

  private touchedNode?: UserNode;

  private isOneChonNodesJourneyFinished = false;

  private isTwoChonNodesJourneyFinished = false;

  private flag = false;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.initialize();
  }

  getContext() {
    return this.ctx;
  }

  getPanZoom() {
    return this.panZoom;
  }

  getCanvasElement() {
    return this.element;
  }

  getDpr() {
    return this.dpr;
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
    const pointCoord = { x: point.offsetX, y: point.offsetY };
    this.panPoint.lastMousePos = { x: point.offsetX, y: point.offsetY };
    const touchedNode = this.nodes?.find(node => node.isTouched(pointCoord));
    if (touchedNode) {
      // TODO
      // Add node click action
      if (
        this.oneChonNodes?.find(
          oneChonNode => oneChonNode.id === touchedNode.id,
        )
      ) {
        this.setCenterNode(touchedNode.id);
        this.setOneChonNodes(touchedNode.id);
        this.render();
      }
    }

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
    const touchedNode = this.nodes?.find(node => node.isTouched(pointCoord));
    if (touchedNode) {
      if (
        this.touchedNode &&
        this.touchedNode !== touchedNode &&
        !this.touchedNode.isNotFiltered
      ) {
        window.cancelAnimationFrame(this.touchedNode.expandAnimationId);
        this.touchedNode.expandAnimationId = 0;
        this.touchedNode.contract();
      }

      this.touchedNode = touchedNode;
      if (
        !this.touchedNode.expandAnimationId &&
        !this.touchedNode.isNotFiltered // Only filtered nodes can expand and contract
      ) {
        window.cancelAnimationFrame(this.touchedNode.contractAnimationId);
        this.touchedNode.contractAnimationId = 0;
        touchedNode.expand();
        console.log(touchedNode.direction);
      }
    } else {
      if (this.touchedNode && !this.touchedNode.contractAnimationId) {
        window.cancelAnimationFrame(this.touchedNode.expandAnimationId);
        this.touchedNode.expandAnimationId = 0;
        this.touchedNode.contract();
        this.touchedNode = undefined;
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
    const targetOneChon = this.friendList.find(
      oneChon => oneChon.id === userId,
    );
    const centerNode = new UserNode(
      userId,
      targetOneChon
        ? targetOneChon.imgUrl
        : "https://play-lh.googleusercontent.com/38AGKCqmbjZ9OuWx4YjssAz3Y0DTWbiM5HB0ove1pNBq_o9mtWfGszjZNxZdwt_vgHo=w240-h480-rw",
      targetOneChon
        ? targetOneChon.lastname + targetOneChon.firstname
        : this.currentUser!.lastname + this.currentUser!.firstname,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      this,
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
    const targetOneChon = this.friendList.find(
      oneChon => oneChon.id === userId,
    );
    if (targetOneChon) {
      if (targetOneChon.chons.length === 0) {
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
          { x: 0, y: 0 },
          coords[oneChonIdx].userCoord,
          this,
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
      if (friendList.length === 0) {
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
            coords[oneChonIdx].userCoord,
            coords[oneChonIdx].twoChonCoords[twoChonIdx].userCoord,
            this,
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
          { x: 0, y: 0 },
          coords[oneChonIdx].userCoord,
          this,
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
      this.oneChonNodes?.forEach(oneChonNode => {
        const [edgeFromCenterNode, edgeToOneChon] = getEdgeCoords(
          this.centerNode!.coord,
          oneChonNode.coord,
          this.centerNode!.radius,
          oneChonNode.radius,
        );
        this.drawEdge(edgeFromCenterNode, edgeToOneChon, 1); // Edge from current user to 1-chon

        if (this.isOneChonNodesJourneyFinished) {
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
        }
        this.drawUserNode(oneChonNode);
      });
      this.drawUserNode(this.centerNode);
    }
  }

  drawAnimatedGraph() {
    if (this.centerNode) {
      this.flag = true;
      const oneChonNodes: OneChonNode[] = [];
      const twoChonNodes: UserNode[] = [];
      this.oneChonNodes?.forEach(oneChonNode => {
        oneChonNode.journey();
        // oneChonNodes.push(oneChonNode);
        // oneChonNode.twoChonNodes?.forEach(twoChonNode => {
        //   twoChonNodes.push(twoChonNode);
        // });
      });
      // oneChonNodes.forEach(oneChonNode => oneChonNode.journey());
      // this.isOneChonNodesJourneyFinished = true;
    }
  }

  drawUserNode(userNode: UserNode) {
    const ctx = this.ctx;
    const scaledRadius = userNode.radius * this.panZoom.scale;
    // const correctedPosition = getScreenPoint(userNode.destCoord, this.panZoom);
    const correctedPosition = getScreenPoint(userNode.coord, this.panZoom);
    const screenPosition = convertCartesianToScreen(
      this.element,
      correctedPosition,
      this.dpr,
    );
    const centerX = screenPosition.x;
    const centerY = screenPosition.y;
    const opacity = userNode.isNotFiltered
      ? this.OPACITY_NOT_FILTERED
      : userNode.radius === userNode.originalRadius * userNode.EXPAND_RATE
      ? this.OPACITY_EXPANDED
      : 100;

    // User node clipped in circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = ThemeColor;
    ctx.fill();
    ctx.clip();
    ctx.closePath();

    // Draw user image
    ctx.filter = `opacity(${opacity}%)`;
    ctx.drawImage(
      userNode.imgElement,
      centerX - scaledRadius,
      centerY - scaledRadius,
      scaledRadius * 2,
      scaledRadius * 2,
    );
    if (userNode.radius === userNode.originalRadius * userNode.EXPAND_RATE) {
      ctx.restore();
      ctx.fillStyle = "black";
      ctx.font = `900 ${scaledRadius * 0.5}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(
        userNode.name,
        centerX,
        centerY + scaledRadius * 0.13,
        scaledRadius * 1.8,
      );
    }

    // Draw round border
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = // Set border line width
      userNode === this.centerNode ? scaledRadius * 0.1 : scaledRadius * 0.07;
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
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
    if (chon === 2) {
      ctx.setLineDash([4, 2]); // Dashline from 1-chons to 2-chons
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
    if (!this.flag) {
      this.drawAnimatedGraph();
    } else {
      this.drawGraph();
    }
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
