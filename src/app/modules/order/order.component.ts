import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { OrderProduct, OrderDetails } from '../../models';
import { EmissionCmRequest } from '../../models/request/EmissionCmRequest';
import { EmissionCmResponse } from '../../models/request/EmissionCmResponse';
import { OrderService } from '../../services/order.service';
import { AlertService } from '../../_services/alert.service';

@Component({ templateUrl: 'order.component.html' })
export class OrderComponent {
  @Output() submit: EventEmitter<EmissionCmRequest | undefined> =
    new EventEmitter();

  readonly addDetails$ = new BehaviorSubject<boolean>(false);
  readonly result$ = new BehaviorSubject<EmissionCmResponse | undefined>(
    undefined
  );
  readonly resultJson$ = this.result$.pipe(
    map((r) => r && JSON.stringify(r, null, 4))
  );

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
    orderDetails: new FormControl<OrderDetails | undefined>(undefined),
  };

  readonly cmForm = new FormGroup(this.controls);

  constructor(
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.submit
      .asObservable()
      .pipe(
        untilDestroyed(this),
        mergeMap((formValues) => this.orderService.orderRequest(formValues))
      )
      .subscribe({
        next: (result) => {
          this.result$.next(result);
          this.alertService.success('success');
        },
        error: (err) => {
          console.error('error response', err);
          this.result$.next(undefined);
          this.alertService.error(JSON.stringify(err, null, 2));
        },
      });
  }

  ngOnDestroy(): void {
    // Used for untilDestroyed
  }
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
    console.debug('submitForm', values, isValid);
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
