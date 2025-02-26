import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {WorkstationDesc} from '@app/admin/user/workstationdesc';


@Injectable({providedIn: 'root'})
export class SaicoLayoutService {

  private readonly emitter: Subject<{ menuState: string, sm_col: number, md_col: number, lg_col: number }>;
  private readonly emitterTitle: Subject<string>;
  private readonly emitterHelp: Subject<string>;
  menuState: string;
  sm_col: number;
  md_col: number;
  lg_col: number;
  emitterWorkStation: Subject<WorkstationDesc>;

  constructor() {
    this.menuState = 'in';
    this.sm_col = 8;
    this.md_col = 9;
    this.lg_col = 10;
    this.emitter = new Subject<{ menuState: string, sm_col: number, md_col: number, lg_col: number }>();
    this.emitterTitle = new Subject<string>();
    this.emitterHelp = new Subject<string>();
    this.emitterWorkStation = new Subject<WorkstationDesc>();
  }

  toggleMenu(): Observable<{ menuState: string, sm_col: number, md_col: number, lg_col: number }> {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.sm_col = this.menuState === 'out' ? 12 : 8;
    this.md_col = this.menuState === 'out' ? 12 : 9;
    this.lg_col = this.menuState === 'out' ? 12 : 10;
    const menu = {menuState: this.menuState, sm_col: this.sm_col, md_col: this.md_col, lg_col: this.lg_col};
    if (this.emitter) {
      this.emitter.next(menu);
    }
    return of(menu);
  }

  closeMenu(): Observable<{ menuState: string, sm_col: number, md_col: number, lg_col: number }> {
    this.menuState = 'out';
    this.sm_col = 12;
    this.md_col = 12;
    this.lg_col = 12;
    const menu = {menuState: this.menuState, sm_col: this.sm_col, md_col: this.md_col, lg_col: this.lg_col};
    if (this.emitter) {
      this.emitter.next(menu);
    }
    return of(menu);
  }

  getObserver(): Observable<{ menuState: string, sm_col: number, md_col: number, lg_col: number }> {
    return this.emitter.asObservable();
  }

  setTitle(title: string) {
    if (this.emitterTitle) {
      this.emitterTitle.next(title);
    }
  }

  getTitle(): Observable<string> {
    return this.emitterTitle.asObservable();
  }

  setWorkStation(work_station: WorkstationDesc): any {
    if (this.emitterWorkStation) {
      this.emitterWorkStation.next(work_station);
    }
  }

  getWorkStation(): Observable<WorkstationDesc> {
    return this.emitterWorkStation.asObservable();
  }
  setHelp(help: string) {
    if (this.emitterHelp) {
      this.emitterHelp.next(help);
    }
  }

  getHelp(): Observable<string> {
    return this.emitterHelp.asObservable();
  }
}
