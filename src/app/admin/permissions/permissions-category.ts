import {Permissions} from './permissions';

export class PermissionsCategory {
  constructor(public name: string = '',
              public permissions: Array<Permissions> = []) {
  }
}
