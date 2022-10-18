import { clear } from "console";
import { Coord, Coords } from "types/canvas.types";
export class Canvas {
  private element: HTMLCanvasElement;
  private width: number;
  private height: number

  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;
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

}

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

clear() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// RETURN_TYPE: Coords[]
// USAGE: Coords[i][0]: i-th 1-chon node's coordinate
//        Coords[i][j]: i-th 1-chon node's j-th 2-chon node coordiate; 1<= j <= num_2_chon+1
// NOTE: margin cannot be less than 22 or the nodes may overlap
export const get2ChonCoordinates = (
  oneChonCount: number,
  twoChonCount: number[],
  radius: number,
  maxConnections = 10,
  margin = 22,
) => {
  if (oneChonCount !== twoChonCount.length) {
    throw new Error("More number of 2-chons than 1-chons.");
  }

  const coordsLIst: Coords[] = [];

  const edge = 6 * radius;
  const degree = 360 / oneChonCount;

  let budget = Math.min(240, degree * 2 - margin);
  budget = Math.max(margin * Math.floor(budget / margin), margin);

  for (let i = 0; i < oneChonCount; i++) {
    const coordsTemp: Coords = [];
    const angle = degree * i;
    const xCoord = edge * Math.cos(degToRad(angle));
    const yCoord = edge * Math.sin(degToRad(angle));

    const coord1Chon: Coord = [xCoord, yCoord];
    coordsTemp.push(coord1Chon);

    const max2Chon = Math.min(Math.floor(budget / margin) + 1, maxConnections);
    if (max2Chon < twoChonCount[i]) {
      throw new Error("Number of 2-chons exceeded the maximum capacity.");
    }

    if (twoChonCount[i] === 1) {
      const x2Coord = xCoord + edge * Math.cos(degToRad(angle));
      const y2Coord = yCoord + edge * Math.sin(degToRad(angle));
      const coord: Coord = [x2Coord, y2Coord];
      coordsTemp.push(coord);
    } else {
      let theta = Math.min(budget / twoChonCount[i], 60);
      theta = Math.max(theta, 22);
      const budgetTemp = theta * twoChonCount[i];
      for (let j = 0; j < twoChonCount[i]; j++) {
        const x2Coord =
          xCoord +
          edge * Math.cos(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const y2Coord =
          yCoord +
          edge * Math.sin(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const coord: Coord = [x2Coord, y2Coord];
        coordsTemp.push(coord);
      }
    }
    coordsLIst.push(coordsTemp);
  }
  return coordsLIst;
};
