export class Permissions {
  constructor(public resource: string = '',
              public actions: Array<string> = [],
              public description: string = '') {
  }
}
