export type Coord = [x: number, y: number];
export type Coords = Coord[];

export type PanZoom = {
  scale: number;
  offset: Coord;
};
