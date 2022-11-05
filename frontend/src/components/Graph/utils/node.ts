import { Coord } from "types/canvas.types";

export class UserNode {
  radius = 40;

  imgElement: HTMLImageElement;

  name: string;

  coord: Coord;

  constructor(imgUrl: string, name: string, coord: Coord) {
    this.imgElement = new Image();
    this.imgElement.src = imgUrl;
    this.name = name;
    this.coord = coord;
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
