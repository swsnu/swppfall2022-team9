export interface TwoChonInfo {
  id: number;
  firstname: string;
  lastname: string;
  imgUrl: string;
  isNotFiltered?: boolean;
}

export interface OneChonInfo extends TwoChonInfo {
  chons: TwoChonInfo[];
}
