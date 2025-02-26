export class Municipality {
  constructor(public id: number = null,
              public code: string = '',
              public desc_short: string = '',
              public desc_long: string = '',
              public province_id: number = null,
              public province_descrip: string = '') {
  }
}
