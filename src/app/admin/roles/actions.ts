export class Action {
  constructor(public resource: string = '',
              public actions: Array<string> = []) {
  }

  static added = 1;
  static deleted = 2;
  static unchanged = 0;
}
