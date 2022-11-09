export interface TwoChonInfo {
  id: number;
  firstname: string;
  lastname: string;
  imgUrl: string;
}

export interface OneChonInfo extends TwoChonInfo {
  chons: TwoChonInfo[];
}
