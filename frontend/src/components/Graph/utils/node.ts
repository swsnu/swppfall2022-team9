import { Coord } from "types/canvas.types";

export const NODE_RADIUS = 40;

export class UserNode {
  id: number;

  radius: number;

  imgElement: HTMLImageElement;

  name: string;

  coord: Coord;

  isNotFiltered: boolean;

  constructor(
    id: number,
    imgUrl: string,
    name: string,
    coord: Coord,
    isNotFiltered = false,
    radius = NODE_RADIUS,
  ) {
    this.id = id;
    this.imgElement = new Image();
    this.imgElement.src = imgUrl;
    this.name = name;
    this.coord = coord;
    this.radius = radius;
    this.isNotFiltered = isNotFiltered;
  }
}

export class OneChonNode extends UserNode {
  twoChonNodes?: UserNode[];

  constructor(
    id: number,
    imgUrl: string,
    name: string,
    coord: Coord,
    twoChonNodes: UserNode[],
    isNotFiltered = false,
  ) {
    super(id, imgUrl, name, coord, isNotFiltered);
    this.twoChonNodes = twoChonNodes;
  }
}
