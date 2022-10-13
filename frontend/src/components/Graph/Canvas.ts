export class Canvas {
  private element: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas;
    this.ctx = canvas.getContext("2d")!;
  }
}

export type Coord<T, K> = [T, K];
export type Coords = Coord<number, number>[];

const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
}

// const radToDeg = (rad: number) => {
//   return rad / (Math.PI / 180);
// }


// RETURN_TYPE: Coords[]
// USAGE: Coords[i][0]: i-th 1-chon node's coordinate
//        Coords[i][j]: i-th 1-chon node's j-th 2-chon node coordiate; 1<= j <= num_2_chon+1
export const get_2_chon_coordinates = (number_1_chon: number, numbers_2_chon: number[], radius: number, max_connections = 10, margin = 22) => {
  if (number_1_chon !== numbers_2_chon.length) {
    throw new Error("More number of 2-chons than 1-chons.")
  }

  const coords_list: Coords[] = [];

  const edge = 6 * radius;
  const degree = 360 / number_1_chon;

  let budget = Math.min(240, degree * 2 - margin);
  budget = Math.max(margin * (Math.floor(budget / margin)), margin);

  for (let i = 0; i < number_1_chon; i++) {
    const coords_temp: Coords = [];
    const angle = degree * i;
    const x_coord = edge * Math.cos(degToRad(angle));
    const y_coord = edge * Math.sin(degToRad(angle));

    const coord_1_chon: Coord<number, number> = [x_coord, y_coord];
    coords_temp.push(coord_1_chon);

    let max_2_chon = Math.min(Math.floor(budget / margin)+1, 10)
    if (max_2_chon < numbers_2_chon[i]) {
      throw new Error("Number of 2-chons exceeded the maximum capacity.")
    }

    if (numbers_2_chon[i] === 1) {
      const x2_coord = x_coord + edge * Math.cos(degToRad(angle));
      const y2_coord = y_coord + edge * Math.sin(degToRad(angle));
      const coord: Coord<number, number> = [x2_coord, y2_coord];
      coords_temp.push(coord)
    } else {
      let theta = Math.min(budget / numbers_2_chon[i], 60);
      theta = Math.max(theta, 22);
      const budget_temp = theta * numbers_2_chon[i];
      for (let j = 0; j < numbers_2_chon[i]; j++) {
        const x2_coord = x_coord + edge * Math.cos(degToRad(angle-(budget_temp/2)+(j+0.5)*theta));
        const y2_coord = y_coord + edge * Math.sin(degToRad(angle-(budget_temp/2)+(j+0.5)*theta));
        const coord: Coord<number, number> = [x2_coord, y2_coord];
        coords_temp.push(coord);
      }
    }
    coords_list.push(coords_temp);
  }
  return coords_list;
}

// console.log(get_2_chon_coordinates(5, [5,3,6,6,6], 3));