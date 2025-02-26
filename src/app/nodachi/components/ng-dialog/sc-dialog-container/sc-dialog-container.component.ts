import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {FocusTrap, FocusTrapFactory} from '@angular/cdk/a11y';
import {DOCUMENT} from '@angular/common';
import {AnimationEvent} from '@angular/animations';
import {ScDialogConfig} from '../sc-dialog-config';
import {scDialogAnimations} from '../sc-dialog-animations';

export function throwMatDialogContentAlreadyAttachedError() {
  throw Error('Attempting to attach dialog content after content is already attached');
}

@Component({
  selector: 'app-sc-dialog-container',
  templateUrl: './sc-dialog-container.component.html',
  styleUrls: ['./sc-dialog-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [scDialogAnimations.dialogContainer],
})
export class ScDialogContainerComponent extends BasePortalOutlet {

  @HostBinding() class = 'sc-dialog-container';
  @HostBinding() tabindex = '-1';
  @HostBinding('attr.aria-modal') ariaModal = true;
  /** ID for the container DOM element. */
  @HostBinding('attr.id') _id: string;
  @HostBinding('attr.role') attrRole = this._config.role;
  @HostBinding('attr.aria-labelledby') _ariaLabelledBy: string | null = null;
  @HostBinding('attr.aria-label') ariaLabel = this._config.ariaLabel;
  /** ID of the element that should be considered as the dialog's label. */
  @HostBinding('attr.aria-describedby') ariaDescribedBy = this._config.ariaDescribedBy || null;
  /** State of the dialog animation. */
  @HostBinding('@dialogContainer') _state: 'void' | 'enter' | 'exit' = 'enter';
  @HostListener('@dialogContainer.start', ['$event']) dialogContainerStart = this._onAnimationStart;
  @HostListener('@dialogContainer.done', ['$event']) dialogContainerDone = this._onAnimationDone;

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;


  /** Emits when an animation state changes. */
  _animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private _elementRef: ElementRef,
    private _focusTrapFactory: FocusTrapFactory,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) private _document: any,
    /** The dialog configuration. */
    public _config: ScDialogConfig) {

    super();
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throwMatDialogContentAlreadyAttachedError();
    }

    this._savePreviouslyFocusedElement();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throwMatDialogContentAlreadyAttachedError();
    }

    this._savePreviouslyFocusedElement();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    // If were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open animation was running. See:
      // https://github.com/angular/components/issues/16215
      this._elementRef.nativeElement.focus();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this._config.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Saves a reference to the element that was focused before the dialog was opened. */
  private _savePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialogs at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this._animationStateChanged.emit(event);
  }

  /** Callback, invoked when an animation on the host starts. */
  _onAnimationStart(event: AnimationEvent) {
    this._animationStateChanged.emit(event);
  }

  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
