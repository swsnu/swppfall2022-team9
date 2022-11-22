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
});
