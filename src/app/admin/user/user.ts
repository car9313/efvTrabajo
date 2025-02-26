import { Role } from '../roles/roles';

export class User {
  constructor(
    public id: number = null,
    public name: string = '',
    public username: string = '',
    public role_ids: number[] = [],
    public roles: Role[] = [],
    public password: string = '',
    public password_confirmation: string = ''
  ) {}
}
