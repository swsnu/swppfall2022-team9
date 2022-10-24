import { Coord, Coords, PanZoom } from "types/canvas.types";

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

/**
 * Description:
 * Coords[i][0]: i-th 1-chon node's coordinate
 * Coords[i][j]: i-th 1-chon node's j-th 2-chon node coordiate; 1<= j <= num_2_chon+1
 *
 * NOTE:
 * margin cannot be less than 22 or the nodes may overlap
 * @param oneChonCount
 * @param twoChonCount
 * @param radius
 * @param maxConnections
 * @param margin
 * @returns Coords[]
 */
export const getOneAndTwoChonCoordinates = (
  oneChonCount: number,
  twoChonCount: number[],
  radius: number,
  maxConnections = 10,
  margin = 22,
) => {
  if (oneChonCount !== twoChonCount.length) {
    throw new Error("More number of 2-chons than 1-chons.");
  }

  const coordsList: Coords[] = [];

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
    coordsList.push(coordsTemp);
  }
  return coordsList;
};

export const convertCartesianToScreen = (
  canvas: HTMLCanvasElement,
  cartesianCoord: Coord,
): Coord => {
  const screenPoint = [
    cartesianCoord[0] + canvas.width / 2,
    cartesianCoord[1] + canvas.height / 2,
  ] as Coord;
  return screenPoint;
};

export function diffPoints(p1: Coord, p2: Coord): Coord {
  return [p1[0] - p2[0], p1[1] - p2[1]];
}

export function getScreenPoint(point: Coord, panZoom: PanZoom): Coord {
  const { offset, scale } = panZoom;

  return [point[0] * scale + offset[0], point[1] * scale + offset[1]];
}
