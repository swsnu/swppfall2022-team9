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
  directionPoints,
  distPoints,
  getEdgeCoords,
  getOneAndTwoChonCoordinates,
  getScreenPoint,
  getWorldPoint,
  gradientPoints,
} from "./math";
import { addEvent, removeEvent, touchy, TouchyEvent } from "./touch";
import { OneChonInfo } from "types/friend.types";
import { ThemeColor } from "styles/common.styles";
import EventDispatcher from "./eventDispatcher";
export default class Canvas extends EventDispatcher {
  private MAX_SCALE = 2;

  private MIN_SCALE = 0.6;

  private ZOOM_SENSITIVITY = 300;

  private CENTER_NODE_RADIUS = NODE_RADIUS * 1.35;

  private EDGE_WIDTH = 3;

  private EDGE_LENGTH = NODE_RADIUS;

  private SHADOW_BLUR = 10;

  private SHADOW_OFFSET_X = 0.13;

  private SHADOW_OFFSET_Y = 0.13;

  private RESET_PANZOOM_SPEED_RATIO = 0.06;

  private MIN_RESET_PAN_SPEED = 0.2;

  private MIN_RESET_ZOOM_SPEED = 0.01;

  private PANZOOM_OFFSET_DIFF_THRESHOLD = 0.5;

  private PANZOOM_SCALE_DIFF_THRESHOLD = 0.001;

  private element: HTMLCanvasElement;

  private origin = { x: 0, y: 0 };

  private pinchZoomPrevDiff = 0;

  private panZoom: PanZoom = {
    scale: 1,
    offset: this.origin,
  };

  private panPoint: { lastMousePos: Coord } = {
    lastMousePos: this.origin,
  };

  private width = 0;

  private height = 0;

  private dpr = 1;

  private ctx: CanvasRenderingContext2D;

  private currentUser?: User;

  private friendList: OneChonInfo[] = [];

  // loadedImgCount = 0

  // totalImgCount = 0

  centerNode?: UserNode;

  oneChonNodes: OneChonNode[] = [];

  twoChonNodes: UserNode[] = [];

  nodes: UserNode[] = []; // For convenient node iteration

  touchedNode?: UserNode;

  isOneChonJourneyFinished = false;

  resetPanDirection = 0; // 1 ~ 9

  resetZoomDirection = 0; // -1 or 0 or 1

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.initialize();
  }

  reset() {
    this.scale(1, 1);
    this.panZoom = {
      scale: 1,
      offset: this.origin,
    };

    this.centerNode = undefined;
    this.oneChonNodes = [];
    this.twoChonNodes = [];
    this.nodes = [];
    this.touchedNode = undefined;
    this.isOneChonJourneyFinished = false;
    this.clear();
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
    const touchedNode = this.nodes.find(node => node.isTouched(pointCoord));
    if (touchedNode) {
      this.emit("setPreviewProfile", touchedNode.id);
    } else {
      this.emit("setPreviewProfile", null);
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
    const touchedNode = this.nodes.find(node => node.isTouched(pointCoord));
    if (touchedNode) {
      if (this.touchedNode) {
        if (touchedNode.id === this.touchedNode.id) {
          return;
        }
        window.cancelAnimationFrame(this.touchedNode.expandAnimationId);
        this.touchedNode.expandAnimationId = 0;
        this.touchedNode.contract();
      }

      this.touchedNode = touchedNode;
      if (!this.touchedNode.isNotSearched) {
        // Only filtered nodes can expand and contract
        window.cancelAnimationFrame(this.touchedNode.contractAnimationId);
        touchedNode.expand();
      }
    } else {
      if (this.touchedNode) {
        window.cancelAnimationFrame(this.touchedNode.expandAnimationId);
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
    this.emit("setIsPanZoomed");
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

  async startResetPanZoom() {
    this.destroy();
    this.resetPanDirection = directionPoints(this.panZoom.offset, this.origin);
    this.resetZoomDirection =
      this.panZoom.scale === 1 ? 0 : this.panZoom.scale > 1 ? -1 : 1;
    await this.resetPanZoom();
    this.initialize();
  }

  async resetPanZoom(): Promise<void> {
    while (
      (directionPoints(this.panZoom.offset, this.origin) !== 5 &&
        this.resetPanDirection ===
          directionPoints(this.panZoom.offset, this.origin)) ||
      this.panZoom.scale !== 1
    ) {
      let resetPanSpeed = Math.abs(this.panZoom.offset.x)
        ? (Math.abs(this.panZoom.offset.x) * this.RESET_PANZOOM_SPEED_RATIO) /
          this.dpr
        : (Math.abs(this.panZoom.offset.y) * this.RESET_PANZOOM_SPEED_RATIO) /
          this.dpr;
      resetPanSpeed =
        resetPanSpeed < this.MIN_RESET_PAN_SPEED
          ? this.MIN_RESET_PAN_SPEED
          : resetPanSpeed;
      let resetZoomSpeed =
        (Math.abs(this.panZoom.scale - 1) * this.RESET_PANZOOM_SPEED_RATIO) /
        this.dpr;

      console.log(resetZoomSpeed);
      console.log(this.panZoom.scale);

      resetZoomSpeed =
        resetZoomSpeed < this.MIN_RESET_ZOOM_SPEED
          ? this.MIN_RESET_ZOOM_SPEED
          : resetZoomSpeed;
      const gradient = gradientPoints(this.panZoom.offset, this.origin);

      if (
        distPoints(this.panZoom.offset, this.origin) <
          this.PANZOOM_OFFSET_DIFF_THRESHOLD &&
        Math.abs(this.panZoom.scale - 1) < this.PANZOOM_SCALE_DIFF_THRESHOLD
      ) {
        this.panZoom.offset = this.origin;
        this.panZoom.scale = 1;
        break;
      }
      // Reset Pan
      switch (this.resetPanDirection) {
        case 1:
          this.panZoom.offset.x -= resetPanSpeed;
          this.panZoom.offset.y -= gradient * resetPanSpeed;
          break;
        case 2:
          this.panZoom.offset.y += resetPanSpeed;
          break;
        case 3:
          this.panZoom.offset.x += resetPanSpeed;
          this.panZoom.offset.y += gradient * resetPanSpeed;
          break;
        case 4:
          this.panZoom.offset.x -= resetPanSpeed;
          break;
        // case 5:
        //   break;
        case 6:
          this.panZoom.offset.x += resetPanSpeed;
          break;
        case 7:
          this.panZoom.offset.x -= resetPanSpeed;
          this.panZoom.offset.y -= gradient * resetPanSpeed;
          break;
        case 8:
          this.panZoom.offset.y -= resetPanSpeed;
          break;
        case 9:
          this.panZoom.offset.x += resetPanSpeed;
          this.panZoom.offset.y += gradient * resetPanSpeed;
          break;
      }
      // Reset Zoom
      if (this.panZoom.scale > 1) {
        this.panZoom.scale -= resetZoomSpeed;
        if (this.panZoom.scale < 1) this.panZoom.scale = 1;
      } else if (this.panZoom.scale < 1) {
        this.panZoom.scale += resetZoomSpeed;
        if (this.panZoom.scale > 1) this.panZoom.scale = 1;
      }
      this.render();
      await new Promise(requestAnimationFrame);
    }
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
  }

  setFriendList(friendList: OneChonInfo[]) {
    this.oneChonNodes = [];
    this.twoChonNodes = [];
    this.nodes = [this.centerNode!];
    this.friendList = friendList;
  }

  setCenterNode(userId: number) {
    this.centerNode = undefined;
    this.nodes = [];
    this.clear();
    const targetOneChon = this.friendList.find(
      oneChon => oneChon.id === userId,
    );
    const currentUser = this.currentUser!;
    const centerNode = new UserNode(
      userId,
      targetOneChon
        ? targetOneChon.lastname + targetOneChon.firstname
        : currentUser.lastname + currentUser.firstname,
      this.origin,
      this.origin,
      this,
      targetOneChon ? targetOneChon.imgUrl : currentUser.imgUrl,
      false,
      this.CENTER_NODE_RADIUS,
    );
    this.centerNode = centerNode;
    this.nodes = [centerNode];
  }

  setFriendNodes(userId: number) {
    this.oneChonNodes = [];
    this.twoChonNodes = [];
    this.clear();
    const targetOneChon = this.friendList.find(
      oneChon => oneChon.id === userId,
    );
    if (targetOneChon) {
      if (targetOneChon.chons.length === 0) {
        this.oneChonNodes = [];
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
          oneChon.lastname + oneChon.firstname,
          this.origin,
          coords[oneChonIdx].userCoord,
          this,
          [],
          oneChon.imgUrl,
          oneChon.isNotSearched,
        );
        this.nodes.push(oneChonNode);
        return oneChonNode;
      });
      // No two-chons(my three-chons) in one-chon's graph
      this.twoChonNodes = [];
    } else {
      const friendList = this.friendList;
      if (friendList.length === 0) {
        this.oneChonNodes = [];
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
        const omitCount = coords[oneChonIdx].omitCount;
        const sortedChons = [...oneChon.chons].sort((a, b) => {
          return friendList.find(friend => friend.id === a.id)
            ? 1
            : friendList.find(friend => friend.id === b.id)
            ? -1
            : 0;
        });
        const twoChonNodes = sortedChons.map((twoChon, twoChonIdx) => {
          const twoChonNode = new UserNode(
            twoChon.id,
            twoChon.lastname + twoChon.firstname,
            twoChonIdx < sortedChons.length - omitCount
              ? coords[oneChonIdx].userCoord
              : { x: -1, y: -1 },
            twoChonIdx < sortedChons.length - omitCount
              ? coords[oneChonIdx].twoChonCoords[twoChonIdx].userCoord
              : { x: -1, y: -1 },
            this,
            twoChon.imgUrl,
            twoChon.isNotSearched,
          );
          this.nodes.push(twoChonNode);
          this.twoChonNodes.push(twoChonNode);
          return twoChonNode;
        });

        const oneChonNode = new OneChonNode(
          oneChon.id,
          oneChon.lastname + oneChon.firstname,
          this.origin,
          coords[oneChonIdx].userCoord,
          this,
          twoChonNodes,
          oneChon.imgUrl,
          oneChon.isNotSearched,
          omitCount,
        );
        this.nodes.push(oneChonNode);
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

  async startNodeJourney() {
    this.isOneChonJourneyFinished = false;
    if (this.oneChonNodes.length > 0) {
      const oneChonJourneys: Promise<void>[] = this.oneChonNodes.map(
        async oneChonNode => {
          await oneChonNode.journey();
        },
      );
      await Promise.all(oneChonJourneys);
      this.isOneChonJourneyFinished = true;

      if (this.twoChonNodes.length > 0) {
        const twoChonJourneys: Promise<void>[] = this.twoChonNodes.map(
          async twoChonNode => {
            await twoChonNode.journey();
          },
        );
        await Promise.all(twoChonJourneys);
      }
    }
  }

  renderGraph(userId: number) {
    this.reset();
    this.setCenterNode(userId);
    this.setFriendNodes(userId);
    this.startNodeJourney();
  }

  drawGraph() {
    if (this.centerNode) {
      if (this.isOneChonJourneyFinished) {
        this.twoChonNodes.forEach(twoChonNode => {
          const [edgeFromOneChonNode, edgeToTwoChon] = getEdgeCoords(
            twoChonNode.originCoord,
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
      this.oneChonNodes.forEach(oneChonNode => {
        const [edgeFromCenterNode, edgeToOneChon] = getEdgeCoords(
          oneChonNode.originCoord,
          oneChonNode.coord,
          this.centerNode!.radius,
          oneChonNode.radius,
        );
        this.drawEdge(edgeFromCenterNode, edgeToOneChon, 1); // Edge from current user to 1-chon
        this.drawUserNode(oneChonNode);
      });
      this.drawUserNode(this.centerNode);
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
    ctx.fillStyle = ThemeColor;
    ctx.fill();
    ctx.clip();
    ctx.closePath();

    // ctx.filter = `opacity(${opacity * 100}%)`; -> not supported in Safari

    // Draw user image
    // only if the image is successfully loaded
    if (userNode.imgElement.complete && userNode.imgElement.naturalHeight) {
      ctx.drawImage(
        userNode.imgElement,
        centerX - scaledRadius,
        centerY - scaledRadius,
        scaledRadius * 2,
        scaledRadius * 2,
      );
    }

    // For not searched one-chon
    if (userNode.isNotSearched) {
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
      ctx.fill();
      ctx.closePath();
    }

    // Draw round border
    ctx.restore();
    ctx.save();
    // If hover
    if (userNode.radius === userNode.originalRadius * userNode.EXPAND_RATE) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
      ctx.fill();
      ctx.fillStyle = `rgba(252, 100, 255, 0.2)`;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.save();

      // Draw username text
      ctx.fillStyle = "black";
      ctx.font = `900 ${scaledRadius * 0.5}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(
        userNode.name,
        centerX,
        centerY + scaledRadius * 0.13,
        scaledRadius * 1.8,
      );
      // Draw shadow
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = userNode.radius * this.SHADOW_OFFSET_X;
      ctx.shadowOffsetY = userNode.radius * this.SHADOW_OFFSET_Y;
      ctx.shadowBlur = this.SHADOW_BLUR;
    }
    ctx.beginPath();
    ctx.lineWidth = // Set border line width
      userNode === this.centerNode ? scaledRadius * 0.08 : scaledRadius * 0.07;
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // Draw omit count
    if (userNode instanceof OneChonNode && userNode.omitCount) {
      // Draw background box
      this.roundRect(
        centerX + scaledRadius * 0.1,
        centerY + scaledRadius * 0.5,
        scaledRadius * 1.2,
        scaledRadius * 0.6,
        10,
      );
      ctx.save();
      // Draw omit count text
      ctx.fillStyle = "white";
      ctx.font = `900 ${scaledRadius * 0.5}px monospace`;
      ctx.fillText(
        `+${userNode.omitCount}`,
        centerX + scaledRadius * 0.4,
        centerY + scaledRadius * 0.95,
        scaledRadius * 1.8,
      );
      ctx.restore();
    }
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

  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
    const ctx = this.ctx;
    // if (width < 2 * radius) radius = width / 2;
    // if (height < 2 * radius) radius = height / 2;
    ctx.save();
    ctx.fillStyle = "#FF7C7C";
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
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
    touchy(this.element, removeEvent, "mousemove", this.onMouseMove);
    touchy(this.element, removeEvent, "mousemove", this.handlePanning);
    touchy(this.element, removeEvent, "mousemove", this.handlePinchZoom);
    this.element.removeEventListener("wheel", this.handleWheel);
  }
}
