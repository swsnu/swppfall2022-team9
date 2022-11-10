import { Coord } from "types/canvas.types";

export const NODE_RADIUS = 40;

export class UserNode {
  radius: number;

  imgElement: HTMLImageElement;

  name: string;

  coord: Coord;

  constructor(
    imgUrl: string,
    name: string,
    coord: Coord,
    radius = NODE_RADIUS,
  ) {
    this.imgElement = new Image();
    this.imgElement.src = imgUrl;
    this.name = name;
    this.coord = coord;
    this.radius = radius;
  }
}

export class OneChonNode extends UserNode {
  twoChonNodes?: UserNode[];

  constructor(
    imgUrl: string,
    name: string,
    coord: Coord,
    twoChonNodes: UserNode[],
  ) {
    super(imgUrl, name, coord);
    this.twoChonNodes = twoChonNodes;
  }
}
