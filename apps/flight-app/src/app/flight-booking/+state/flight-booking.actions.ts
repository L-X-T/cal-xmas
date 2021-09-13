import { createAction, props } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-lib';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFlights = createAction('[FlightBooking] LoadFlights', props<{ from: string; to: string; urgent: boolean }>());
export const loadFlightsError = createAction('[FlightBooking] LoadFlightsError', props<{ err: HttpErrorResponse }>());
export const loadFlightsSuccessfully = createAction('[FlightBooking] LoadFlightsSuccessfully', props<{ flights: Flight[] }>());

export const updateFlight = createAction('[FlightBooking] UpdateFlight', props<{ flight: Flight }>());
