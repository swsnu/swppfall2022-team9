import {
  Coord,
  OneChonUserCoord,
  TwoChonUserCoord,
  Coords,
  PanZoom,
} from "types/canvas.types";

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

/**
 * Description:
 * Coords[i][0]: i-th 1-chon node's coordinate
 * Coords[i][j]: i-th 1-chon node's j-th 2-chon node coordiate; 1<= j < num_2_chon+1
 *
 * NOTE:
 * margin cannot be less than 22 or the nodes may overlap
 * @param oneChonList
 * @param twoChonList
 * @param radius
 * @param maxConnections
 * @param margin
 * @param expandRatio
 * @returns Coords[]
 */
// TODO: update params to accept User[]
export const getOneAndTwoChonCoordinates = (
  oneChonList: string[],
  twoChonList: string[][],
  radius: number,
  maxConnections = 10,
  margin = 22,
  expandRatio = 0.8,
) => {
  const oneChonCount = oneChonList.length;
  const twoChonCount = twoChonList.length;
  if (oneChonCount !== twoChonCount) {
    throw new Error("More number of 2-chons than 1-chons.");
  }

  const coordsList: OneChonUserCoord[] = [];

  const edge = 6 * radius;
  const degree = 360 / oneChonCount;

  let budget = Math.min(240, degree * 2 - margin);
  budget = Math.max(margin * Math.floor(budget / margin), margin);

  for (let i = 0; i < oneChonCount; i++) {
    const curUserCoord: OneChonUserCoord = {
      userId: oneChonList[i],
      userCoord: { x: 0, y: 0 },
      twoChonCoords: [],
    };
    const angle = degree * i;
    const xCoord = edge * Math.cos(degToRad(angle));
    const yCoord = edge * Math.sin(degToRad(angle));

    const coord1Chon: Coord = { x: xCoord, y: yCoord };
    curUserCoord.userCoord = coord1Chon;

    const max2Chon = Math.min(Math.floor(budget / margin) + 1, maxConnections);
    if (max2Chon < twoChonList[i].length) {
      throw new Error("Number of 2-chons exceeded the maximum capacity.");
    }

    if (twoChonList[i].length === 0) {
      //pass
    } else if (twoChonList[i].length === 1) {
      const x2Coord = xCoord + edge * Math.cos(degToRad(angle));
      const y2Coord = yCoord + edge * Math.sin(degToRad(angle));
      const coord: TwoChonUserCoord = {
        userId: twoChonList[i][0],
        userCoord: { x: x2Coord, y: y2Coord },
      };
      curUserCoord.twoChonCoords.push(coord);
    } else {
      // check adjacent oneChons
      const adjacentIndices = [
        i == 0 ? oneChonCount - 1 : i - 1,
        i == oneChonCount - 1 ? 0 : i + 1,
      ];

      // check if they have at least two less than the max number of connections
      const isExpandable =
        twoChonList[adjacentIndices[0]].length < max2Chon - 1 &&
        twoChonList[adjacentIndices[1]].length < max2Chon - 1;

      let theta = Math.min(budget / twoChonList[i].length, 60);
      theta = Math.max(theta, 22);
      let budgetTemp = theta * twoChonList[i].length;

      // min -> expandRatio
      const spare = Math.min(
        max2Chon - twoChonList[adjacentIndices[0]].length,
        max2Chon - twoChonList[adjacentIndices[1]].length,
      );

      // adjust the budget appropriately
      if (isExpandable) {
        const ratio = (expandRatio * ((theta * spare) / 2)) / budgetTemp;
        const thetaTemp = theta + ratio * theta;
        if (thetaTemp < 60) {
          theta = thetaTemp;
          budgetTemp += expandRatio * ((theta * spare) / 2);
        }
      }
      for (let j = 0; j < twoChonList[i].length; j++) {
        const x2Coord =
          xCoord +
          edge * Math.cos(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const y2Coord =
          yCoord +
          edge * Math.sin(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const coord: TwoChonUserCoord = {
          userId: twoChonList[i][0],
          userCoord: { x: x2Coord, y: y2Coord },
        };
        curUserCoord.twoChonCoords.push(coord);
      }
    }
    coordsList.push(curUserCoord);
  }
  return coordsList;
};

export const convertCartesianToScreen = (
  canvas: HTMLCanvasElement,
  cartesianCoord: Coord,
): Coord => {
  const screenPoint = {
    x: cartesianCoord.x + canvas.width / 2,
    y: cartesianCoord.y + canvas.height / 2,
  } as Coord;
  return screenPoint;
};

export function diffPoints(p1: Coord, p2: Coord): Coord {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

export function addPoints(p1: Coord, p2: Coord): Coord {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

/**
 * Actual world point is converted to screen(=viewing) point
 * @param point
 * @param panZoom
 * @returns
 */
export function getScreenPoint(point: Coord, panZoom: PanZoom): Coord {
  const { offset, scale } = panZoom;

  return { x: point.x * scale + offset.x, y: point.y * scale + offset.y };
}

/**
 * This is the real point in the actual world
 * @param point
 * @param panZoom
 * @returns
 */
export function getWorldPoint(point: Coord, panZoom: PanZoom): Coord {
  const { offset, scale } = panZoom;

  return { x: (point.x - offset.x) / scale, y: (point.y - offset.y) / scale };
}
