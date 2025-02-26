import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';

export enum ProgressLineEventType {
  HEIGHT,
  COLOR,
  VISIBLE
}

export class ProgressLineEvent {
  constructor(public type: ProgressLineEventType, public value: any) {
  }
}

/**
 * SlimLoadingBar service helps manage Slim Loading bar on the top of screen or parent component
 */
@Injectable()
export class ProgressLineService {

  private _height: string;
  private _color: string;
  private _visible: boolean;

  private readonly eventSource: Subject<ProgressLineEvent>;
  public events: Observable<ProgressLineEvent>;

  constructor() {
    this._height = '3px';
    this._color = 'firebrick';
    this._visible = true;

    this.eventSource = new Subject<ProgressLineEvent>();
    this.events = this.eventSource.asObservable();
  }


  set height(value: string) {
    if (!isNullOrUndefined(value)) {
      this._height = value;
      this.emitEvent(new ProgressLineEvent(ProgressLineEventType.HEIGHT, this._height));
    }
  }

  get height(): string {
    return this._height;
  }

  set color(value: string) {
    if (!isNullOrUndefined(value)) {
      this._color = value;
      this.emitEvent(new ProgressLineEvent(ProgressLineEventType.COLOR, this._color));
    }
  }

  get color(): string {
    return this._color;
  }

  set visible(value: boolean) {
    if (!isNullOrUndefined(value)) {
      this._visible = value;
      this.emitEvent(new ProgressLineEvent(ProgressLineEventType.VISIBLE, this._visible));
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  private emitEvent(event: ProgressLineEvent) {
    if (this.eventSource) {
      // Push up a new event
      this.eventSource.next(event);
    }
  }


  start(onCompleted: Function = null) {
    this.visible = true;
    if (onCompleted) {
      onCompleted();
    }
  }

  stop() {
    this.visible = false;
  }

  reset() {
    this.stop();
  }

  complete(onCompleted: Function = null) {
    this.stop();
    if (onCompleted) {
      onCompleted();
    }
  }
}
