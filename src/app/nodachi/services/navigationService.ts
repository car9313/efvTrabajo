import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {ServiceLocator} from '@app/nodachi/services/locator.service';

export class NavigationService {
  public static router: Router;

  static reload() {
    if (isNullOrUndefined(NavigationService.router)) {
      NavigationService.router = ServiceLocator.get(Router) as Router;
    }
    const currentUrl = NavigationService.router.url;

    NavigationService.router.navigateByUrl('/reload', {skipLocationChange: true})
      .then(() => {
        NavigationService.router.navigate([currentUrl]);
      });
  }
}
