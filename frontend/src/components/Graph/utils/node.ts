import { Coord } from "types/canvas.types";

export class UserNode {
  radius = 50;

  imgUrl: string;

  name: string;

  coord: Coord;

  constructor(imgUrl: string, name: string, coord: Coord) {
    this.imgUrl = imgUrl;
    this.name = name;
    this.coord = coord;
  }

  setCoord(newCoord: Coord) {
    this.coord[0] = newCoord[0];
    this.coord[1] = newCoord[1];
  }
}
