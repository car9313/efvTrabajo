export class Audit {
  constructor(public user_full_name: string = '',
              public user_name: string = '',
              public id: string = '',
              public user_host_address: string = '',
              public table_name: string = '',
              public entity_type: string = '',
              public date_time: string = '',
              public key_values: string = '',
              public new_values: string = '',
              public user_id: number = 0,
              public action_type: number = 0,
              public action_type_description: string = '',
              public entity_type_friendly_name: string = '') {
  }
}
