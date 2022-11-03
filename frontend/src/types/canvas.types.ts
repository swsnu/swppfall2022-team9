export type Coord = { x: number; y: number };

export type OneChonUserCoord = {
  userId: string;
  userCoord: Coord;
  twoChonCoords: TwoChonUserCoord[];
};

export type TwoChonUserCoord = {
  userId: string;
  userCoord: Coord;
};
export type Coords = OneChonUserCoord[];

export type PanZoom = {
  scale: number;
  offset: Coord;
};
