import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-lib';

@Injectable()
export class FlightBookingEffects {
  loadFlights$ = createEffect((): Observable<any> => {
    return this.actions$.pipe(
      ofType(FlightBookingActions.loadFlights),
      delay(3000), // just here to show the isLoading state
      switchMap((a) =>
        this.flightService.find(a.from, a.to, a.urgent).pipe(
          map((flights) => FlightBookingActions.loadFlightsSuccessfully({ flights })),
          catchError((err) => of(FlightBookingActions.loadFlightsError({ err })))
        )
      )
    );
  });

  constructor(private actions$: Actions, private flightService: FlightService) {}
}
