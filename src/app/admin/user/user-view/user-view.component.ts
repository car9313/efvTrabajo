import {Component, OnInit} from '@angular/core';
import {animations, IComponentView} from '@app/nodachi';
import {User} from '../user';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  animations: animations
})
export class UserViewComponent extends IComponentView<User> implements OnInit {

  constructor(public userService: UserService, public router: Router, public route: ActivatedRoute) {
    super(userService, route, router, 'Detalles', new User());
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
