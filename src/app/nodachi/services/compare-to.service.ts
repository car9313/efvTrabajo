import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompareToService {

  constructor() { }

  public compare(): void {
    setTimeout(() => {
      $('[compareTo]').each((index, element) => {
        const selector = element.getAttribute('compareto');

        const otherElem = $(selector);
        console.log(element.innerText.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase());
        console.log(otherElem.text().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase());
        if (
          otherElem.length &&
          otherElem.text().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() !==
            element.innerText.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
        ) {
          otherElem.addClass('compare-error');
        } else {
          otherElem.removeClass('compare-error');
        }
      });
    }, 500);
  }
}
