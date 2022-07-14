import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent implements OnInit, OnDestroy {
  airports$: Observable<string[]>;

  // 1 using subscription & unsubscribe
  airports: string[] = [];
  private airportsObserver: Observer<string[]>;
  private airportsSubscription: Subscription;

  constructor(private airportService: AirportService) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll();

    this.airportsObserver = {
      next: (airports) => this.onLoadAirportsSuccessfully(airports),
      error: (err) => this.onLoadAirportsFail(err),
      complete: () => {
        console.warn('airports$ completed');
      }
    };

    // 1 using subscription & unsubscribe
    this.airportsSubscription = this.airports$.subscribe(this.airportsObserver);
  }

  ngOnDestroy(): void {
    // 1 using subscription & unsubscribe
    this.airportsSubscription?.unsubscribe();
  }

  private onLoadAirportsSuccessfully(airports: string[]): void {
    console.log('airports$ next: ' + airports);
    this.airports = airports;
  }

  private onLoadAirportsFail(err: HttpErrorResponse): void {
    console.error('airports$ error: ' + err);
  }
}
