import {Component, OnInit} from '@angular/core';
import {Role} from './roles';
import {RoleService} from './roles.service';
import {animations} from '@app/nodachi/utils/animations';
import {IComponentModal} from '@app/nodachi/utils/icomponent_modal';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  animations: animations,
})

export class RoleComponent extends IComponentModal<Role> implements OnInit {

  constructor(private roleService: RoleService) {
    super(roleService, 'Role', new Role(), 'Administrar Roles');
    this.headers = {name: 'Nombre'};
    this.headersExcel = [
      {name: 'name', key: 'Nombre'}
    ];
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.permissions.read = false;
  }
}
