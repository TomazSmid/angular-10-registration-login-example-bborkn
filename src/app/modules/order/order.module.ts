import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order.routing.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, OrderRoutingModule],
  declarations: [OrderComponent],
})
export class OrderModule {}
