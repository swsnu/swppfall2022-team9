import { Coord } from "types/canvas.types";
import { assert } from "console";
import * as MATH from "./math";

describe("<math.ts/>", () => {
  it("computes one and two chon coordinates", () => {
    const oneChon = 5;
    const twoChon = [2, 3, 1, 3, 0];
    const radius = 3;
    const res = MATH.getOneAndTwoChonCoordinates(oneChon, twoChon, radius);
    assert(res.length === 5);
  });

  it("computes one and two chon coordinates and checks adjacent conditions", () => {
    const oneChon = 5;
    const twoChon = [2, 3, 1, 2, 2];
    const radius = 3;
    const res = MATH.getOneAndTwoChonCoordinates(oneChon, twoChon, radius);
    assert(res.length === 5);
  });

  it("computes one and two chon coordinates and checks expandable condition", () => {
    const oneChon = 4;
    const twoChon = [7, 2, 4, 7];
    const radius = 3;
    const res = MATH.getOneAndTwoChonCoordinates(oneChon, twoChon, radius);
    assert(res.length === 4);
  });

  it("throws error : number of 2-chons !== number of 1 chons", () => {
    const oneChon = 5;
    const twoChon = [1, 1, 1, 1];
    const radius = 3;
    try {
      MATH.getOneAndTwoChonCoordinates(oneChon, twoChon, radius);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toEqual(
          "Number of 2-chons does match number of 1-chons.",
        );
      }
    }
  });
  it("throws error : Number of 2-chons exceeded the maximum capacity.", () => {
    const oneChon = 5;
    const twoChon = [10, 100, 100, 100, 10];
    const radius = 3;
    try {
      MATH.getOneAndTwoChonCoordinates(oneChon, twoChon, radius);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toEqual(
          "Number of 2-chons exceeded the maximum capacity.",
        );
      }
    }
  });
  it("computes edge coordinates given two coordinates", () => {
    const coordA: Coord = { x: 10, y: 10 };
    const coordB: Coord = { x: 15, y: 15 };
    const radius = 3;
    const res = MATH.getEdgeCoords(coordA, coordB, radius, radius);
    assert(res.length === 2);
  });
  it("computes edge coordinates given two coordinates in opposite orientation", () => {
    const coordA: Coord = { x: 15, y: 10 };
    const coordB: Coord = { x: 10, y: 15 };
    const radius = 3;
    const res = MATH.getEdgeCoords(coordA, coordB, radius, radius);
    assert(res.length === 2);
  });
  it("computes user node's forwarding direction with various coordinates", () => {
    const originCoord: Coord = { x: 0, y: 0 };

    const destCoord1: Coord = { x: -1, y: 1 };
    const direction1 = MATH.directionPoints(originCoord, destCoord1);
    expect(direction1).toBe(1);

    const destCoord2: Coord = { x: 0, y: 1 };
    const direction2 = MATH.directionPoints(originCoord, destCoord2);
    expect(direction2).toBe(2);

    const destCoord3: Coord = { x: 1, y: 1 };
    const direction3 = MATH.directionPoints(originCoord, destCoord3);
    expect(direction3).toBe(3);

    const destCoord4: Coord = { x: -1, y: 0 };
    const direction4 = MATH.directionPoints(originCoord, destCoord4);
    expect(direction4).toBe(4);

    const destCoord5: Coord = { x: 0, y: 0 };
    const direction5 = MATH.directionPoints(originCoord, destCoord5);
    expect(direction5).toBe(5);

    const destCoord6: Coord = { x: 1, y: 0 };
    const direction6 = MATH.directionPoints(originCoord, destCoord6);
    expect(direction6).toBe(6);

    const destCoord7: Coord = { x: -1, y: -1 };
    const direction7 = MATH.directionPoints(originCoord, destCoord7);
    expect(direction7).toBe(7);

    const destCoord8: Coord = { x: 0, y: -1 };
    const direction8 = MATH.directionPoints(originCoord, destCoord8);
    expect(direction8).toBe(8);

    const destCoord9: Coord = { x: 1, y: -1 };
    const direction9 = MATH.directionPoints(originCoord, destCoord9);
    expect(direction9).toBe(9);
  });
});
