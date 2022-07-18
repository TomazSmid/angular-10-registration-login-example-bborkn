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
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { OrderProduct } from '../../../../models/OrderProduct';
import { filterUndefined } from '../../../../utils/filter-undefined.util';
import { isEqual } from '../../../../utils/is-equal.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'order-product-form',
  templateUrl: './order-product-form.component.html',
  styleUrls: ['./order-product-form.component.css'],
})
export class OrderProductFormComponent implements OnInit, OnDestroy {
  @Input() set doSubmit(doSubmit: void) {
    this.onSubmit();
  }
  @Input() set productControl(
    productControl: FormControl<OrderProduct | undefined>
  ) {
    this.productControl$.next(productControl);
  }

  @Output() submit: EventEmitter<OrderProduct | undefined> = new EventEmitter();

  readonly productControl$ = new BehaviorSubject<
    FormControl<OrderProduct | undefined>
  >(undefined);

  // Comment generic type in oder to get specific values, uncomment to get key validation
  readonly controls /*: { [key in keyof OrderProduct]: AbstractControl } */ = {
    gtin: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(14),
      Validators.maxLength(14),
    ]),
    quantity: new FormControl(undefined, [Validators.required]),
    templateId: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    serialNumberType: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    serialNumbers: new FormArray([
      new FormControl<string>('', [Validators.required]),
    ]),
  };

  readonly orderForm = new FormGroup(this.controls);

  ngOnInit(): void {
    this.orderForm.valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(isEqual),
        debounceTime(300) // Save only after a period of inactivity
      )
      .subscribe((formValues) =>
        this.submitForm(formValues, this.isFormValid())
      );

    combineLatest([
      this.productControl$.pipe(distinctUntilChanged(), filterUndefined()),
      this.orderForm.valueChanges,
    ])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ([productControl, values]) => {
          if (this.isFormValid()) {
            productControl.setValue(values as OrderProduct);
          } else {
            productControl.setValue(undefined);
          }
        },
      });
  }

  ngOnDestroy(): void {
    // Used for untilDestroyed
  }

  get serialNumbers() {
    return this.controls.serialNumbers;
  }

  addSerialNumber() {
    this.controls.serialNumbers.push(
      new FormControl<string>('', [Validators.required])
    );
  }

  removeSerialNumber(index) {
    this.controls.serialNumbers.removeAt(index);
  }

  onSubmit(): void {
    this.submitForm(this.orderForm.value, this.isFormValid());
  }

  submitForm(values: Partial<OrderProduct>, isValid: boolean) {
    if (isValid) {
      this.submit.emit(values as OrderProduct);
    } else {
      this.submit.emit(undefined);
    }
  }

  getControlMessages(control: FormControl): string[] {
    if (!control) {
      return [];
    }

    return Object.keys(control.errors || {});
  }

  private isFormValid(): boolean {
    return this.orderForm.valid;
  }
}
