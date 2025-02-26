import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class SpinService {

  private readonly eventSource: Subject<boolean>;
  public events: Observable<boolean>;
  private loaders: Array<Promise<any>>;

  constructor() {
    this.eventSource = new Subject<boolean>();
    this.events = this.eventSource.asObservable();
    this.loaders = [];
  }

  startLoading() {
    this.emitEvent(true);
  }

  stopLoading() {
    this.emitEvent(false);
  }

  private emitEvent(event: boolean) {
    if (this.eventSource) {
      this.eventSource.next(event);
    }
  }

  registerLoader(method: Promise<any>): void {
    this.loaders.push(method);
  }

  clear(): void {
    this.loaders = [];
  }

  load(): void {
    this.startLoading();
    this.executeAll();
  }

  private executeAll(done = () => {
  }): void {
    Promise.all(this.loaders).then((values) => {
      this.stopLoading();
      done.call(null, values);
    })
      .catch((error) => {
        console.error(error);
      });
  }
}
