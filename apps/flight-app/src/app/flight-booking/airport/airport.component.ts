import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

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

  // 2 takeUntil & subject
  airportsTakeUntil: string[] = [];
  private terminatorSubject = new Subject<void>();
  readonly terminator$ = this.terminatorSubject.asObservable();

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

    // 2 takeUntil & subject
    this.airports$.pipe(takeUntil(this.terminator$)).subscribe({
      next: (airports) => {
        console.log('airportsTakeUntil$ next: ', airports);
        this.airportsTakeUntil = airports;
      },
      error: (err) => {
        console.error('airportsTakeUntil$ error: ', err);
      },
      complete: () => {
        console.warn('airportsTakeUntil$ completed');
      }
    });
  }

  ngOnDestroy(): void {
    // 1 using subscription & unsubscribe
    this.airportsSubscription?.unsubscribe();

    // 2 takeUntil & subject
    this.terminatorSubject.next();
    this.terminatorSubject.complete();
  }

  private onLoadAirportsSuccessfully(airports: string[]): void {
    console.log('airports$ next: ' + airports);
    this.airports = airports;
  }

  private onLoadAirportsFail(err: HttpErrorResponse): void {
    console.error('airports$ error: ' + err);
  }
}
