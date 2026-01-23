export interface IRegion {
  id: number;
  name: string;
}

export interface ISettlement {
  id: number;
  name: string;
  region: IRegion;
}

export interface IPostOffice {
  id: number;
  name: string;
  status: string;
  settlement: ISettlement;
}
