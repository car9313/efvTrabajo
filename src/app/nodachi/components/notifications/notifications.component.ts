import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NotificationService} from '@app/nodachi/services/notification.service';
import {SignalREvent, SignalRService} from '@app/nodachi/services/signal-r.service';
import {Notification} from '@app/nodachi/components/notifications/notification';
import {Notifications} from '@app/nodachi/services/notifications';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  notificationsCount: number;

  constructor(private notificationService: NotificationService,
              private signalR: SignalRService,
              private notifications: Notifications,
              private router: Router,
              private ref: ChangeDetectorRef) {
    this.notificationsCount = 0;
  }

  ngOnInit() {
    this.notificationService.getCount().subscribe(resp => {
      this.notificationsCount = resp;
      this.ref.detectChanges();
    });
    // this.signalR.initializeSignalRConnection([
    //   new SignalREvent('notify', this.onNotify(this)),
    //   new SignalREvent('markAsRead', this.onMarkAsRead(this)),
    //   new SignalREvent('markAsReadAll', this.onMarkAsReadAll(this)),
    // ]);
  }

  onNotify(self) {
    return (notification: Notification) => {
      self.notificationsCount++;
      self.notifications.info(notification.message, 10000, {positionClass: 'toast-top-right'});
      self.ref.detectChanges();
    };
  }

  onMarkAsRead(self) {
    return () => {
      if (self.notificationsCount > 0) {
        self.notificationsCount--;
        self.ref.detectChanges();
      }
    };
  }

  onMarkAsReadAll(self) {
    return () => {
      self.notificationsCount = 0;
      self.ref.detectChanges();
    };
  }
}
