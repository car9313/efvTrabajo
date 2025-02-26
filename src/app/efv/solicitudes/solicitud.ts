export class Solicitud {
  constructor(
    public id_solicitud: number = null,
    public cantidad: number = null,
    // public usuario: string = '',
    // public tipo_visa: string = '',
    public fecha_solicitud: Date = null,
    // public ip: string = '',
    //public plataforma: string = '',
    public estado_solicitd: string = '',
    public tipo_visa: string = '',
    public entidad: string = '' //public estado_proceso: string = '',
  ) // public fecha_estado_proceso: Date = null,
  // public fecha_estado_solicitud: Date = null,
  //  public fecha_udp: Date = null,
  {}
}
