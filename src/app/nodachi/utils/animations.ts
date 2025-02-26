import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const animations = [
  trigger('fadeIn', [
    state('*', style({ opacity: 1 })),
    transition('void => *', [style({ opacity: 0 }), animate('800ms linear')]),
  ]),
];
