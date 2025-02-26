import { InjectionToken, Injector, Type } from '@angular/core';

export class ServiceLocator {
  public static injector: Injector;

  static get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    return ServiceLocator.injector.get<T>(token, notFoundValue);
  }
}
