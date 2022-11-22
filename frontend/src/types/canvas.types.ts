import { UserNode } from "components/Graph/utils/node";

export interface Coord {
  x: number;
  y: number;
}

export interface TwoChonUserCoord {
  userCoord: Coord;
}
export interface OneChonUserCoord extends TwoChonUserCoord {
  twoChonCoords: TwoChonUserCoord[];
}

export type PanZoom = {
  scale: number;
  offset: Coord;
};

export interface NodeTouchInfo {
  userNode: UserNode;
  minRadius: number;
  maxRadius: number;
}
