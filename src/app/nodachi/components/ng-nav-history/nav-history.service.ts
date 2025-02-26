import {Injectable} from '@angular/core';

export interface HistoryItem {
  url: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavHistoryService {

  historyItems: Array<HistoryItem>;

  constructor() {
    this.historyItems = [];
  }

  add(item: HistoryItem) {
    if (this.checkExist(item.url) === -1) {
      if (this.historyItems.length >= 5) {
        this.historyItems.shift();
      }
      if (this.checkExistTitle(item.title) !== -1) {
        const index = this.checkExistTitle(item.title);
        this.historyItems.splice(index, 1);
      }
      this.historyItems.push(item);
    }
  }

  remove(url: string) {
    const index = this.checkExist(url);
    if (index !== -1) {
      this.historyItems.splice(index, 1);
    }
  }

  removeAll() {
    this.historyItems = [];
  }

  removeOther(url: string) {
    const index = this.checkExist(url);
    if (index !== -1) {
      this.historyItems = [this.historyItems[index]];
    }
  }

  checkExist(url: string): number {
    return this.historyItems.findIndex(value => {
      return value.url.trim() === url.trim();
    });
  }
  checkExistTitle(title: string): number {
    return this.historyItems.findIndex(value => {
      return value.title.trim() === title.trim();
    });
  }
}
