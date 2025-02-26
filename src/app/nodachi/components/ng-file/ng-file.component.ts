import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {isNullOrUndefined} from '@app/nodachi/utils/utility';
import {ImagePlaceholderService} from '../../services/image-placeholder.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ng-file',
  templateUrl: './ng-file.component.html',
  styleUrls: ['./ng-file.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: NgFileComponent, multi: true},
    {provide: NG_VALIDATORS, useExisting: NgFileComponent, multi: true},
  ],
})
export class NgFileComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  objFile: File;
  photo: any;
  _fileName: string;
  _fileUrl: string;
  _photoType: string;

  @Input()
  fileRegex: any;

  @Input()
  set fileUrl(value: string) {
    if (!isNullOrUndefined(value) && value !== '') {
      this._fileUrl = value;
    } else {
      if (!isNullOrUndefined(this._photoType) && this._photoType !== '') {
        this._fileUrl = this.imagePlaceholderService.getPlaceHolder(this._photoType);
      }
    }
  }

  @Input()
  removeUrl: string;

  @Input()
  set photoType(value: string) {
    if (value && value !== '') {
      this._photoType = value;
      this.fileUrl = this._fileUrl;
    }
  }

  @Input()
  set fileName(value: string) {
    this._fileName = value;
  }

  @Output()
  change: EventEmitter<any>;

  /**
   * @type {AbstractControl}
   * @private
   */
  private _control: AbstractControl;

  readonly emptyMsg = 'Seleccionar archivo...';

  constructor(public imagePlaceholderService: ImagePlaceholderService, public httpClient: HttpClient) {
    this.change = new EventEmitter<any>();
    this.fileRegex = /image\/(.*)/;
    this._fileName = null;
    this.fileUrl = '';
    this.photoType = '';
    this.removeUrl = '';
  }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    if (isNullOrUndefined(obj)) {
      this._fileName = this.emptyMsg;
      this.photo = null;
      this.fileInput.nativeElement.value = null;
    }
    this.objFile = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(_) {
  }

  onTouched() {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    if (!this._control) {
      this._control = c;
    }
    return c.hasError('valid') ? {valid: 'not valid'} : null;
  }

  selectPhoto(event: any, input: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files && event.target.files[0] && input.valid) {
        this.objFile = event.target.files[0];
        this._control.setErrors({});
      } else {
        this._control.setErrors({valid: 'false'});
        this.objFile = null;
      }
      this.change.emit(event);
      this.onChange(this.objFile);
      this._fileName = (this.objFile) ? this.objFile.name : this.emptyMsg;
    } else {
      this.objFile = null;
      this.change.emit(event);
      this.onChange(this.objFile);
      this._fileName = !isNullOrUndefined(this.objFile) ? this.objFile.name : this.emptyMsg;
    }
    this.onTouched();
  }

  remove() {
    this.objFile = null;
    this.change.emit(event);
    this.onChange(this.objFile);
    this._fileName = null;
    this.fileInput.nativeElement.value = null;
    this.fileUrl = null;
    if (!isNullOrUndefined(this.removeUrl) && this.removeUrl !== '') {
      this.httpClient.delete(this.removeUrl).subscribe();
    }
  }
}
