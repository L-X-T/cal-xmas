import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { Observable, Observer, of, Subject, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, share, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent implements OnInit, OnDestroy {
  airports$: Observable<string[]>;

  // 1 using subscription & unsubscribe
  airports: string[] = [];
  airportsIsLoading = true;
  airportsErrorMessage = '';
  private airportsObserver: Observer<string[]>;
  private airportsSubscription: Subscription;

  // 2 takeUntil & subject
  airportsTakeUntil: string[] = [];
  airportsTakeUntilIsLoading = true;
  airportsTakeUntilErrorMessage = '';
  private terminatorSubject = new Subject<void>();
  readonly terminator$ = this.terminatorSubject.asObservable();

  // 3 async airports error handling
  asyncAirports$: Observable<string[]>;
  asyncAirportsErrorMessage = '';

  constructor(private airportService: AirportService) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll().pipe(delay(3000), share());

    this.asyncAirports$ = this.airports$.pipe(
      catchError((err) => {
        this.asyncAirportsErrorMessage = err.message;
        return of([]);
      })
    );

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
        this.airportsTakeUntilIsLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('airportsTakeUntil$ error: ', err);
        this.airportsTakeUntilIsLoading = false;
        this.airportsTakeUntilErrorMessage = err.message;
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
    this.airportsIsLoading = false;
  }

  private onLoadAirportsFail(err: HttpErrorResponse): void {
    console.error('airports$ error: ' + err);
    this.airportsIsLoading = false;
    this.airportsErrorMessage = err.message;
  }
}
