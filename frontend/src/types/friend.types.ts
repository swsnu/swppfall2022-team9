export interface TwoChonInfo {
  id: number;
  firstname: string;
  lastname: string;
  imgUrl: string;
  isNotSearched?: boolean; // true if does not contain search keyword
}

export interface OneChonInfo extends TwoChonInfo {
  chons: TwoChonInfo[];
}
