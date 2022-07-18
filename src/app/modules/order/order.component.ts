import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OrderProduct, OrderDetails } from '../../models';
import { EmissionCmRequest } from '../../models/request/EmissionCmRequest';

@Component({ templateUrl: 'order.component.html' })
export class OrderComponent {
  @Output() submit: EventEmitter<EmissionCmRequest | undefined> =
    new EventEmitter();

  readonly addDetails$ = new BehaviorSubject<boolean>(false);

  // Comment generic type in oder to get specific values, uncomment to get key validation
  readonly controls /*: Omit<
    { [key in keyof EmissionCmRequest]: AbstractControl },
    'omsId'
  >*/ = {
    products: new FormArray([
      new FormControl<OrderProduct | undefined>(undefined, [
        Validators.required,
      ]),
    ]),
    orderDetails: new FormControl<OrderDetails | undefined>(undefined, [
      Validators.required,
    ]),
  };

  readonly cmForm = new FormGroup(this.controls);

  addProduct() {
    this.controls.products.push(
      new FormControl<OrderProduct | undefined>(undefined, [
        Validators.required,
      ])
    );
  }

  removeProduct(index) {
    this.controls.products.removeAt(index);
  }

  submitForm(values: Partial<EmissionCmRequest>, isValid: boolean) {
    if (isValid) {
      this.submit.emit(values as EmissionCmRequest);
    } else {
      this.submit.emit(undefined);
    }
  }

  onSubmit(): void {
    const values = this.cmForm.value;
    if (!this.addDetails$.value) {
      values.orderDetails = undefined;
    }
    this.submitForm(values, this.isFormValid());
  }

  private isFormValid(): boolean {
    return this.cmForm.valid;
  }
}
