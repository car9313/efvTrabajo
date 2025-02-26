import {  OwlDateTimeIntl} from './ng-datepicker/date-time';

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY HH:mm',
  parseAnyInput: ['DD/MM/YYYY HH:mm', 'DD/MM/YYYY'],
  fullPickerInput: 'DD/MM/YYYY HH:mm',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

// here is the default text string
export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'Adicionar un segundo';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'Quitar un segundo';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'Adicionar un minuto';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'Quitar un minuto';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'Adicionar una hora';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'Quitar una hora';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Mes anterior';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Próximo mes';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Año anterior';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Próximo año';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = '21 años atras';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Proximos 21 años';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Cambiar a vista de meses';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Escoje mes y año';

  /** A label for the cancel button */
  cancelBtnLabel = 'Cancelar';

  /** A label for the set button */
  setBtnLabel = 'Confirmar';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'Desde';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'Hasta';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}

// export const DefaultIntl = {
//   /** A label for the up second button (used by screen readers).  */
//   upSecondLabel: 'Adicionar un segundo',
//
//   /** A label for the down second button (used by screen readers).  */
//   downSecondLabel: 'Quitar un segundo',
//
//   /** A label for the up minute button (used by screen readers).  */
//   upMinuteLabel: 'Adicionar un minuto',
//
//   /** A label for the down minute button (used by screen readers).  */
//   downMinuteLabel: 'Quitar un minuto',
//
//   /** A label for the up hour button (used by screen readers).  */
//   upHourLabel: 'Adicionar una hora',
//
//   /** A label for the down hour button (used by screen readers).  */
//   downHourLabel: 'Quitar una hora',
//
//   /** A label for the previous month button (used by screen readers). */
//   prevMonthLabel: 'Mes anterior',
//
//   /** A label for the next month button (used by screen readers). */
//   nextMonthLabel: 'Próximo mes',
//
//   /** A label for the previous year button (used by screen readers). */
//   prevYearLabel: 'Año anterior',
//
//   /** A label for the next year button (used by screen readers). */
//   nextYearLabel: 'Próximo año',
//
//   /** A label for the previous multi-year button (used by screen readers). */
//   prevMultiYearLabel: '21 años atras',
//
//   /** A label for the next multi-year button (used by screen readers). */
//   nextMultiYearLabel: 'Proximos 21 años',
//
//   /** A label for the 'switch to month view' button (used by screen readers). */
//   switchToMonthViewLabel: 'Cambiar a vista de meses',
//
//   /** A label for the 'switch to year view' button (used by screen readers). */
//   switchToMultiYearViewLabel: 'Escoje mes y año',
//
//   /** A label for the cancel button */
//   cancelBtnLabel: 'Cancelar',
//
//   /** A label for the set button */
//   setBtnLabel: 'Confirmar',
//
//   /** A label for the range 'from' in picker info */
//   rangeFromLabel: 'Desde',
//
//   /** A label for the range 'to' in picker info */
//   rangeToLabel: 'Hasta',
//
//   /** A label for the hour12 button (AM) */
//   hour12AMLabel: 'AM',
//
//   /** A label for the hour12 button (PM) */
//   hour12PMLabel: 'PM'
// };
