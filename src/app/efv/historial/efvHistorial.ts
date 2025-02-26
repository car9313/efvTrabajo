export class EfvHistorial {
  constructor(
    public id: number = null,
    public numero_fv: string = '',
    public statuse_fv: number = null,
    public categoria_visa: string = '',
    public fecha_registro: string = '',
    public fecha_hab: string = '',
    public fecha_activado: string = '',
    public fecha_desactivado: string = '',
    public fecha_revocado: string = '',
    public id_segmento: number = null,
    public id_solicitud: number = null,
    public estado_solicitd: string = '',
    public estado_proceso: string = '',
    public fecha_solicitud: string = '',
    public fecha_estado_proceso: string = '',
    public fecha_estado_sol: string = '',
    public primer_nombre: string = '',
    public primer_apellido: string = '',
    public segundo_nombre: string = '',
    public segundo_apellido: string = '',
    public sexo: string = '',
    public fecha_nacimiento: string = '',
    public ciudadania: string = '',
    public pasaporte: string = '',
    public intermediario: string = '',
    public pais: string = '',
    public fecha_venta: string = '',
  ) {

  }
}
