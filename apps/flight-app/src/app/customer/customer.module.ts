import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingHistoryComponent } from './booking-history/booking-history.component';

// Add imports:
import { RouterModule } from '@angular/router';
import { CUSTOMER_ROUTES } from './customer.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    // Add SharedModule:
    SharedModule,
    // Add RouterModule + Routing Config:
    RouterModule.forChild(CUSTOMER_ROUTES)
  ],
  declarations: [BookingHistoryComponent]
})
export class CustomerModule {}
