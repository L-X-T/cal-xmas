import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LuggageDomainModule } from '@flight-workspace/luggage/domain';
import { LuggageUiCardModule } from '@flight-workspace/luggage/ui-card';
import { LoggerModule } from '@flight-workspace/logger-lib';

import { CheckinComponent } from './checkin.component';

@NgModule({
  imports: [CommonModule, LuggageDomainModule, LuggageUiCardModule, LoggerModule, RouterModule.forChild([{ path: '', component: CheckinComponent }])],
  declarations: [CheckinComponent],
  exports: [CheckinComponent]
})
export class LuggageFeatureCheckinModule {}
