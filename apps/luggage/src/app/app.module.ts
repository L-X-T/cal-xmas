import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,

    // LuggageFeatureCheckinModule,
    // LuggageFeatureReportLossModule,

    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'check-in'
      },
      {
        path: 'check-in',
        loadChildren: () => import('@flight-workspace/luggage/feature-checkin').then((m) => m.LuggageFeatureCheckinModule)
      },
      {
        path: 'report-loss',
        loadChildren: () => import('@flight-workspace/luggage/feature-report-loss').then((m) => m.LuggageFeatureReportLossModule)
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
