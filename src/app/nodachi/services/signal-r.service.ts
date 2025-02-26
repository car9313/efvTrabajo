import {Injectable} from '@angular/core';
import {ConfigService} from './config.services';
import 'signalr';
import Proxy = SignalR.Hub.Proxy;
import Connection = SignalR.Hub.Connection;
import {UserService} from '../../admin/user/user.service';

// declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private static started = false;
  private static connection: Connection;
  private static proxy: Proxy;

  private userName: string;

  constructor(private configService: ConfigService, private userService: UserService) {
  }

  public static disconnect() {
    if (SignalRService.started && SignalRService.connection) {
      SignalRService.connection.stop();
      SignalRService.started = false;
    }
  }

  public initializeSignalRConnection(events?: SignalREvent[]): void {
    if (SignalRService.started) {
      return;
    }
    this.userName = this.userService.currentUserName;
    if (!this.userName) {
      return;
    }
    this.initialize(events);
  }

  public initialize(events?: SignalREvent[]) {
    if (!SignalRService.connection) {
      SignalRService.connection = $.hubConnection(this.configService.url());
      if (!SignalRService.proxy) {
        SignalRService.proxy = SignalRService.connection.createHubProxy('NotificationHub');
      }

      SignalRService.connection.disconnected(this.onDisconnected(this));
    }

    SignalRService.connection.qs = {userName: this.userName};

    if (events) {
      events.forEach(event => {
        this.on(event.eventName, event.callback);
      });
    }

    SignalRService.connection.start().done(this.onConnect(this)).catch(this.onConnectError(this));
  }

  public onConnect(self) {
    return () => {
      SignalRService.started = true;
      console.log('Connected to Notification Hub');
    };
  }

  public onConnectError(self) {
    return (error) => {
      SignalRService.started = false;
      console.log('Notification Hub error -> ' + error);
    };
  }

  public onDisconnected(self) {
    return () => {
      console.log('SignalR disconnected, retry connection in 5s');
      setTimeout(() => {
        self.initialize();
      }, 5000); // Restart connection after 5 seconds.
    };
  }

  public on(eventName: string, callback: (...msg: any[]) => void): Proxy {
    return SignalRService.proxy.on(eventName, callback);
  }
}

export class SignalREvent {
  constructor(public eventName: string, public callback: (...msg: any[]) => void) {
  }
}
