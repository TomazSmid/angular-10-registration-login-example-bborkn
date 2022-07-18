import { formatNumber } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { OrderProduct } from '../../../models/OrderProduct';
import { isEqual } from '../../../utils/is-equal.util';
import { OrderProductEnum as FormField } from '../enums/';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'order-form[date][whrId][ewhrId]',
  templateUrl: './order-form.component.html',
})
export class DailyWorkingHoursFormComponent implements OnInit, OnDestroy {
  @Output() submit: EventEmitter<OrderProduct | undefined> = new EventEmitter();

  readonly controls: { [key in keyof OrderProduct]: FormControl } = {
    gtin: new FormControl<string|undefined>(undefined),
    quantity: new FormControl(undefined),
    serialNumberType: new FormControl(undefined),
    serialNumbers: new FormControl(undefined),
    templateId: new FormControl(undefined),
  };

  // tslint:disable-next-line:no-any
  readonly form = new FormGroup(this.controls as any);

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(isEqual), // Prevent loop
        debounceTime(300) // Save only after a period of inactivity
      )
      .subscribe((formValues) =>
        this.submitForm(formValues, this.isFormValid())
      );
  }

  ngOnDestroy(): void {
    // Used for untilDestroyed
  }

  private submitForm(values: OrderProduct, isValid: boolean) {
    if (isValid) {
      this.submit.emit(values);
    } else {
      this.submit.emit(undefined);
    }
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }
}
