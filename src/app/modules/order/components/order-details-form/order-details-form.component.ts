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
  AbstractControl,
} from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderDetails } from '../../../../models/OrderDetails';
import { isEqual } from '../../../../utils/is-equal.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.css'],
})
export class OrderDetailsFormComponent implements OnInit, OnDestroy {
  @Input() set doSubmit(doSubmit: void) {
    this.onSubmit();
  }

  @Output() submit: EventEmitter<OrderDetails | undefined> = new EventEmitter();

  // Comment generic type in oder to get specific values, uncomment to get key validation
  readonly controls /* : { [key in keyof OrderDetails]: AbstractControl } */ = {
    factoryId: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    factoryName: new FormControl<string | undefined>(undefined),
    factoryAddress: new FormControl<string | undefined>(undefined),
    factoryCountry: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    productionLineId: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    productCode: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    productDescription: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    poNumber: new FormControl<string | undefined>(undefined),
    expectedStartDate: new FormControl<string | undefined>(undefined),
  };

  readonly detailsForm = new FormGroup(this.controls);

  ngOnInit(): void {
    this.detailsForm.valueChanges
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

  onSubmit(): void {
    this.submitForm(this.detailsForm.value, this.isFormValid());
  }

  submitForm(values: Partial<OrderDetails>, isValid: boolean) {
    if (isValid) {
      this.submit.emit(values as OrderDetails);
    } else {
      this.submit.emit(undefined);
    }
  }

  private isFormValid(): boolean {
    return this.detailsForm.valid;
  }
}
