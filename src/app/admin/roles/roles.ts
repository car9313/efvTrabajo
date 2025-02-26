import {Action} from './actions';

export class Role {
  constructor(public id: number = 0,
              public name: string = '',
              public editable: boolean = true,
              public deletable: boolean = true,
              public permissions: Array<Action> = []) {
  }
}
