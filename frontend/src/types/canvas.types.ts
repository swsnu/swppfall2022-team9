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

export type Coords = OneChonUserCoord[];

export type PanZoom = {
  scale: number;
  offset: Coord;
};
