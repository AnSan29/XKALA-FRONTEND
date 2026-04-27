export interface EPP {
  casco: boolean;
  gafas: boolean;
  reflectivo: boolean;
  botas: boolean;
  arnes: boolean;
}

export interface RegistroEntrada {
  lat: number;
  lng: number;
  epp: EPP;
}

export interface RegistroSalida {
  lat: number;
  lng: number;
  motivo: string;
  observacion?: string;
}
