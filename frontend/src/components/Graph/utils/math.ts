import {
  Coord,
  OneChonUserCoord,
  TwoChonUserCoord,
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
 * @param oneChonCount
 * @param twoChonCount
 * @param radius
 * @param maxConnections
 * @param margin
 * @param expandRatio
 * @returns Coords[]
 */
export const getOneAndTwoChonCoordinates = (
  oneChonCount: number,
  twoChonCount: number[],
  radius: number,
  maxConnections = 10,
  margin = 22,
  expandRatio = 0.8,
) => {
  if (oneChonCount !== twoChonCount.length) {
    throw new Error("Number of 2-chons does match number of 1-chons.");
  }

  const coordsList: OneChonUserCoord[] = [];

  const edge = 6 * radius;
  const degree = 360 / oneChonCount;

  let budget = Math.min(240, degree * 2 - margin);
  budget = Math.max(margin * Math.floor(budget / margin), margin);

  for (let i = 0; i < oneChonCount; i++) {
    const curUserCoord: OneChonUserCoord = {
      userCoord: { x: 0, y: 0 },
      twoChonCoords: [],
    };
    const angle = degree * i;
    const xCoord = edge * Math.cos(degToRad(angle));
    const yCoord = edge * Math.sin(degToRad(angle));

    const coord1Chon: Coord = { x: xCoord, y: yCoord };
    curUserCoord.userCoord = coord1Chon;

    const max2Chon = Math.min(Math.floor(budget / margin) + 1, maxConnections);
    if (max2Chon < twoChonCount[i]) {
      console.error("Number of 2-chons exceeded the maximum capacity.");
    }

    if (twoChonCount[i] === 0) {
      //pass
    } else if (twoChonCount[i] === 1) {
      const x2Coord = xCoord + edge * Math.cos(degToRad(angle));
      const y2Coord = yCoord + edge * Math.sin(degToRad(angle));
      const coord: TwoChonUserCoord = {
        userCoord: { x: Math.floor(x2Coord), y: Math.floor(y2Coord) },
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
        twoChonCount[adjacentIndices[0]] < max2Chon - 1 &&
        twoChonCount[adjacentIndices[1]] < max2Chon - 1;

      let theta = Math.min(budget / twoChonCount[i], 60);
      theta = Math.max(theta, 22);
      let budgetTemp = theta * twoChonCount[i];

      // min -> expandRatio
      const spare = Math.min(
        max2Chon - twoChonCount[adjacentIndices[0]],
        max2Chon - twoChonCount[adjacentIndices[1]],
      );

      // adjust the budget appropriately
      if (isExpandable) {
        const ratio = (expandRatio * ((theta * spare) / 2)) / budgetTemp;
        const thetaTemp = theta + ratio * theta;
        if (thetaTemp < 60) {
          theta = thetaTemp;
          budgetTemp += expandRatio * ((theta * spare) / 2);
        }
      } else {
        // do nothing
      }

      for (let j = 0; j < twoChonCount[i]; j++) {
        const x2Coord =
          xCoord +
          edge * Math.cos(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const y2Coord =
          yCoord +
          edge * Math.sin(degToRad(angle - budgetTemp / 2 + (j + 0.5) * theta));
        const coord: TwoChonUserCoord = {
          userCoord: { x: Math.floor(x2Coord), y: Math.floor(y2Coord) },
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
  dpr: number,
): Coord => {
  const screenPoint = {
    x: Math.floor(cartesianCoord.x + canvas.width / dpr / 2),
    y: Math.floor(cartesianCoord.y + canvas.height / dpr / 2),
  } as Coord;
  return screenPoint;
};

export function diffPoints(p1: Coord, p2: Coord): Coord {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

export function addPoints(p1: Coord, p2: Coord): Coord {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

export function distPoints(p1: Coord, p2: Coord): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function gradientPoints(p1: Coord, p2: Coord): number {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

export function directionPoints(p1: Coord, p2: Coord): number {
  const signX = p1.x > p2.x ? -1 : p1.x === p2.x ? 0 : 1;
  const signY = p1.y > p2.y ? -1 : p1.y === p2.y ? 0 : 1;
  let direction = 0;

  if (signX === -1 && signY === 1) direction = 1;
  else if (signX === 0 && signY === 1) direction = 2;
  else if (signX === 1 && signY === 1) direction = 3;
  else if (signX === -1 && signY === 0) direction = 4;
  else if (signX === 0 && signY === 0) direction = 5;
  else if (signX === 1 && signY === 0) direction = 6;
  else if (signX === -1 && signY === -1) direction = 7;
  else if (signX === 0 && signY === -1) direction = 8;
  else if (signX === 1 && signY === -1) direction = 9;

  return direction;
}

/**
 * Actual world point is converted to screen(=viewing) point
 * @param point
 * @param panZoom
 * @returns
 */
export function getScreenPoint(point: Coord, panZoom: PanZoom): Coord {
  const { offset, scale } = panZoom;

  return {
    x: Math.floor(point.x * scale + offset.x),
    y: Math.floor(point.y * scale + offset.y),
  };
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

export const getEdgeCoords = (
  coordA: Coord,
  coordB: Coord,
  radiusA: number,
  radiusB: number,
) => {
  const delX = coordB.x - coordA.x;
  const delY = coordB.y - coordA.y;
  let theta = Math.atan(delY / delX);
  if (delX < 0) {
    theta += Math.PI;
  }
  const edgeA = {
    x: Math.floor(coordA.x + radiusA * Math.cos(theta)),
    y: Math.floor(coordA.y + radiusA * Math.sin(theta)),
  };
  const edgeB = {
    x: Math.floor(coordB.x + radiusB * Math.cos(theta + Math.PI)),
    y: Math.floor(coordB.y + radiusB * Math.sin(theta + Math.PI)),
  };
  return [edgeA, edgeB];
};
