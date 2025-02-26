export interface CurrentUser {
  national: boolean;
  province: number;
  municipality: number;
  province_location: Array<number>;
  puesto_mando: number;
  emplantillamiento: any;
  pm_id: number;
  [p: string]: any;
}
